// Your Clerk Publishable Key (should be the same as in signup/login.js)
const clerkPubKey = "pk_test_Y2hhcm1lZC1sb3VzZS0yOC5jbGVyay5hY2NvdW50cy5kZXYk"; // Use your actual key

// Get the div where the Clerk component will be mounted
const userProfileContainer = document.getElementById('clerk-user-profile-target');
// Get the status div
const statusDiv = document.getElementById('profile-status');

// Function to initialize Clerk and mount the UserProfile component
const startClerk = async () => {
    // ClerkJS attaches itself to the window object
    const Clerk = window.Clerk;

    if (!Clerk) {
        console.error("Clerk object not found. Check if ClerkJS loaded correctly.");
        if (statusDiv) statusDiv.textContent = 'Error loading authentication library.';
        return;
    }

    try {
        // Load Clerk environment using your publishable key
        await Clerk.load();
        console.log("Clerk loaded successfully.");

        // Check if a user is signed in
        if (Clerk.user) {
            console.log("User is signed in:", Clerk.user.id);
            if (statusDiv) statusDiv.style.display = 'none'; // Hide loading message

            if (userProfileContainer) {
                // Mount the UserProfile component
                // This component allows users to manage their profile details,
                // security (password, MFA), connected accounts, etc.
                Clerk.mountUserProfile(userProfileContainer, {
                    // Appearance settings to match your dark theme (copy from login/signup.js)
                    appearance: {
                        baseTheme: 'dark',
                        variables: {
                            colorPrimary: '#4361ee', // Example primary color
                            colorBackground: 'hsl(232, 31%, 10%)', // Match theme background if needed
                            colorInputBackground: 'rgba(255, 255, 255, 0.1)',
                            colorInputText: 'white',
                        },
                        // layout: { /* Add any specific layout options here */ }
                    },
                });
                console.log("Clerk UserProfile component mounted.");
            } else {
                console.error("Target container '#clerk-user-profile-target' not found.");
                if (statusDiv) {
                    statusDiv.textContent = 'Error: Profile UI container not found.';
                    statusDiv.style.display = 'block';
                }
            }
        } else {
            // User is not signed in, handle appropriately
            console.log("User is not signed in.");
            if (statusDiv) {
                 // Option 1: Show message
                 statusDiv.textContent = 'Please sign in to view your profile.';
                 statusDiv.style.display = 'block';
                 // Option 2: Redirect to login
                 // window.location.href = '/login.html'; // Or your login page path
            }
             // Optionally hide the target container if showing a message
             if (userProfileContainer) userProfileContainer.style.display = 'none';
        }

    } catch (err) {
        console.error('Clerk Error:', err);
        if (statusDiv) {
             statusDiv.textContent = 'Failed to initialize profile.';
             statusDiv.style.display = 'block';
        }
         // Optionally hide the target container on error
         if (userProfileContainer) userProfileContainer.style.display = 'none';
    }
};

// --- Dynamically Load ClerkJS Library ---
// (Same IIFE as in signup.js and login.js)
(function () {
    const script = document.createElement('script');
    script.setAttribute('data-clerk-publishable-key', clerkPubKey);
    script.async = true;
    script.src = `https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js`;
    script.crossOrigin = 'anonymous';
    script.addEventListener('load', startClerk); // Run startClerk after loading
    script.addEventListener('error', () => {
        console.error("Failed to load ClerkJS script.");
        if (statusDiv) {
             statusDiv.textContent = 'Failed to load authentication library.';
             statusDiv.style.display = 'block';
        }
         // Optionally hide the target container on error
         if (userProfileContainer) userProfileContainer.style.display = 'none';
    });
    document.body.appendChild(script);
})();

