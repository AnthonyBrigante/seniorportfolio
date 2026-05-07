async function init() {
    try {
        // 1. Fetch the data from your JSON file
        const response = await fetch('./portfolio.json');
        if (!response.ok) throw new Error("Could not find portfolio.json");
        const data = await response.json();
        
        const main = document.getElementById('main-content');
        const nav = document.getElementById('navDots');

        // 2. Build the chapters dynamically
        data.chapters.forEach((ch, index) => {
            // Create the side navigation dots
            const dot = document.createElement('div');
            dot.className = `nav-dot ${index === 0 ? 'active' : ''}`;
            dot.dataset.target = ch.id;
            dot.onclick = () => document.getElementById(ch.id).scrollIntoView({ behavior: 'smooth' });
            nav.appendChild(dot);

            // Create the section
            const section = document.createElement('section');
            section.id = ch.id;
            
            // Build the skills HTML if they exist
            let skillsHtml = ch.skills ? `
                <div class="skills-wrapper">
                    ${ch.skills.map(s => `
                        <div class="skill-item">
                            <span>${s.name}</span>
                            <div class="bar-bg"><div class="bar-fill" data-width="${s.level}"></div></div>
                        </div>`).join('')}
                </div>` : '';

            // Build the reflection box if it exists
            let reflectionHtml = ch.reflection ? `
                <div class="reflection-box">
                    <h4>Reflection:</h4>
                    <p>${ch.reflection}</p>
                </div>` : '';

            // Build the button if it exists
            let buttonHtml = ch.buttonText ? `
                <a href="${ch.buttonLink || '#'}" class="journey-btn">${ch.buttonText}</a>` : '';

            // Inject the content into the section
            section.innerHTML = `
                <div class="content-container">
                    <small>CHAPTER ${index}</small>
                    <h1>${ch.title}</h1>
                    <p class="main-desc">${ch.description}</p>
                    ${reflectionHtml}
                    ${skillsHtml}
                    ${buttonHtml}
                </div>
            `;
            main.appendChild(section);
        });

        // 3. Start watching the scroll
        startObserving();
        
    } catch (error) {
        console.error("Error building the journey:", error);
        document.body.innerHTML = `<div style="color:white; padding:50px;">Error loading portfolio.json. Make sure you are using a local server (Live Server).</div>`;
    }
}

function startObserving() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                const id = entry.target.id;
                
                // --- COLOR LOGIC ---
                // This changes the mood based on the chapter ID
                if(id === 'prologue') { 
                    document.body.style.backgroundColor = "#0a0a0c"; 
                    document.body.style.color = "#ffffff"; 
                }
                else if(id === 'year1') { 
                    document.body.style.backgroundColor = "#ffffff"; 
                    document.body.style.color = "#1a1a1a"; 
                }
                else if(id === 'year2') { 
                    document.body.style.backgroundColor = "#102a43"; 
                    document.body.style.color = "#ffffff"; 
                }
                else if(id === 'year3' || id === 'future') { 
                    document.body.style.backgroundColor = "#0a0a0c"; 
                    document.body.style.color = "#ffffff"; 
                }

                // Update Nav Dots
                document.querySelectorAll('.nav-dot').forEach(d => {
                    d.classList.toggle('active', d.dataset.target === id);
                });

                // Animate Skill Bars
                entry.target.querySelectorAll('.bar-fill').forEach(bar => {
                    bar.style.width = bar.dataset.width;
                });
            } else {
                // Keep it clean: hide sections as you scroll away
                entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.25 });

    document.querySelectorAll('section').forEach(s => observer.observe(s));
}

// 🔥 CRITICAL: Actually run the code!
init();