async function init() {
    try {
        const response = await fetch('./portfolio.json');
        if (!response.ok) throw new Error("Could not find portfolio.json");
        const data = await response.json();
        
        const main = document.getElementById('main-content');
        const nav = document.getElementById('navDots');

        data.chapters.forEach((ch, index) => {
            const dot = document.createElement('div');
            dot.className = `nav-dot ${index === 0 ? 'active' : ''}`;
            dot.dataset.target = ch.id;
            dot.onclick = () => document.getElementById(ch.id).scrollIntoView({ behavior: 'smooth' });
            nav.appendChild(dot);

            const section = document.createElement('section');
            section.id = ch.id;
            
            let skillsHtml = ch.skills ? `
                <div class="skills-wrapper">
                    ${ch.skills.map(s => `
                        <div class="skill-item">
                            <span>${s.name}</span>
                            <div class="bar-bg"><div class="bar-fill" data-width="${s.level}"></div></div>
                        </div>`).join('')}
                </div>` : '';

            let reflectionHtml = ch.reflection ? `
                <div class="reflection-box">
                    <h4>Reflection:</h4>
                    <p>${ch.reflection}</p>
                </div>` : '';

            // Updated Button Logic: If it's the "Begin Journey" button, we give it a specific ID
            let buttonHtml = ch.buttonText ? `
                <a href="${ch.buttonLink || '#'}" class="journey-btn" ${ch.id === 'prologue' ? 'id="start-trigger"' : ''}>
                    ${ch.buttonText}
                </a>` : '';

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

        startObserving();
        setupButtonClick(); // New function call
        
    } catch (error) {
        console.error("Error building the journey:", error);
    }
}

// Function to handle the smooth scroll for the "Begin Journey" button
function setupButtonClick() {
    document.getElementById('main-content').addEventListener('click', (e) => {
        // Look for the "Begin Journey" button specifically
        if (e.target && e.target.id === 'start-trigger') {
            e.preventDefault();
            const year1 = document.getElementById('year1');
            if (year1) {
                year1.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

function startObserving() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                const id = entry.target.id;
                
                // Enhanced Color Logic
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

                document.querySelectorAll('.nav-dot').forEach(d => {
                    d.classList.toggle('active', d.dataset.target === id);
                });

                entry.target.querySelectorAll('.bar-fill').forEach(bar => {
                    bar.style.width = bar.dataset.width;
                });
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.25 });

    document.querySelectorAll('section').forEach(s => observer.observe(s));
}

init();