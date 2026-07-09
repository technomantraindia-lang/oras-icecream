document.addEventListener('DOMContentLoaded', () => {
    // Premium ORAS Preloader Logic
    const preloader = document.getElementById('oras-preloader');
    if (preloader) {
        document.body.classList.add('loader-active');
        
        // Wait for preloader animation timeline to complete (approx 3.2s)
        window.setTimeout(() => {
            preloader.classList.add('fade-out');
            
            // Re-enable scroll and remove DOM node after fade out completes
            window.setTimeout(() => {
                document.body.classList.remove('loader-active');
                preloader.remove();
            }, 800);
        }, 3200);
    }

    const rupee = '\u20B9';
    const mainHeader = document.querySelector('.main-header');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const searchToggle = document.querySelector('.search-toggle');
    const searchBox = document.querySelector('.search-box');
    const searchInput = document.querySelector('.search-input');
    const revealElements = document.querySelectorAll('.scroll-reveal');



    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const icon = mobileMenuToggle.querySelector('i');
            icon.className = navMenu.classList.contains('open') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
        });
    }

    document.querySelectorAll('.nav-menu a').forEach((link) => {
        link.addEventListener('click', () => {
            document.querySelectorAll('.nav-menu a').forEach((item) => item.classList.remove('active'));
            link.classList.add('active');

            if (navMenu) {
                navMenu.classList.remove('open');
            }

            if (mobileMenuToggle) {
                mobileMenuToggle.querySelector('i').className = 'fa-solid fa-bars';
            }
        });
    });

    if (searchToggle && searchBox && searchInput) {
        searchToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            searchBox.classList.toggle('open');

            if (searchBox.classList.contains('open')) {
                searchInput.focus();
            }
        });

        searchInput.addEventListener('click', (event) => event.stopPropagation());
        document.addEventListener('click', () => searchBox.classList.remove('open'));
    }

    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.18,
            rootMargin: '0px 0px -30px 0px'
        });

        revealElements.forEach((element) => revealObserver.observe(element));
    }

    const testimonialSets = Array.from(document.querySelectorAll('.testimonial-set'));
    let activeSetIndex = 0;

    const showTestimonialSet = (index) => {
        testimonialSets.forEach((set, setIndex) => {
            set.classList.toggle('active', setIndex === index);
        });
    };

    if (testimonialSets.length > 0) {
        window.setInterval(() => {
            activeSetIndex = (activeSetIndex + 1) % testimonialSets.length;
            showTestimonialSet(activeSetIndex);
        }, 6000);
    }

    const categoryCards = Array.from(document.querySelectorAll('.category-card'));
    const flavourCards = Array.from(document.querySelectorAll('.flavour-card'));
    const categoryToFlavorMap = {
        all: flavourCards.map((card) => card.dataset.id || ''),
        candy: ['paanmasala', 'kesarpista'],
        chocobar: ['chocochips', 'americannuts'],
        kulfi: ['kesarpista', 'paanmasala'],
        cup: ['vanilla', 'butterscotch'],
        cone: ['vanilla', 'butterscotch', 'chocochips', 'americannuts'],
        family: ['vanilla', 'butterscotch', 'chocochips', 'americannuts', 'kesarpista', 'paanmasala'],
        bulk: ['vanilla', 'butterscotch', 'chocochips', 'kesarpista']
    };

    const applyCategoryFilter = (category) => {
        const visibleIds = categoryToFlavorMap[category] || categoryToFlavorMap.all;

        categoryCards.forEach((card) => {
            card.classList.toggle('active', card.dataset.category === category);
        });

        flavourCards.forEach((card) => {
            const shouldShow = visibleIds.includes(card.dataset.id || '');
            card.style.display = shouldShow ? 'block' : 'none';
        });
    };

    categoryCards.forEach((card) => {
        card.addEventListener('click', () => {
            applyCategoryFilter(card.dataset.category || 'all');
            document.getElementById('flavours')?.scrollIntoView({ behavior: 'smooth' });
        });
    });

    document.querySelectorAll('.footer-col a[data-filter]').forEach((link) => {
        link.addEventListener('click', () => {
            const filterType = link.dataset.filter || 'all';
            window.setTimeout(() => applyCategoryFilter(filterType), 350);
        });
    });

    // Section Scroll Reveal Logic (Alternating Left/Right)
    const contentSections = Array.from(document.querySelectorAll('main > section')).filter(sec => sec.id !== 'home');
    
    contentSections.forEach((section, index) => {
        const shell = section.querySelector('.shell');
        if (shell) {
            shell.classList.add('reveal-content');
            // Alternate left and right entry
            if (index % 2 === 0) {
                shell.classList.add('reveal-left');
            } else {
                shell.classList.add('reveal-right');
            }
        }
    });

    if (contentSections.length > 0) {
        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const shell = entry.target.querySelector('.shell');
                    if (shell) {
                        shell.classList.add('revealed');
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08, // Trigger early when the section enters the screen
            rootMargin: '0px 0px -40px 0px'
        });

        contentSections.forEach((section) => {
            const shell = section.querySelector('.shell');
            if (shell) {
                sectionObserver.observe(section);
            }
        });
    }

    // ==========================================================================
    // ORAS FLOATING WHATSAPP FLOW WIDGET & DISTRIBUTOR FORM HANDLERS
    // ==========================================================================

    // WhatsApp Submission Helper
    function sendWhatsAppInquiry(details) {
        const phone = "919672334414"; // Official inquiry number
        const messageText = `👋 Hello ORAS Ice Cream Team,

I would like to apply to become an ORAS Ice Cream Distributor. Here are my details:

👤 *Name:* ${details.name}
📞 *Mobile Number:* ${details.mobile}
💬 *WhatsApp Number:* ${details.whatsapp}
📧 *Email:* ${details.email || 'Not provided'}
📍 *Location:* ${details.city}, ${details.district}, ${details.state}
💼 *Current Business:* ${details.business}
❄️ *Cold Storage Available?:* ${details.coldstorage}
🚚 *Delivery Vehicle Available?:* ${details.deliveryvehicle}
💰 *Investment Capacity:* ${details.investment}
📈 *Expected Monthly Business:* ${details.expectedbusiness}
📝 *Message:* ${details.message}

Thank you!`;

        const encodedMessage = encodeURIComponent(messageText);
        const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;
        window.open(url, '_blank');
    }

    // Main Contact Section WhatsApp Submit Button handler
    const mainForm = document.querySelector('#contact-section form');
    const mainWaSubmitBtn = document.getElementById('submit-whatsapp-btn');
    if (mainForm && mainWaSubmitBtn) {
        mainWaSubmitBtn.addEventListener('click', (e) => {
            // Check form validity
            if (!mainForm.checkValidity()) {
                mainForm.reportValidity();
                return;
            }

            const details = {
                name: document.getElementById('distributor-name').value,
                mobile: document.getElementById('distributor-mobile').value,
                whatsapp: document.getElementById('distributor-whatsapp').value,
                email: document.getElementById('distributor-email').value,
                state: document.getElementById('distributor-state').value,
                district: document.getElementById('distributor-district').value,
                city: document.getElementById('distributor-city').value,
                business: document.getElementById('distributor-business').value,
                coldstorage: document.getElementById('distributor-coldstorage').value,
                deliveryvehicle: document.getElementById('distributor-deliveryvehicle').value,
                investment: document.getElementById('distributor-investment').value,
                expectedbusiness: document.getElementById('distributor-expectedbusiness').value,
                message: document.getElementById('distributor-message').value
            };

            sendWhatsAppInquiry(details);
        });
    }

    // Floating WhatsApp Widget Panel Open/Close logic
    const waFlowBtn = document.getElementById('whatsapp-flow-btn');
    const waFlowPanel = document.getElementById('whatsapp-flow-panel');
    const waFlowClose = document.getElementById('whatsapp-flow-close');
    const waFlowForm = document.getElementById('whatsapp-flow-form');

    if (waFlowBtn && waFlowPanel && waFlowClose) {
        // Toggle panel open/close
        waFlowBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            waFlowPanel.classList.toggle('open');
        });

        // Close panel
        waFlowClose.addEventListener('click', (e) => {
            e.stopPropagation();
            waFlowPanel.classList.remove('open');
        });

        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!waFlowPanel.contains(e.target) && e.target !== waFlowBtn && !waFlowBtn.contains(e.target)) {
                waFlowPanel.classList.remove('open');
            }
        });

        // Form submit inside panel
        if (waFlowForm) {
            waFlowForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const details = {
                    name: document.getElementById('wa-name').value,
                    mobile: document.getElementById('wa-mobile').value,
                    whatsapp: document.getElementById('wa-whatsapp').value,
                    email: document.getElementById('wa-email').value,
                    state: document.getElementById('wa-state').value,
                    district: document.getElementById('wa-district').value,
                    city: document.getElementById('wa-city').value,
                    business: document.getElementById('wa-business').value,
                    coldstorage: document.getElementById('wa-coldstorage').value,
                    deliveryvehicle: document.getElementById('wa-deliveryvehicle').value,
                    investment: document.getElementById('wa-investment').value,
                    expectedbusiness: document.getElementById('wa-expectedbusiness').value,
                    message: document.getElementById('wa-message').value
                };

                sendWhatsAppInquiry(details);
                waFlowPanel.classList.remove('open');
                waFlowForm.reset();
            });
        }
    }

    // ==========================================================================
    // ORAS DYNAMIC CONTACT PAGE ANIMATIONS & INTERACTIVE HANDLERS
    // ==========================================================================

    // Confetti particles generator for submit success
    function triggerConfetti(container) {
        const colors = ['#73060b', '#b51218', '#ffc84a', '#dff7ef', '#fff2ea'];
        const particleCount = 45;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('success-particle');
            
            // Random color, shape, size
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.left = '50%';
            particle.style.top = '50%';
            
            // Random translation vector in coordinates
            const angle = Math.random() * Math.PI * 2;
            const distance = 80 + Math.random() * 160;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance - 40; 
            const r = Math.random() * 360 + 180;
            
            particle.style.setProperty('--x', `${x}px`);
            particle.style.setProperty('--y', `${y}px`);
            particle.style.setProperty('--r', `${r}deg`);
            
            const size = 6 + Math.random() * 8;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            
            container.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1800);
        }
    }

    // Dynamic Business Hours status check
    function updateBusinessHoursStatus() {
        const badge = document.getElementById('hours-status-badge');
        if (!badge) return;
        
        // India Standard Time (IST) is UTC + 5:30. Let's calculate the current IST time.
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const ist = new Date(utc + (3600000 * 5.5));
        
        const day = ist.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const hour = ist.getHours();
        
        // Mon-Sat, 9:00 AM - 6:00 PM
        const isOpen = (day >= 1 && day <= 6) && (hour >= 9 && hour < 18);
        
        if (isOpen) {
            badge.className = 'hours-status open';
            badge.innerHTML = '<span class="status-dot active-pulse"></span>Open Now';
        } else {
            badge.className = 'hours-status closed';
            badge.innerHTML = '<span class="status-dot"></span>Closed';
        }
    }
    
    updateBusinessHoursStatus();
    // Refresh status check every 30 seconds
    window.setInterval(updateBusinessHoursStatus, 30000);

    // 3D Card Tilt Effect on Hover
    const detailsCard = document.querySelector('.contact-details-card');
    if (detailsCard) {
        detailsCard.addEventListener('mousemove', (e) => {
            const cardRect = detailsCard.getBoundingClientRect();
            const cardWidth = cardRect.width;
            const cardHeight = cardRect.height;
            
            // Mouse coordinate relative to card center
            const mouseX = e.clientX - cardRect.left - cardWidth / 2;
            const mouseY = e.clientY - cardRect.top - cardHeight / 2;
            
            // Limit rotation to max 10 degrees
            const rotateX = -(mouseY / (cardHeight / 2)) * 10;
            const rotateY = (mouseX / (cardWidth / 2)) * 10;
            
            detailsCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            detailsCard.style.boxShadow = 'var(--shadow-strong)';
        });
        
        detailsCard.addEventListener('mouseleave', () => {
            detailsCard.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0)';
            detailsCard.style.boxShadow = 'var(--shadow-soft)';
        });
    }

    // Distributor Form Fill Progress Tracker & Success Animation
    const contactForm = document.getElementById('distributor-main-form');
    const successScreen = document.getElementById('contact-success-screen');
    const successCloseBtn = document.getElementById('success-close-btn');
    
    if (contactForm && successScreen) {
        const requiredInputs = Array.from(contactForm.querySelectorAll('[required]'));
        const progressBar = document.getElementById('form-progress');
        const progressPercentText = document.getElementById('progress-percent');
        
        const updateProgress = () => {
            if (requiredInputs.length === 0) return;
            
            let filledCount = 0;
            requiredInputs.forEach(input => {
                if (input.tagName === 'SELECT') {
                    if (input.value !== '') filledCount++;
                } else if (input.value.trim() !== '') {
                    filledCount++;
                }
            });
            
            const percentage = Math.round((filledCount / requiredInputs.length) * 100);
            if (progressBar) progressBar.style.width = `${percentage}%`;
            if (progressPercentText) progressPercentText.textContent = `${percentage}%`;
            
            if (progressPercentText) {
                if (percentage === 100) {
                    progressPercentText.style.color = '#0d9488';
                } else {
                    progressPercentText.style.color = 'var(--red-700)';
                }
            }
        };
        
        requiredInputs.forEach(input => {
            input.addEventListener('input', updateProgress);
            input.addEventListener('change', updateProgress);
        });
        
        updateProgress();
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formCard = document.querySelector('.contact-form-card');
            triggerConfetti(formCard);
            
            successScreen.classList.add('show');
        });
        
        if (successCloseBtn) {
            successCloseBtn.addEventListener('click', () => {
                successScreen.classList.remove('show');
                contactForm.reset();
                updateProgress();
            });
        }
    }
});

