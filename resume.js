/**
 * Resume Builder - Resume Display Handler
 * Handles functionality for resume.html: loading data, selecting/populating
 * the correct template, and enabling PDF download/edit actions via server-side generation.
 */
const ResumeHandler = (function() {
    let resumeData = null; let templateId = '1'; const serverUrl = 'http://localhost:3001/generate-pdf';
    function init() {
        console.log("ResumeHandler init starting..."); loadData();
        if (!resumeData) { console.error("No data. Redirecting..."); alert("Resume data not found."); window.location.href = 'Templates.html'; return; }
        templateId = resumeData.template || '1'; console.log("Using template ID:", templateId);
        showTemplate(); setupListeners(); console.log("ResumeHandler init finished.");
    }
    function loadData() {
        const dataString = localStorage.getItem('resumeData');
        if (dataString) { try { resumeData = JSON.parse(dataString); console.log("Data loaded:", resumeData);} catch(e){ console.error("Parse Error", e); resumeData=null; } }
        else { console.log("No resumeData found."); resumeData=null; }
    }
    function showTemplate() {
        document.querySelectorAll('.resume-container').forEach(c => c.style.display = 'none'); const containerId = `template${templateId}`; const container = document.getElementById(containerId);
        if (container) { container.style.display = 'block'; populateTemplate(container, resumeData); console.log(`Displayed ${containerId}`); }
        else { console.error(`Container ${containerId} not found!`); const first = document.querySelector('.resume-container'); if (first) { first.style.display = 'block'; populateTemplate(first, resumeData); templateId = first.id.replace('template', ''); alert(`Warning: Template ${containerId} not found. Showing default.`); } else { alert("Error: No templates found."); return; } }
        updateEditLink();
    }
    function updateEditLink() { const btn = document.getElementById('editBtn'); if (btn) { if (templateId && document.getElementById(`template${templateId}`)) btn.href = `Form.html?template=${templateId}`; else btn.href = 'Templates.html'; } }
    function populateTemplate(container, data) {
        if (!container || !data) return;
        const setText = (sel, txt) => { const el = container.querySelector(sel); if (el) el.textContent = txt || ''; }; const setHtml = (sel, h) => { const el = container.querySelector(sel); if (el) el.innerHTML = h || ''; };
        const setLink = (sel, url, txt) => { const el = container.querySelector(sel); if (el) { const pI = el.closest('.contact-item'); if (url) { let fU = url; if (sel.includes('email') && !url.startsWith('mailto:')) fU = `mailto:${url}`; else if (sel.includes('website') && !url.startsWith('http') && !url.startsWith('mailto:')) fU = `https://${url}`; if (el.tagName === 'A') el.href = fU; el.textContent = txt || url.replace(/^https?:\/\/(www\.)?/, ''); el.style.display = ''; if (pI) pI.style.display = ''; } else { el.textContent = ''; el.style.display = 'none'; if (pI) pI.style.display = 'none'; } } };
        const formatRes = txt => { if (!txt || typeof txt !== 'string') return ''; const lines = txt.split('\n').map(l => l.trim()).filter(l => l.length > 0); if (lines.length === 0) return ''; let h = '<ul>'; lines.forEach(l => { const sL = l.replace(/</g, "&lt;").replace(/>/g, "&gt;"); h += `<li>${sL}</li>`; }); h += '</ul>'; return h; };
        const getInit = name => { if (!name || typeof name !== 'string') return '??'; const p = name.trim().split(' ').filter(pt => pt.length > 0); if (p.length > 1) return (p[0][0] + p[p.length - 1][0]).toUpperCase(); if (p.length === 1 && p[0].length > 0) return p[0].substring(0, 2).toUpperCase(); return '??'; };

        setText('.full-name', data.fullName); setText('.professional-title', data.professionalTitle); setText('.overview', data.overview); setLink('.email', data.email); setText('.phone', data.phone); setText('.address', data.address); setLink('.website', data.website);
        const skillsTxt = data.skills ? data.skills.split(/[\n,]+/).map(s => s.trim()).filter(s => s).join(' | ') : ''; setText('.skills', skillsTxt);
        const expList = container.querySelector('.experience-list'); if (expList) { expList.innerHTML = ''; if (data.experience && data.experience.length > 0) data.experience.forEach(e => { const h = `<div class="experience-item"><h3>${e.position||''}</h3><p class="company-info"><span class="company">${e.company||''}</span>${e.company&&e.duration?' | ':''}<span class="duration">${e.duration||''}</span></p>${formatRes(e.responsibilities)}</div>`; expList.insertAdjacentHTML('beforeend', h); }); else expList.innerHTML = '<p><em>Experience details not provided.</em></p>'; }
        const eduList = container.querySelector('.education-list'); if (eduList) { eduList.innerHTML = ''; if (data.education && data.education.length > 0) data.education.forEach(e => { const h = `<div class="education-item"><h3>${e.degree||''}</h3><p class="institution-date"><span class="institution">${e.institution||''}</span>${e.institution&&e.duration?' | ':''}<span class="duration">${e.duration||''}</span></p></div>`; eduList.insertAdjacentHTML('beforeend', h); }); else eduList.innerHTML = '<p><em>Education details not provided.</em></p>'; }
        if (templateId === '2' || templateId === '3') setText('.initials', getInit(data.fullName)); const addrEl = container.querySelector('.address'); const addrPI = addrEl ? addrEl.closest('.contact-item') : null; if (addrEl && !data.address) { if(addrPI) addrPI.style.display = 'none'; else addrEl.style.display = 'none'; } else if (addrEl && data.address) { if(addrPI) addrPI.style.display = ''; else addrEl.style.display = ''; }
    }
    async function getCss() { let css = ''; const links = document.querySelectorAll('head link[rel="stylesheet"]'); console.log(`Found ${links.length} CSS links.`); for (const link of links) { const url = link.href; console.log(`Fetching: ${url}`); try { const res = await fetch(url, { mode: 'cors' }); if (res.ok) { const txt = await res.text(); css += `\n/* ${url} */\n${txt}\n`; console.log(`Fetched ${url}`); } else console.warn(`Failed fetch ${url}: ${res.status}`); } catch (err) { console.error(`Error fetch ${url}:`, err); } } if (!css.trim()) css = 'body { font-family: sans-serif; margin: 1in; }'; return css; }
    function setupListeners() { const btn = document.getElementById('downloadPdfBtn'); if (btn) { btn.addEventListener('click', generatePdf); console.log("DL listener attached."); } else console.warn("DL btn not found."); }
    async function generatePdf() {
        console.log("generatePdf called."); const container = document.getElementById(`template${templateId}`); if (!container || container.style.display === 'none') { alert("Error: Cannot find resume content."); return; }
        const html = container.outerHTML; console.log("Fetching CSS..."); const styles = await getCss(); console.log("CSS fetch done.");
        const filename = `Resume_${(resumeData.fullName || 'User').replace(/[\s\/\\?%*:|"<>]/g, '_')}.pdf`; const btn = document.getElementById('downloadPdfBtn');
        if (btn) { btn.disabled = true; btn.textContent = 'Generating...'; } console.log("Sending to server...");
        try {
            const res = await fetch(serverUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ htmlContent: html, stylesContent: styles, filename }), });
            if (!res.ok) { let eD = `Server error: ${res.status}`; try { const eData = await res.json(); eD = eData.error || JSON.stringify(eData); } catch (e) {} throw new Error(eD); }
            console.log("PDF response received."); const blob = await res.blob(); if (blob.type !== 'application/pdf') throw new Error('Invalid PDF response.');
            const url = window.URL.createObjectURL(blob); const a = document.createElement('a'); a.style.display = 'none'; a.href = url; a.download = filename; document.body.appendChild(a); a.click(); window.URL.revokeObjectURL(url); document.body.removeChild(a); console.log("DL initiated.");
        } catch (err) { console.error('PDF Gen Error:', err); alert(`Failed to generate PDF: ${err.message}`); }
        finally { if (btn) { btn.disabled = false; btn.textContent = 'Download as PDF'; } }
    }
    return { init: init };
})();
document.addEventListener('DOMContentLoaded', ResumeHandler.init);
