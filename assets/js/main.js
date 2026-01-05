document.addEventListener('DOMContentLoaded', () => {
    // Typing Animation for Hero Title
    const typingElement = document.getElementById('typing-text');
    const textLines = [
        'Hi there',
        "I'm Yu-ki =:)"
    ];
    
    let lineIndex = 0;
    let charIndex = 0;
    let currentText = '';
    
    function typeText() {
        if (lineIndex < textLines.length) {
            if (charIndex < textLines[lineIndex].length) {
                currentText += textLines[lineIndex][charIndex];
                typingElement.innerHTML = currentText.replace(/\n/g, '<br>');
                charIndex++;
                setTimeout(typeText, 80); // Typing speed (80ms per character)
            } else {
                // Move to next line
                lineIndex++;
                charIndex = 0;
                if (lineIndex < textLines.length) {
                    currentText += '\n';
                    setTimeout(typeText, 300); // Pause between lines
                }
            }
        }
    }
    
    // Start typing after a short delay
    setTimeout(typeText, 500);

    // Biitsz Character Interaction
    const biitsz = document.querySelector('.biitsz-img');
    const bubble = document.querySelector('.speech-bubble');
    
    const messages = [
        'ようこそ！',
        'ゆっくりしていってね',
        'びっつだよ =:)',
    ];
    
    let currentMessageIndex = 0;
    
    function showMessage(message) {
        if (bubble) {
            bubble.textContent = message;
            bubble.classList.add('show');
            setTimeout(() => {
                bubble.classList.remove('show');
            }, 3000); // Show for 3 seconds
        }
    }
    
    // Auto-show messages on interval
    function autoShowMessages() {
        showMessage(messages[currentMessageIndex]);
        currentMessageIndex = (currentMessageIndex + 1) % messages.length;
    }
    
    // Show first message after 1 second
    setTimeout(autoShowMessages, 1000);
    
    // Then show new message every 8 seconds
    setInterval(autoShowMessages, 8000);
    
    // Also allow clicking for immediate message change
    if (biitsz) {
        biitsz.addEventListener('click', () => {
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            showMessage(randomMessage);
        });
    }

    // Section Title Typing Animation on Scroll
    const sectionTitles = document.querySelectorAll('.section-title[data-typing]');
    const typedTitles = new Set(); // Track which titles have been typed
    
    function typeSectionTitle(element) {
        const text = element.getAttribute('data-typing');
        if (!text || typedTitles.has(element)) return; // Skip if already typed
        
        typedTitles.add(element);
        let charIndex = 0;
        
        function typeChar() {
            if (charIndex < text.length) {
                element.textContent += text[charIndex];
                charIndex++;
                setTimeout(typeChar, 80); // 80ms per character
            } else {
                // Animation Complete
                if (element.id === 'events-title') {
                    const mapContainer = document.querySelector('.map-container');
                    const explanation = document.getElementById('events-explanation');
                    
                    setTimeout(() => {
                        if (explanation) explanation.classList.add('visible');
                        if (mapContainer) mapContainer.classList.add('visible');
                    }, 400); // Wait 0.4s after typing
                }
            }
        }
        
        typeChar();
    }
    
    // Intersection Observer to trigger typing when section comes into view
    const observerOptions = {
        threshold: 0.3, // Trigger when 30% of the element is visible
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeSectionTitle(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all section titles
    sectionTitles.forEach(title => {
        observer.observe(title);
    });

    // Fade In Up Observer (Scroll Animations)
    const fadeElements = document.querySelectorAll('.fade-in-up:not(.map-container):not(.manual-trigger), .stagger-grid');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(el => fadeObserver.observe(el));

    // Smooth Scrolling for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active Navigation Highlighting (Optional simple version)
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Theme Toggle with Okinawa Sunrise/Sunset Auto-switching
    const toggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Okinawa coordinates (Naha)
    const OKINAWA_LAT = 26.2124;
    const OKINAWA_LNG = 127.6809;
    
    // Function to determine if it's daytime in Okinawa
    function isDaytimeInOkinawa() {
        if (typeof SunCalc === 'undefined') {
            // Fallback if SunCalc is not loaded
            return true;
        }
        
        const now = new Date();
        const times = SunCalc.getTimes(now, OKINAWA_LAT, OKINAWA_LNG);
        
        // Check if current time is between sunrise and sunset
        return now >= times.sunrise && now < times.sunset;
    }
    
    // Function to apply theme
    function applyTheme(theme) {
        if (theme === 'light') {
            body.classList.add('light-mode');
            toggleBtn.textContent = '☾'; // Moon for light mode
        } else {
            body.classList.remove('light-mode');
            toggleBtn.textContent = '☀'; // Sun for dark mode
        }
    }
    
    // Check for manual override first, otherwise use auto-detection
    const manualTheme = localStorage.getItem('theme');
    const manualOverride = localStorage.getItem('themeManualOverride');
    
    if (manualOverride === 'true' && manualTheme) {
        // User has manually set a preference
        applyTheme(manualTheme);
    } else {
        // Auto-detect based on Okinawa sunrise/sunset
        const autoTheme = isDaytimeInOkinawa() ? 'light' : 'dark';
        applyTheme(autoTheme);
        localStorage.setItem('theme', autoTheme);
    }

    // Manual toggle button
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            
            // Save preference and mark as manual override
            let theme = 'dark';
            if (body.classList.contains('light-mode')) {
                theme = 'light';
                toggleBtn.textContent = '☾';
            } else {
                toggleBtn.textContent = '☀';
            }
            localStorage.setItem('theme', theme);
            localStorage.setItem('themeManualOverride', 'true');
        });
    }
    
    // Optional: Reset to auto-detection daily at midnight
    // Check every hour if we should reset the manual override
    setInterval(() => {
        const now = new Date();
        // Reset manual override at midnight (00:00-01:00)
        if (now.getHours() === 0 && manualOverride === 'true') {
            localStorage.removeItem('themeManualOverride');
            const autoTheme = isDaytimeInOkinawa() ? 'light' : 'dark';
            applyTheme(autoTheme);
            localStorage.setItem('theme', autoTheme);
        }
    }, 3600000); // Check every hour

    // Hamburger Menu Logic
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinksList = document.querySelectorAll('.nav-menu a');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when link is clicked
        navLinksList.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
});
