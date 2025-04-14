// Your Clerk Publishable Key (should be the same)
const clerkPubKey = "pk_test_Y2hhcm1lZC1sb3VzZS0yOC5jbGVyay5hY2NvdW50cy5kZXYk";

// Get the div where Clerk status messages will be displayed
const statusDiv = document.getElementById('clerk-status');

// Function to initialize Clerk and mount the SignIn component
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
        // IMPORTANT: Use the new ID from login.html
        const signInContainer = document.getElementById('clerk-signin-target');

        if (signInContainer) {
            // Mount the SignIn component (DIFFERENT from SignUp)
            Clerk.mountSignIn(signInContainer, {
                // --- Configuration Options ---
                signUpUrl: '/signup.html', // REQUIRED: Path to your signup page
                // redirectUrl: '/dashboard.html', // Optional: Redirect after successful sign in
                // Appearance settings to match your dark theme (same as signup)
                appearance: {
                    baseTheme: 'dark',
                    variables: {
                        colorPrimary: '#4361ee',
                        colorBackground: 'hsl(231, 30%, 18%)', // Match your .auth-section background
                        colorInputBackground: 'rgba(255, 255, 255, 0.1)',
                        colorInputText: 'white',
                    },
                    // layout: { socialButtonsPlacement: 'bottom' } // Optional layout adjustments
                },
            });
            console.log("Clerk SignIn component mounted.");
        } else {
            console.error("Target container '#clerk-signin-target' not found in the DOM.");
            if (statusDiv) statusDiv.textContent = 'Error: UI container not found.';
        }
    } catch (err) {
        console.error('Clerk Error:', err);
        if (statusDiv) statusDiv.textContent = 'Failed to initialize authentication.';
    }
};

// --- Dynamically Load ClerkJS Library ---
// This IIFE loads ClerkJS (same logic as in signup.js)
(function () {
    const script = document.createElement('script');
    script.setAttribute('data-clerk-publishable-key', clerkPubKey);
    script.async = true;
    script.src = `https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js`;
    script.crossOrigin = 'anonymous';
    script.addEventListener('load', startClerk); // Run startClerk after loading
    script.addEventListener('error', () => {
        console.error("Failed to load ClerkJS script.");
        if (statusDiv) statusDiv.textContent = 'Failed to load authentication library.';
    });
    document.body.appendChild(script);
})();

