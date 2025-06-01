document.addEventListener('DOMContentLoaded', () => {
    const glasses = document.getElementById('glasses');
    const scene = document.querySelector('.scene');
    const oldman = document.getElementById('oldman');

    // last position so that it doesn't appear in same location in a row
    let lastPosition = { x: 0, y: 0 };

    function moveGlassesToRandomPosition() {
        const sceneRect = scene.getBoundingClientRect();
        const glassesRect = glasses.getBoundingClientRect();
        const oldmanRect = oldman.getBoundingClientRect();

        // define padding from edges
        const padding = 20;

        // calculate random position
        let newX, newY;
        let isValidPosition = false;
        let attempts = 0;
        const maxAttempts = 100;

        while (!isValidPosition && attempts < maxAttempts) {
            // generate random position within scene bounds
            newX = padding + Math.random() * (sceneRect.width - glassesRect.width - 2 * padding);
            newY = padding + Math.random() * (sceneRect.height - glassesRect.height - 2 * padding);

            // check if position overlaps with old man
            const safetyMargin = 40;
            const glassesLeft = newX;
            const glassesRight = newX + glassesRect.width;
            const glassesTop = newY;
            const glassesBottom = newY + glassesRect.height;

            const oldmanLeft = oldmanRect.left - sceneRect.left - safetyMargin;
            const oldmanRight = oldmanRect.right - sceneRect.left + safetyMargin;
            const oldmanTop = oldmanRect.top - sceneRect.top - safetyMargin;
            const oldmanBottom = oldmanRect.bottom - sceneRect.top + safetyMargin;

            // check if new position is far enough from the last position
            const minDistance = 40; 
            const distanceFromLast = Math.sqrt(
                Math.pow(newX - lastPosition.x, 2) + 
                Math.pow(newY - lastPosition.y, 2)
            );

            isValidPosition = !(
                glassesRight > oldmanLeft &&
                glassesLeft < oldmanRight &&
                glassesBottom > oldmanTop &&
                glassesTop < oldmanBottom
            ) && (distanceFromLast > minDistance || attempts > maxAttempts / 2);

            attempts++;
        }

        // if we couldn't find a valid position
        if (!isValidPosition) {
            const corners = [
                { x: padding, y: padding },
                { x: sceneRect.width - glassesRect.width - padding, y: padding },
                { x: padding, y: sceneRect.height - glassesRect.height - padding },
                { x: sceneRect.width - glassesRect.width - padding, y: sceneRect.height - glassesRect.height - padding }
            ];
            
            // filter out the corner that's too close to the last position
            const validCorners = corners.filter(corner => {
                const distance = Math.sqrt(
                    Math.pow(corner.x - lastPosition.x, 2) + 
                    Math.pow(corner.y - lastPosition.y, 2)
                );
                return distance > 100;
            });

            const corner = validCorners.length > 0 
                ? validCorners[Math.floor(Math.random() * validCorners.length)]
                : corners[Math.floor(Math.random() * corners.length)];
            
            newX = corner.x;
            newY = corner.y;
        }

        // new position
        lastPosition = { x: newX, y: newY };

        // animation
        glasses.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        glasses.style.left = `${newX}px`;
        glasses.style.top = `${newY}px`;
    }

    // initial position with a slight delay to ensure everything is loaded
    setTimeout(moveGlassesToRandomPosition, 100);

   
    glasses.addEventListener('click', () => {
        moveGlassesToRandomPosition();
        
        // bounce effect
        glasses.style.transform = 'scale(0.9) rotate(-5deg)';
        setTimeout(() => {
            glasses.style.transform = 'scale(1.1) rotate(5deg)';
        }, 150);
        setTimeout(() => {
            glasses.style.transform = 'scale(1) rotate(0)';
        }, 300);
    });
}); 