// Your Clerk Publishable Key (replace if necessary)
const clerkPubKey = "pk_test_Y2hhcm1lZC1sb3VzZS0yOC5jbGVyay5hY2NvdW50cy5kZXYk"; 

// Get the div where Clerk status messages will be displayed
const statusDiv = document.getElementById('clerk-status');

// Function to initialize Clerk and mount the SignUp component
const startClerk = async () => {
    // ClerkJS attaches itself to the window object
    const Clerk = window.Clerk; 

    if (!Clerk) {
        console.error("Clerk object not found. Check if ClerkJS loaded correctly.");
        if (statusDiv) statusDiv.textContent = 'Error loading authentication component.';
        return;
    }

    try {
        // Load Clerk environment using your publishable key
        await Clerk.load();
        console.log("Clerk loaded successfully.");

        // Find the target div where the component will be mounted
        const signUpContainer = document.getElementById('clerk-signup-target');

        if (signUpContainer) {
            // Mount the SignUp component
            Clerk.mountSignUp(signUpContainer, {
                // --- Configuration Options ---
                signInUrl: 'BrandYou/login.html', // REQUIRED: Path to your login page
                redirectUrl: 'BrandYou/templates.html', // <--- Set your desired page here
                

                // Appearance settings to match your dark theme
                appearance: {
                   baseTheme: 'dark', // Use Clerk's built-in dark theme
                   variables: {
                        colorPrimary: '#4361ee', // Optional: Match your button color if desired
                        colorBackground: 'hsl(232, 31%, 10%)', // Match your .auth-section background
                        colorInputBackground: 'rgba(255, 255, 255, 0.1)', // Match your input background
                        colorInputText: 'white', // Match your input text color
                   },
                   // Example layout adjustment:
                   // layout: { socialButtonsPlacement: 'bottom' } 
                }
            });
            console.log("Clerk SignUp component mounted.");
        } else {
            console.error("Target container '#clerk-signup-target' not found in the DOM.");
            if (statusDiv) statusDiv.textContent = 'Error: UI container not found.';
        }

    } catch (err) {
        console.error('Clerk Error:', err);
        if (statusDiv) statusDiv.textContent = 'Failed to initialize authentication.';
    }
};

// --- Dynamically Load ClerkJS Library ---
// This IIFE (Immediately Invoked Function Expression) loads ClerkJS from the CDN
(function () {
    const script = document.createElement('script');
    script.setAttribute('data-clerk-publishable-key', clerkPubKey);
    script.async = true;
    script.src = `https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js`; // Use latest or a specific version
    script.crossOrigin = 'anonymous';

    // Add listener to run startClerk() AFTER the script has loaded
    script.addEventListener('load', startClerk); 

    // Add error listener for loading issues
    script.addEventListener('error', () => {
      console.error("Failed to load ClerkJS script.");
      if (statusDiv) statusDiv.textContent = 'Failed to load authentication library.';
    });

    // Append the script to the document body to start loading it
    document.body.appendChild(script);
})();
