// backend/server.js - Refined for Exact PDF Replication

const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors()); // Allow requests from frontend
app.use(express.json({ limit: '10mb' })); // Allow large HTML/CSS payloads

// --- PDF Generation Endpoint ---
app.post('/generate-pdf', async (req, res) => {
    console.log('Received request to generate PDF...');
    const { htmlContent, stylesContent, filename = 'resume.pdf' } = req.body;

    // Validate Input
    if (!htmlContent || !stylesContent) {
        const missing = !htmlContent ? 'HTML' : 'CSS';
        console.error(`Error: No ${missing} content provided.`);
        return res.status(400).json({ error: `${missing} content is required.` });
    }

    let browser = null;
    try {
        // 1. Launch Puppeteer
        console.log('Launching Puppeteer...');
        browser = await puppeteer.launch({
            headless: true,
            args: [ '--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none', '--disable-gpu' ]
        });
        const page = await browser.newPage();

        // 2. Set Viewport
        console.log('Setting viewport...');
        await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 1, });

        // 3. Emulate Print Media Type
        console.log('Emulating print media type...');
        await page.emulateMediaType('print');

        // 4. Construct Full HTML
        console.log('Constructing full HTML...');
        const fullHtml = `
            <!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Resume PDF</title>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css2?family=Georgia&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
                <style>
                    ${stylesContent}
                    body { margin: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    .resume-actions { display: none !important; } /* Hide actions bar */
                </style>
            </head><body>${htmlContent}</body></html>`;

        // 5. Load HTML into Puppeteer
        console.log('Setting page content...');
        await page.setContent(fullHtml, { waitUntil: 'networkidle0', timeout: 60000 });

        // 6. Generate PDF
        console.log('Generating PDF buffer...');
        const pdfBuffer = await page.pdf({
            format: 'Letter', printBackground: true,
            margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
            preferCSSPageBreak: true
        });

        // 7. Send Response
        console.log('PDF generated. Sending response.');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(pdfBuffer);

    } catch (error) { // 8. Handle Errors
        console.error('Error during PDF generation:', error);
        res.status(500).json({ error: 'Failed to generate PDF.', details: error.message });
    } finally { // 9. Close Browser
        if (browser) { console.log('Closing Puppeteer browser.'); await browser.close(); }
    }
});

// --- Start Server ---
app.listen(port, () => { console.log(`PDF server listening at http://localhost:${port}`); });
