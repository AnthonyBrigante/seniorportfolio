async function fetchGallery() {
    try {
        const response = await fetch('./gallery.json');
        const data = await response.json();
        const container = document.getElementById('galleryContainer');

        data.allProjects.forEach(project => {
            // Create the link wrapper
            const card = document.createElement('a');
            card.href = project.url;
            card.target = "_blank"; // Opens in new tab
            card.className = 'project-card';

            card.innerHTML = `
                <div class="card-image" style="background-image: url('${project.image}')"></div>
                <div class="card-content">
                    <h3>${project.title}</h3>
                    <p>${project.blurb}</p>
                </div>
            `;

            container.appendChild(card);
        });
    } catch (error) {
        console.error("Could not load gallery data:", error);
    }
}

fetchGallery();