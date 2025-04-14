// bubbling-pattern.js - Updated for Size & Density
(function() {
    document.addEventListener('DOMContentLoaded', () => {
        
        let bubbleContainer = document.getElementById('bubble-container');
        if (!bubbleContainer) {
            bubbleContainer = document.createElement('div');
            bubbleContainer.id = 'bubble-container';
            document.body.insertBefore(bubbleContainer, document.body.firstChild); 
        }

        function createBubble() {
            if (!bubbleContainer) return; 
            const bubble = document.createElement('div');
            bubble.className = 'bubble';

            // --- INCREASED Bubble Size ---
            // Size between 25px and 75px (Adjust range as preferred)
            const size = Math.random() * 50 + 25; 
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            
            bubble.style.left = Math.random() * 110 - 5 + 'vw'; 
            // Slightly slower animation for larger bubbles? (Adjust range as needed)
            bubble.style.animationDuration = Math.random() * 10 + 8 + 's'; // 8s to 18s
            bubble.style.backgroundColor = getRandomColor();
            bubble.style.setProperty('--driftX', Math.random() * 2 - 1); 
            bubbleContainer.appendChild(bubble);

            const animationDurationMs = parseFloat(bubble.style.animationDuration) * 1000;
            setTimeout(() => {
                if (bubble && bubble.parentNode === bubbleContainer) {
                    bubble.remove(); 
                }
            }, animationDurationMs + 1000); 
        }

        function getRandomColor() {
            const colors = [ // Keep or modify color list
                'rgba(67, 97, 238, 0.7)', 'rgba(76, 201, 240, 0.7)', 'rgba(255, 105, 180, 0.7)',
                'rgba(255, 165, 0, 0.7)', 'rgba(50, 205, 50, 0.7)', 'rgba(138, 43, 226, 0.7)',
                'rgba(0, 255, 255, 0.7)' 
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        // --- INCREASED Bubble Density ---
        // Create bubbles more often (e.g., every 250ms - Adjust lower for more)
        const bubbleInterval = setInterval(createBubble, 250); 

    }); 
})(); 
