async function fetchGallery() {
    try {
        const response = await fetch('./gallery.json');
        const data = await response.json();
        const container = document.getElementById('galleryContainer');
        
        container.innerHTML = ''; 

        function buildYearSection(sectionTitle, projectList, sectionId) {
            if (!projectList || projectList.length === 0) return;

            const sectionWrapper = document.createElement('div');
            sectionWrapper.className = 'year-section';
            sectionWrapper.id = sectionId;

            const sectionHeading = document.createElement('h2');
            sectionHeading.className = 'year-title';
            sectionHeading.textContent = sectionTitle;
            sectionWrapper.appendChild(sectionHeading);

            const grid = document.createElement('div');
            grid.className = 'gallery-grid';

            projectList.forEach(project => {
                const card = document.createElement('a');
                card.href = project.url;
                card.target = "_blank"; 
                card.className = 'project-card';

                card.innerHTML = `
                    <div class="card-image" style="background-image: url('${project.image}')"></div>
                    <div class="card-content">
                        <span class="card-date">${project.date}</span>
                        <h3>${project.title}</h3>
                        <p>${project.blurb}</p>
                    </div>
                `;
                grid.appendChild(card);
            });

            sectionWrapper.appendChild(grid);
            container.appendChild(sectionWrapper);
        }

        // Build Junior Year completely first in rows of four
        buildYearSection("Junior Year Archive", data.juniorYear, "junior-section");
        
        // Build Senior Year completely second right underneath in rows of four
        buildYearSection("Senior Year Masterworks", data.seniorYear, "senior-section");

        setupNavigationButtons();
        
        // Fire up the freshly repaired scroll engine!
        initGalleryAutoScroll();

    } catch (error) {
        console.error("Could not load gallery data:", error);
    }
}

function setupNavigationButtons() {
    const header = document.querySelector('.gallery-header');
    if (!header || document.getElementById('skipToSeniorBtn')) return;

    const skipBtn = document.createElement('button');
    skipBtn.id = 'skipToSeniorBtn';
    skipBtn.className = 'skip-nav-btn';
    skipBtn.innerHTML = 'Skip to Senior Year ⚡';

    skipBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const seniorSection = document.getElementById('senior-section');
        if (seniorSection) {
            seniorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    header.appendChild(skipBtn);
}

// --- FIXED AUTO-SCROLL ENGINE ---
function initGalleryAutoScroll() {
    let scrollSpeed = 3;   // ⚡ Moves 3 pixels per tick for a solid, steady drift
    let direction = 1;     // 1 = down, -1 = up
    let scrollInterval;
    let isUserInteracting = false;
    let resumeTimeout;

    function scrollLoop() {
        // Stop moving if the user is actively holding/spinning their scroll wheel or touching the screen
        if (isUserInteracting) return;

        const currentScroll = Math.ceil(window.scrollY);
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

        // Condition: Hit bottom boundary
        if (direction === 1 && currentScroll >= maxScroll - 5) {
            clearInterval(scrollInterval);
            setTimeout(() => {
                direction = -1;
                scrollInterval = setInterval(scrollLoop, 30);
            }, 1500); 
            return;
        }

        // Condition: Hit top boundary
        if (direction === -1 && currentScroll <= 2) {
            clearInterval(scrollInterval);
            setTimeout(() => {
                direction = 1;
                scrollInterval = setInterval(scrollLoop, 30);
            }, 1500); 
            return;
        }

        window.scrollBy(0, scrollSpeed * direction);
    }

    // Initialize loop
    scrollInterval = setInterval(scrollLoop, 30);

    // PAUSE & RESUME LOGIC (Fixed: Removed the conflicting 'scroll' listener)
    const handleUserInteraction = () => {
        isUserInteracting = true; 
        clearTimeout(resumeTimeout);
        
        // Resumes auto scroll quickly after 1.5 seconds of physical inactivity
        resumeTimeout = setTimeout(() => { 
            isUserInteracting = false; 
        }, 1500);
    };

    // Track actual human physical hardware input rather than global page scrolling values
    window.addEventListener('wheel', handleUserInteraction, { passive: true });
    window.addEventListener('touchmove', handleUserInteraction, { passive: true });
    window.addEventListener('keydown', (e) => {
        // Pause if using arrow keys or spacebar to navigate
        if(['ArrowUp', 'ArrowDown', 'Space', ' '].includes(e.key)) {
            handleUserInteraction();
        }
    });

    // Pause auto-scrolling only when the cursor is directly hovering over the gallery space
    const container = document.getElementById('galleryContainer');
    if (container) {
        container.addEventListener('mouseenter', () => { isUserInteracting = true; });
        container.addEventListener('mouseleave', () => { isUserInteracting = false; });
    }
}

fetchGallery();