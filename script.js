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
        candy: ['strawberry', 'mango', 'mint'],
        chocobar: ['chocolate', 'cookies', 'pistachio'],
        kulfi: ['pistachio', 'mango', 'chocolate'],
        cup: ['mango', 'mint', 'strawberry'],
        cone: ['strawberry', 'chocolate', 'mango', 'pistachio', 'mint', 'cookies'],
        family: ['chocolate', 'cookies', 'strawberry'],
        bulk: ['mango', 'pistachio', 'chocolate']
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
});
