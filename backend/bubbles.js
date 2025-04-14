// bubbles.js

document.addEventListener('DOMContentLoaded', () => {
    const bubbleContainer = document.getElementById('bubble-container');

    // Ensure the container element exists
    if (!bubbleContainer) {
        console.error("Error: Element with ID 'bubble-container' not found.");
        return;
    }

    // --- Configuration ---
    const bubbleCount = 30; // Approx number of bubbles on screen at once
    const minBubbleSize = 10; // Minimum bubble size in pixels
    const maxBubbleSize = 60; // Maximum bubble size in pixels
    const minDuration = 10;    // Minimum animation duration in seconds
    const maxDuration = 25;    // Maximum animation duration in seconds
    const bubbleInterval = 300; // Milliseconds between creating new bubbles

    // Example pastel colors - add or modify as needed
    const colors = [
        'rgba(255, 192, 203, 0.7)', // Pink
        'rgba(173, 216, 230, 0.7)', // Light Blue
        'rgba(144, 238, 144, 0.7)', // Light Green
        'rgba(255, 255, 224, 0.7)', // Light Yellow
        'rgba(221, 160, 221, 0.7)', // Plum
        'rgba(240, 230, 140, 0.7)', // Khaki
        'rgba(175, 238, 238, 0.7)', // Pale Turquoise
    ];

    // --- Bubble Creation Function ---
    function createBubble() {
        const bubble = document.createElement('div');
        bubble.className = 'bubble'; // Use class for styling

        // 1. Random Size
        const size = Math.random() * (maxBubbleSize - minBubbleSize) + minBubbleSize;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;

        // 2. Random Starting Horizontal Position
        bubble.style.left = `${Math.random() * 100}%`;

        // 3. Random Color
        bubble.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        // 4. Random Animation Duration (Controls speed - longer is slower)
        const duration = Math.random() * (maxDuration - minDuration) + minDuration;
        bubble.style.animationDuration = `${duration}s`;

        // 5. Random Horizontal Drift (using a CSS variable)
        // Value between -1 and 1 determines drift direction and magnitude slightly
        const drift = (Math.random() - 0.5) * 2; // -1 to +1
        bubble.style.setProperty('--driftX', drift);

        // 6. Random Animation Delay (Staggers bubble starts)
        bubble.style.animationDelay = `${Math.random() * 5}s`; // Start up to 5s later

        // Append to container
        bubbleContainer.appendChild(bubble);

        // 7. Remove bubble after animation completes to prevent DOM clutter
        // Use animation duration + delay for removal time
        setTimeout(() => {
            bubble.remove();
        }, (duration + 5) * 1000 + 100); // Add buffer for delay + safety margin
    }

    // --- Initialization ---

    // Create an initial burst of bubbles
    for (let i = 0; i < bubbleCount; i++) {
        createBubble();
    }

    // Continuously create new bubbles at intervals
    setInterval(createBubble, bubbleInterval);

    console.log("Bubble animation started.");
});
