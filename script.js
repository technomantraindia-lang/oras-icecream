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
        const showBackdrop = () => {
            let backdrop = document.getElementById('modal-backdrop');
            if (!backdrop) {
                backdrop = document.createElement('div');
                backdrop.id = 'modal-backdrop';
                backdrop.style.position = 'fixed';
                backdrop.style.inset = '0';
                backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
                backdrop.style.backdropFilter = 'blur(4px)';
                backdrop.style.opacity = '0';
                backdrop.style.transition = 'opacity 0.25s ease';
                backdrop.style.zIndex = '1499';
                document.body.appendChild(backdrop);
                
                backdrop.addEventListener('click', () => {
                    waFlowPanel.classList.remove('open');
                    hideBackdrop();
                });
            }
            backdrop.offsetHeight; // Force reflow
            backdrop.style.opacity = '1';
        };

        const hideBackdrop = () => {
            const backdrop = document.getElementById('modal-backdrop');
            if (backdrop) {
                backdrop.style.opacity = '0';
                setTimeout(() => {
                    backdrop.remove();
                }, 250);
            }
        };

        // Toggle panel open/close
        waFlowBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            waFlowPanel.classList.toggle('open');
            if (waFlowPanel.classList.contains('open')) {
                showBackdrop();
            } else {
                hideBackdrop();
            }
        });

        // Close panel
        waFlowClose.addEventListener('click', (e) => {
            e.stopPropagation();
            waFlowPanel.classList.remove('open');
            hideBackdrop();
        });

        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            const isPartnerBtn = e.target.classList.contains('btn-quote') || e.target.closest('.btn-quote');
            if (!waFlowPanel.contains(e.target) && e.target !== waFlowBtn && !waFlowBtn.contains(e.target) && !isPartnerBtn) {
                waFlowPanel.classList.remove('open');
                hideBackdrop();
            }
        });

        // Intercept "Become a Partner" buttons to show the popup form
        document.querySelectorAll('.btn-quote').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                waFlowPanel.classList.add('open');
                showBackdrop();
                document.getElementById('wa-name')?.focus();
            });
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

    // ==========================================================================
    // ORAS DYNAMIC PRODUCTS PAGE LOGIC
    // ==========================================================================
    const productsGrid = document.getElementById('products-grid');
    
    if (productsGrid) {
        // Products Database
        const productsList = [
            // Candy
            {
                id: "candy-mango-dolly",
                name: "Mango Dolly",
                category: "candy",
                size: "1 Unit",
                image: "images/product/magno dolly.png",
                description: "Fun, icy, and refreshing mango treat on a stick to sweeten your sunny days.",
                tag: "Classic"
            },
            // Chocobar
            {
                id: "chocobar-mini",
                name: "Mini Chocobar",
                category: "chocobar",
                size: "Mini",
                image: "images/chcoc bar .jpeg",
                description: "Bite-sized rich vanilla ice cream coated in a crisp chocolate shell.",
                tag: "Popular"
            },
            {
                id: "chocobar-large",
                name: "Large Chocobar",
                category: "chocobar",
                size: "Regular",
                image: "images/big chcoc bar.png",
                description: "Classic creamy vanilla ice cream dipped in a thick, crackling chocolate coating.",
                tag: "Classic"
            },
            {
                id: "chocobar-crave",
                name: "Choco Crave",
                category: "chocobar",
                size: "Premium",
                image: "images/product/chobar.png",
                description: "Double chocolate delight with rich chocolate ice cream and premium cocoa coating.",
                tag: "Premium"
            },
            // Kulfi
            {
                id: "kulfi-mawa-malai",
                name: "Mawa Malai Kulfi",
                category: "kulfi",
                size: "Stick",
                image: "images/punjabi mawa.png",
                description: "Traditional, slow-churned Indian dessert infused with rich mawa and cardamom.",
                tag: "Desi Classic"
            },
            {
                id: "kulfi-punjabi-mawa",
                name: "Punjabi Mawa",
                category: "kulfi",
                size: "Slice/Roll",
                image: "images/product/MAWA KULFI.png",
                description: "A rich Punjabi style malai kulfi.",
                tag: "Rich Taste"
            },
            {
                id: "kulfi-rabadi-matka",
                name: "Rabadi Matka",
                category: "kulfi",
                size: "Matka Cup",
                image: "images/rabdi2.png",
                description: "Traditional pot kulfi with thick rabadi and aromatic dry fruits.",
                tag: "Best Seller"
            },
            // Cone
            {
                id: "cone-choco-vanilla-50",
                name: "Choco Vanilla 50ml",
                category: "cone",
                size: "50ml",
                image: "images/oras cone .png",
                description: "Crispy waffle cone loaded with smooth vanilla ice cream and chocolate swirl.",
                tag: "Classic"
            },
            {
                id: "cone-butterscotch-80",
                name: "Butterscotch 80ml",
                category: "cone",
                size: "80ml",
                image: "images/butterscoth cone.png",
                description: "Sweet butterscotch ice cream with crunchies in a crispy waffle cone.",
                tag: "Popular"
            },
            {
                id: "cone-chocolate-80",
                name: "Chocolate 80ml",
                category: "cone",
                size: "80ml",
                image: "images/new chococlate.png",
                description: "Rich, deep chocolate ice cream loaded inside a crispy chocolate waffle cone.",
                tag: "Choco Classic"
            },
            {
                id: "cone-butterscotch-110",
                name: "Butterscotch 110ml",
                category: "cone",
                size: "110ml",
                image: "images/buuter scoch.png",
                description: "Extra large crispy waffle cone packed with butterscotch ice cream and nuts.",
                tag: "Large Pack"
            },
            {
                id: "cone-chocolate-110",
                name: "Chocolate 110ml",
                category: "cone",
                size: "110ml",
                image: "images/cohoc  big.png",
                description: "Extra large cone loaded with double chocolate premium ice cream and choco chips.",
                tag: "Large Pack"
            },
            // Cup
            {
                id: "cup-vanilla-65",
                name: "Vanilla 65ml",
                category: "cup",
                size: "65ml",
                image: "images/product/ORAS ICECREAM.png",
                description: "Classic creamy vanilla ice cream, perfect for a quick, mess-free dessert.",
                tag: "Single Serve"
            },
            {
                id: "cup-vanilla-100",
                name: "Vanilla 100ml",
                category: "cup",
                size: "100ml",
                image: "images/vanilla.png",
                description: "Rich, smooth, and classic vanilla made extra creamy for pure satisfaction.",
                tag: "Popular"
            },
            {
                id: "cup-strawberry-100",
                name: "Strawberry 100ml",
                category: "cup",
                size: "100ml",
                image: "images/new strbeery.png",
                description: "Delightful pink strawberry scoop filled with sweet, fruity flavour.",
                tag: "Fruity"
            },
            {
                id: "cup-mango-100",
                name: "Mango 100ml",
                category: "cup",
                size: "100ml",
                image: "images/mango new .png",
                description: "Refreshing mango ice cream made with real Alphonso mango pulp.",
                tag: "Seasonal Hit"
            },
            {
                id: "cup-american-nuts-100",
                name: "American Nuts 100ml",
                category: "cup",
                size: "100ml",
                image: "images/product/americanuts cup.jpeg",
                description: "Creamy vanilla base loaded with roasted nuts, almonds, and colourful jelly chunks.",
                tag: "Premium"
            },
            {
                id: "cup-choco-chips-100",
                name: "Chocolate Chips 100ml",
                category: "cup",
                size: "100ml",
                image: "images/product/chocolate cup.jpeg",
                description: "Rich cocoa ice cream loaded with crunchy dark chocolate chips.",
                tag: "Best Seller"
            },
            {
                id: "cup-butterscotch-100",
                name: "Butterscotch 100ml",
                category: "cup",
                size: "100ml",
                image: "images/product/butterscoh cup.jpeg",
                description: "Caramel-infused butterscotch scoop with buttery caramelized cashew crunchies.",
                tag: "Classic"
            },
            {
                id: "cup-rajbhog-110",
                name: "Rajbhog 110ml",
                category: "cup",
                size: "110ml",
                image: "images/product/5litre.jpeg",
                description: "Royal saffron-flavoured ice cream with a rich mix of nuts, almonds, and cardamoms.",
                tag: "Royal"
            },
            {
                id: "cup-kesar-pista-110",
                name: "Kesar Pista 110ml",
                category: "cup",
                size: "110ml",
                image: "images/new ras .png",
                description: "Traditional saffron and cardamom ice cream garnished with real green pistachios.",
                tag: "Royal"
            },
            // Family Pack
            {
                id: "family-vanilla",
                name: "Vanilla",
                category: "family",
                size: "Family Pack",
                image: "images/product/vn.png",
                description: "Classic creamy vanilla ice cream, perfect for sharing or pairing with gulab jamun.",
                tag: "Classic"
            },
            {
                id: "family-butterscotch",
                name: "Butterscotch",
                category: "family",
                size: "Family Pack",
                image: "images/product/btr.png",
                description: "Premium butterscotch ice cream with caramelized crunchies and caramel drizzle.",
                tag: "Best Seller"
            },
            {
                id: "family-paanmasala",
                name: "Paan Masala",
                category: "family",
                size: "Family Pack",
                image: "images/product/pan ice.png",
                description: "A refreshing sweet blend of betel leaf extract, gulkand, fennel, and spices.",
                tag: "Traditional"
            },
            {
                id: "family-chocochips",
                name: "Chocolate Chips",
                category: "family",
                size: "Family Pack",
                image: "images/product/choco.png",
                description: "Deep cocoa ice cream loaded with crunchy, premium dark chocolate chips.",
                tag: "Choco Premium"
            },
            {
                id: "family-americannuts",
                name: "American Nuts",
                category: "family",
                size: "Family Pack",
                image: "images/product/an.png",
                description: "Creamy ice cream loaded with roasted almonds, cashews, pistachios, and jelly bits.",
                tag: "Rich Medley"
            },
            {
                id: "family-kesarpista",
                name: "Kesar Pista",
                category: "family",
                size: "Family Pack",
                image: "images/product/kp.png",
                description: "Traditional saffron ice cream infused with rich roasted pistachios and cardamom.",
                tag: "Royal"
            },
            // 5 Litre Bulk Packs (20 flavors)
            {
                id: "bulk-vanilla",
                name: "Vanilla",
                category: "bulk",
                size: "5 Litre Tub",
                image: "images/vnilla.png",
                description: "A timeless vanilla flavour with a smooth, creamy and pleasantly sweet taste.",
                tag: "Bulk Value"
            },
            {
                id: "bulk-butterscotch",
                name: "Butterscotch",
                category: "bulk",
                size: "5 Litre Tub",
                image: "images/BUTTERSCOCH.png",
                description: "A classic butterscotch flavour offering a rich, creamy and caramel-like taste.",
                tag: "Bulk Best Seller"
            },
            {
                id: "bulk-oreo-cookies",
                name: "Oreo Cookies & Cream",
                category: "bulk",
                size: "5 Litre Tub",
                image: "images/COOKIES AND CREAM.png",
                description: "A popular cookies-and-cream flavour with a delicious chocolate biscuit-inspired taste.",
                tag: "Trendsetter"
            },
            {
                id: "bulk-gulkand",
                name: "Gulkand",
                category: "bulk",
                size: "5 Litre Tub",
                image: "images/glkand.png",
                description: "A traditional gulkand-inspired flavour with a sweet, aromatic and refreshing profile.",
                tag: "Unique"
            },
            {
                id: "bulk-pan-masala",
                name: "Pan Masala",
                category: "bulk",
                size: "5 Litre Tub",
                image: "images/pan masla.png",
                description: "A distinctive pan masala-inspired flavour with a traditional and pleasantly refreshing taste.",
                tag: "Traditional"
            },
            {
                id: "bulk-choco-chips",
                name: "Chocolate Chips",
                category: "bulk",
                size: "5 Litre Tub",
                image: "images/new choco.png",
                description: "A rich chocolate flavour with a delicious chocolate chip-inspired experience.",
                tag: "Choco Premium"
            },
            {
                id: "bulk-mango",
                name: "Mango",
                category: "bulk",
                size: "5 Litre Tub",
                image: "images/mango.png",
                description: "A refreshing mango-inspired flavour with a sweet, tropical and creamy taste.",
                tag: "Fruity"
            },
            {
                id: "bulk-mawa-malai",
                name: "Mawa Malai",
                category: "bulk",
                size: "5 Litre Tub",
                image: "images/MAWA MALI.png",
                description: "A traditional mawa malai flavour with a rich, creamy and indulgent taste.",
                tag: "Heritage"
            },
            {
                id: "bulk-tender-coconut",
                name: "Tender Coconut",
                category: "bulk",
                size: "5 Litre Tub",
                image: "images/tender coconut.png",
                description: "A refreshing tender coconut-inspired flavour with a light, creamy and tropical profile.",
                tag: "Fresh Flavor"
            },
            {
                id: "bulk-strawberry",
                name: "Strawberry",
                category: "bulk",
                size: "5 Litre Tub",
                image: "images/strawberry.png",
                description: "A classic strawberry-inspired flavour with a sweet, fruity and refreshing taste.",
                tag: "Classic"
            },
            {
                id: "bulk-sitafal",
                name: "Sitafal",
                category: "bulk",
                size: "5 Litre Tub",
                image: "images/product/sitafal.png",
                description: "A delightful sitafal-inspired flavour with a naturally sweet and creamy taste profile.",
                tag: "Exotic"
            },
            {
                id: "bulk-american-dry-fruits",
                name: "American Dry Fruits",
                category: "bulk",
                size: "5 Litre Tub",
                image: "images/american dryfrutis.png",
                description: "A rich and indulgent dry-fruit-inspired flavour with a premium festive taste.",
                tag: "Premium"
            },
            {
                id: "bulk-kesar-pista",
                name: "Kesar Pista",
                category: "bulk",
                size: "5 Litre Tub",
                image: "images/kesar pista .png",
                description: "A classic kesar pista flavour with a rich, aromatic and traditional taste.",
                tag: "Royal"
            },
            {
                id: "bulk-dry-fruits-overload",
                name: "Dry Fruits Overload",
                category: "bulk",
                size: "5 Litre Tub",
                image: "images/dry frutis .png",
                description: "An indulgent dry-fruit-inspired flavour created for a rich and premium dessert experience.",
                tag: "Rich & Premium"
            },
            {
                id: "bulk-guwava",
                name: "Guava",
                category: "bulk",
                size: "5 Litre Tub",
                image: "images/guava.png",
                description: "A refreshing guava-inspired flavour with a sweet, fruity and pleasantly tropical taste.",
                tag: "Fruity Exotic"
            },
            {
                id: "bulk-rajbhog",
                name: "Rajbhog",
                category: "bulk",
                size: "5 Litre Tub",
                image: "images/rajbhog.png",
                description: "A royal Indian dessert-inspired flavour with a rich, aromatic and festive taste profile.",
                tag: "Royal Heritage"
            },
            {
                id: "bulk-kesar-malai",
                name: "Kesar Malai",
                category: "bulk",
                size: "5 Litre Tub",
                image: "images/kesr mali.png",
                description: "A luxurious kesar malai flavour with a smooth, rich and aromatic taste.",
                tag: "Rich Taste"
            },
            {
                id: "bulk-jamun",
                name: "Jamun",
                category: "bulk",
                size: "5 Litre Tub",
                image: "images/jamun.png",
                description: "A distinctive jamun-inspired flavour with a fruity balance of sweetness and mild tanginess.",
                tag: "Fruity Exotic"
            },
            {
                id: "bulk-lotus-biscoff",
                name: "Lotus Biscoff",
                category: "bulk",
                size: "5 Litre Tub",
                image: "images/lotusbiscoff.png",
                description: "A rich and indulgent flavour inspired by the popular Lotus Biscoff taste profile.",
                tag: "New Launch"
            },
            {
                id: "bulk-blueberry",
                name: "Blueberry",
                category: "bulk",
                size: "5 Litre Tub",
                image: "images/blueberry.png",
                description: "A refreshing blueberry-inspired flavour with a sweet, fruity and creamy taste.",
                tag: "Fruity Hits"
            }
        ];

        let activeCategory = 'all';
        let searchQuery = '';

        const searchInput = document.getElementById('products-search-input');
        const searchClearBtn = document.getElementById('products-search-clear');
        const filterPills = document.querySelectorAll('.filter-pill');
        const filteredCountEl = document.getElementById('filtered-count');
        const totalCountEl = document.getElementById('total-count');
        const noProductsAlert = document.getElementById('no-products-alert');
        const resetFiltersBtn = document.getElementById('reset-filters-btn');

        // Set total count
        if (totalCountEl) {
            totalCountEl.textContent = productsList.length;
        }

        // WhatsApp redirect helper for card inquiry
        window.inquireProductWhatsApp = function(productName, size) {
            const phone = "919672334414";
            const message = `👋 Hello ORAS Ice Cream Team,

I am interested in becoming a partner/distributor and would like to inquire about the following product format:

🍨 *Product:* ${productName}
📦 *Format/Size:* ${size}

Please share the pricing, minimum order quantities, and distributor details. Thank you!`;
            const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        };

        // Render products grid
        const renderProducts = () => {
            // Filter by category and search
            const filteredProducts = productsList.filter(prod => {
                const matchesCategory = activeCategory === 'all' || prod.category === activeCategory;
                const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                     prod.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                     prod.description.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesCategory && matchesSearch;
            });

            // Update count indicator
            if (filteredCountEl) {
                filteredCountEl.textContent = filteredProducts.length;
            }

            // Show empty state if nothing matches
            if (filteredProducts.length === 0) {
                productsGrid.style.display = 'none';
                if (noProductsAlert) noProductsAlert.style.display = 'block';
            } else {
                productsGrid.style.display = 'grid';
                if (noProductsAlert) noProductsAlert.style.display = 'none';

                // Build HTML structure dynamically
                productsGrid.innerHTML = filteredProducts.map(prod => {
                    const categoryLabel = prod.category === 'bulk' ? '5 Litre Pack' : 
                                          prod.category === 'family' ? 'Family Pack' : 
                                          prod.category.charAt(0).toUpperCase() + prod.category.slice(1);
                    return `
                        <article class="product-card scroll-reveal visible" data-category="${prod.category}">
                            <div class="product-card-img-wrapper ${prod.bgClass || ''}">
                                <img src="${prod.image}" alt="${prod.name}" loading="lazy" onload="if(this.naturalWidth > this.naturalHeight) this.classList.add('img-landscape');" onerror="this.onerror=null; this.src='images/product/vn.png';">
                            </div>
                            <div class="product-card-info">
                                <div class="product-card-meta">
                                    <span class="product-card-category">${categoryLabel}</span>
                                </div>
                                <h3>${prod.name}</h3>
                                <p class="product-card-desc">${prod.description}</p>
                                <div class="product-card-action">
                                    <button onclick="inquireProductWhatsApp('${prod.name}', '${prod.size}')" class="btn-card-inquire" aria-label="Inquire about ${prod.name}">
                                        <i class="fa-brands fa-whatsapp"></i> Inquire Now
                                    </button>
                                </div>
                            </div>
                        </article>
                    `;
                }).join('');
            }
        };

        // Select Category Pill function
        const selectCategory = (category) => {
            activeCategory = category;
            filterPills.forEach(pill => {
                pill.classList.toggle('active', pill.dataset.category === category);
            });
            renderProducts();
        };

        // Parse query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const queryCategory = urlParams.get('category');
        if (queryCategory) {
            // Find pill matching query
            const validCategories = ['candy', 'chocobar', 'kulfi', 'cone', 'cup', 'family', 'bulk'];
            if (validCategories.includes(queryCategory)) {
                selectCategory(queryCategory);
            } else {
                renderProducts();
            }
        } else {
            renderProducts();
        }

        // Add event listeners for pills
        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                selectCategory(pill.dataset.category || 'all');
            });
        });

        // Search inputs event listeners
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                if (searchClearBtn) {
                    if (searchQuery.trim().length > 0) {
                        searchClearBtn.classList.add('visible');
                    } else {
                        searchClearBtn.classList.remove('visible');
                    }
                }
                renderProducts();
            });
        }

        // Search clear button
        if (searchClearBtn && searchInput) {
            searchClearBtn.addEventListener('click', () => {
                searchInput.value = '';
                searchQuery = '';
                searchClearBtn.classList.remove('visible');
                renderProducts();
                searchInput.focus();
            });
        }

        // Reset button in empty alert state
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => {
                if (searchInput) {
                    searchInput.value = '';
                }
                searchQuery = '';
                if (searchClearBtn) {
                    searchClearBtn.classList.remove('visible');
                }
                selectCategory('all');
            });
        }
    }
});


