document.addEventListener('DOMContentLoaded', () => {
    const glasses = document.getElementById('glasses');
    const scene = document.querySelector('.scene');
    const oldman = document.getElementById('oldman');

    // keep track of where glasses were last time
    let lastPosition = { x: 0, y: 0 };

    function moveGlassesToRandomPosition() {
        const sceneRect = scene.getBoundingClientRect();
        const glassesRect = glasses.getBoundingClientRect();
        const oldmanRect = oldman.getBoundingClientRect();

        // leave some space around the edges
        const padding = 20;

        // time to find a new spot!
        let newX, newY;
        let isValidPosition = false;
        let attempts = 0;
        const maxAttempts = 100;

        while (!isValidPosition && attempts < maxAttempts) {
            // pick a random spot on the screen
            newX = padding + Math.random() * (sceneRect.width - glassesRect.width - 2 * padding);
            newY = padding + Math.random() * (sceneRect.height - glassesRect.height - 2 * padding);

            // make sure we don't put glasses on the old man's face!
            const safetyMargin = 40;
            const glassesLeft = newX;
            const glassesRight = newX + glassesRect.width;
            const glassesTop = newY;
            const glassesBottom = newY + glassesRect.height;

            const oldmanLeft = oldmanRect.left - sceneRect.left - safetyMargin;
            const oldmanRight = oldmanRect.right - sceneRect.left + safetyMargin;
            const oldmanTop = oldmanRect.top - sceneRect.top - safetyMargin;
            const oldmanBottom = oldmanRect.bottom - sceneRect.top + safetyMargin;

            // don't want them too close to where they were before
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

        // if we're stuck, just put them in a corner
        if (!isValidPosition) {
            const corners = [
                { x: padding, y: padding },
                { x: sceneRect.width - glassesRect.width - padding, y: padding },
                { x: padding, y: sceneRect.height - glassesRect.height - padding },
                { x: sceneRect.width - glassesRect.width - padding, y: sceneRect.height - glassesRect.height - padding }
            ];
            
            // try to find a corner far from last spot
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

        // remember where we put them
        lastPosition = { x: newX, y: newY };

        // make it look smooth
        glasses.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        glasses.style.left = `${newX}px`;
        glasses.style.top = `${newY}px`;
    }

    // give everything a sec to load up
    setTimeout(moveGlassesToRandomPosition, 100);

    // when someone clicks the glasses...
    glasses.addEventListener('click', () => {
        moveGlassesToRandomPosition();
        
        // do a little wiggle dance
        glasses.style.transform = 'scale(0.9) rotate(-5deg)';
        setTimeout(() => {
            glasses.style.transform = 'scale(1.1) rotate(5deg)';
        }, 150);
        setTimeout(() => {
            glasses.style.transform = 'scale(1) rotate(0)';
        }, 300);
    });
}); 