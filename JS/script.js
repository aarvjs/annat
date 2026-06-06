/* ==========================================================================
   JTGeats Core Javascript - Interactivity & Component Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Global State & DOM Selections ---
    const body = document.body;
    
    // Mobile Nav
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Modals
    const modals = document.querySelectorAll('.modal');
    const modalCloseButtons = document.querySelectorAll('[data-close]');
    
    // Specific Modal Triggers
    const searchBtn = document.getElementById('search-btn');
    const searchModal = document.getElementById('search-modal');
    const searchInput = document.getElementById('modal-search-input');
    const searchForm = document.getElementById('modal-search-form');
    const searchResultsList = document.getElementById('search-results-list');
    
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const cartCountBadge = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    const playVideoBtn = document.getElementById('play-video-btn');
    const videoModal = document.getElementById('video-modal');
    const serviceVideo = document.getElementById('service-video');
    
    const requestDishBtn = document.getElementById('request-dish-btn');
    const requestModal = document.getElementById('request-modal');
    const requestForm = document.getElementById('request-form');
    
    // Forms
    const contactForm = document.getElementById('contact-form');
    
    // Carousel Elements
    const carouselTrack = document.getElementById('carousel-track');
    const carouselSlides = Array.from(document.querySelectorAll('.carousel-slide'));
    const carouselPrev = document.getElementById('carousel-prev');
    const carouselNext = document.getElementById('carousel-next');
    const carouselDotsContainer = document.getElementById('carousel-dots');
    
    // Toast Container
    const toastContainer = document.getElementById('toast-container');
    
    // Cart Data
    let cart = [];
    
    // Menu Data (Mock items database for Search functionality)
    const menuItems = [
        { id: 1, name: 'Home made pizza', price: 19.00, img: 'assets/images/pizza_premium.png', rating: 4.7, category: 'pizza' },
        { id: 2, name: 'Home made pasta', price: 15.00, img: 'assets/images/pasta_premium.png', rating: 4.6, category: 'pasta' },
        { id: 3, name: 'Golden roast chicken', price: 22.00, img: 'assets/images/roasted_chicken.png', rating: 4.8, category: 'chicken' },
        { id: 4, name: 'Spicy chicken tikka', price: 18.00, img: 'assets/images/indian_curry.png', rating: 4.9, category: 'chicken' },
        { id: 5, name: 'Veggie supreme pizza', price: 20.00, img: 'assets/images/pizza_premium.png', rating: 4.5, category: 'pizza' },
        { id: 6, name: 'Creamy fettuccine', price: 16.00, img: 'assets/images/pasta_premium.png', rating: 4.7, category: 'pasta' },
        { id: 7, name: 'Tandoori roast chicken', price: 24.00, img: 'assets/images/roasted_chicken.png', rating: 4.8, category: 'chicken' },
        { id: 8, name: 'Butter chicken masala', price: 19.50, img: 'assets/images/indian_curry.png', rating: 4.9, category: 'curry' },
        { id: 9, name: 'Margherita pizza', price: 17.00, img: 'assets/images/pizza_premium.png', rating: 4.6, category: 'pizza' },
        { id: 10, name: 'Pesto penne pasta', price: 14.50, img: 'assets/images/pasta_premium.png', rating: 4.7, category: 'pasta' },
        { id: 11, name: 'Garlic herb chicken', price: 21.00, img: 'assets/images/roasted_chicken.png', rating: 4.7, category: 'chicken' },
        { id: 12, name: 'Spicy lamb curry', price: 23.00, img: 'assets/images/indian_curry.png', rating: 4.8, category: 'curry' }
    ];

    
    // --- 2. Toast Notification Helper ---
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Icon selection
        const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        const errorIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
        
        toast.innerHTML = `
            ${type === 'success' ? checkIcon : errorIcon}
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto remove toast
        setTimeout(() => {
            toast.classList.add('fade-out');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 3000);
    }

    
    // --- 3. Mobile Navigation & ScrollSpy ---
    hamburgerBtn.addEventListener('click', () => {
        const expanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
        hamburgerBtn.setAttribute('aria-expanded', !expanded);
        hamburgerBtn.classList.toggle('active');
        mainNav.classList.toggle('active');
    });

    // Close mobile nav when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            hamburgerBtn.classList.remove('active');
            mainNav.classList.remove('active');
        });
    });

    // ScrollSpy active state navigation update
    const sections = document.querySelectorAll('section, footer');
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 100; // Offset for sticky navbar
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    
    // --- 4. Modals Controller System ---
    function openModal(modalElement) {
        modalElement.classList.add('active');
        modalElement.setAttribute('aria-hidden', 'false');
        body.style.overflow = 'hidden'; // Stop background scrolling
        
        // Focus first input or close button
        const focusable = modalElement.querySelectorAll('button, [href], input, select, textarea, [tabindex="0"]');
        if (focusable.length > 0) {
            setTimeout(() => focusable[0].focus(), 100);
        }
    }

    function closeModal(modalElement) {
        modalElement.classList.remove('active');
        modalElement.setAttribute('aria-hidden', 'true');
        body.style.overflow = ''; // Restore background scroll
        
        // Special Modal Cleanup Actions
        if (modalElement.id === 'video-modal' && serviceVideo) {
            serviceVideo.pause(); // stop video sound on close
        }
    }

    // Modal Close Triggers
    modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const activeModal = e.target.closest('.modal');
            if (activeModal) closeModal(activeModal);
        });
    });

    // Close on Backdrop overlay click
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                closeModal(modal);
            }
        });
    });

    // Keyboard Esc Close
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) closeModal(activeModal);
        }
    });

    // Opening Triggers
    if (playVideoBtn && videoModal) {
        playVideoBtn.addEventListener('click', () => {
            openModal(videoModal);
            if (serviceVideo) {
                serviceVideo.currentTime = 0;
                serviceVideo.play().catch(err => {
                    console.log('Video auto-play failed. User needs interaction.', err);
                });
            }
        });
    }

    if (requestDishBtn && requestModal) {
        requestDishBtn.addEventListener('click', () => {
            openModal(requestModal);
        });
    }

    if (searchBtn && searchModal) {
        searchBtn.addEventListener('click', () => {
            openModal(searchModal);
            setTimeout(() => searchInput.focus(), 200);
        });
    }

    if (cartBtn && cartModal) {
        cartBtn.addEventListener('click', () => {
            openModal(cartModal);
        });
    }

    
    // --- 5. Custom Popular Items Carousel Slider ---
    let carouselIndex = 0;
    let visibleSlidesCount = 3;
    let autoSlideInterval = null;
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationId = 0;

    function getGap() {
        return 30; // Matches standard spacing in CSS
    }

    function calculateLayout() {
        const width = window.innerWidth;
        if (width <= 768) {
            visibleSlidesCount = 1;
        } else if (width <= 1024) {
            visibleSlidesCount = 2;
        } else {
            visibleSlidesCount = 3;
        }
        
        // Total slides in carousel slides
        const maxIndex = carouselSlides.length - visibleSlidesCount;
        if (carouselIndex > maxIndex) {
            carouselIndex = Math.max(0, maxIndex);
        }
        
        setupDots();
        moveCarousel(false);
    }

    function setupDots() {
        carouselDotsContainer.innerHTML = '';
        const maxIndex = carouselSlides.length - visibleSlidesCount + 1;
        for (let i = 0; i < maxIndex; i++) {
            const dot = document.createElement('button');
            dot.className = `dot ${i === carouselIndex ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to slide page ${i + 1}`);
            dot.addEventListener('click', () => {
                carouselIndex = i;
                moveCarousel();
            });
            carouselDotsContainer.appendChild(dot);
        }
    }

    function moveCarousel(animate = true) {
        if (carouselSlides.length === 0) return;
        const slideWidth = carouselSlides[0].clientWidth;
        const gap = getGap();
        const translateVal = -carouselIndex * (slideWidth + gap);
        
        carouselTrack.style.transition = animate ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
        carouselTrack.style.transform = `translateX(${translateVal}px)`;
        
        // Update dots styling
        const dots = Array.from(carouselDotsContainer.querySelectorAll('.dot'));
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === carouselIndex);
        });
        
        // Save current positions for dragging
        currentTranslate = translateVal;
        prevTranslate = translateVal;
    }

    function nextSlide() {
        const maxIndex = carouselSlides.length - visibleSlidesCount;
        if (carouselIndex < maxIndex) {
            carouselIndex++;
        } else {
            carouselIndex = 0; // Wrap around
        }
        moveCarousel();
    }

    function prevSlide() {
        const maxIndex = carouselSlides.length - visibleSlidesCount;
        if (carouselIndex > 0) {
            carouselIndex--;
        } else {
            carouselIndex = Math.max(0, maxIndex); // Wrap back to end
        }
        moveCarousel();
    }

    // Nav Click Listeners
    if (carouselNext) carouselNext.addEventListener('click', nextSlide);
    if (carouselPrev) carouselPrev.addEventListener('click', prevSlide);

    // Auto Play Controllers
    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    // Pause on hover
    const carouselViewport = document.getElementById('carousel-viewport');
    if (carouselViewport) {
        carouselViewport.addEventListener('mouseenter', stopAutoSlide);
        carouselViewport.addEventListener('mouseleave', startAutoSlide);
    }

    // Keyboard Arrow Controls
    window.addEventListener('keydown', (e) => {
        // Only trigger slide navigation if section is in viewport
        const carouselSection = document.querySelector('.popular-items-section');
        if (carouselSection) {
            const rect = carouselSection.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
            
            if (isVisible) {
                if (e.key === 'ArrowLeft') {
                    prevSlide();
                } else if (e.key === 'ArrowRight') {
                    nextSlide();
                }
            }
        }
    });

    // Drag / Swipe Gestures Implementation
    if (carouselViewport) {
        // Touch events
        carouselViewport.addEventListener('touchstart', dragStart, { passive: true });
        carouselViewport.addEventListener('touchend', dragEnd);
        carouselViewport.addEventListener('touchmove', dragAction, { passive: true });
        
        // Mouse events
        carouselViewport.addEventListener('mousedown', dragStart);
        carouselViewport.addEventListener('mouseup', dragEnd);
        carouselViewport.addEventListener('mouseleave', dragEnd);
        carouselViewport.addEventListener('mousemove', dragAction);
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function dragStart(event) {
        isDragging = true;
        startX = getPositionX(event);
        stopAutoSlide();
        carouselTrack.style.transition = 'none';
        
        // Request Animation Frame for smooth rendering
        animationId = requestAnimationFrame(animationLoop);
    }

    function dragAction(event) {
        if (!isDragging) return;
        const currentX = getPositionX(event);
        const diff = currentX - startX;
        currentTranslate = prevTranslate + diff;
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        cancelAnimationFrame(animationId);
        
        const movedBy = currentTranslate - prevTranslate;
        const slideWidth = carouselSlides[0].clientWidth + getGap();
        const threshold = 50; // swipe minimum distance in px
        
        const maxIndex = carouselSlides.length - visibleSlidesCount;
        
        if (movedBy < -threshold && carouselIndex < maxIndex) {
            carouselIndex++;
        } else if (movedBy > threshold && carouselIndex > 0) {
            carouselIndex--;
        }
        
        moveCarousel();
        startAutoSlide();
    }

    function animationLoop() {
        if (isDragging) {
            carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
            animationId = requestAnimationFrame(animationLoop);
        }
    }

    // Initialize layout and resize observers
    window.addEventListener('resize', calculateLayout);
    calculateLayout();
    startAutoSlide();

    
    // --- 6. Shopping Basket (Cart System) ---
    function updateCartUI() {
        // Update badge indicator
        const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountBadge.textContent = totalItemsCount;
        
        // Render drawer items list
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your basket is currently empty.</p>';
            cartSummary.style.display = 'none';
        } else {
            cartItemsContainer.innerHTML = '';
            let totalAmount = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                totalAmount += itemTotal;
                
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-info">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                        <div class="cart-item-qty">
                            <button class="qty-btn minus" data-id="${item.id}" aria-label="Decrease quantity">-</button>
                            <span class="qty-val">${item.quantity}</span>
                            <button class="qty-btn plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
                        </div>
                    </div>
                    <button class="remove-cart-item" data-id="${item.id}" aria-label="Remove item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                `;
                cartItemsContainer.appendChild(itemEl);
            });
            
            cartTotalPrice.textContent = `$${totalAmount.toFixed(2)}`;
            cartSummary.style.display = 'block';
        }
    }

    function addToCart(itemId) {
        const itemInfo = menuItems.find(m => m.id === itemId);
        if (!itemInfo) return;
        
        const existingItem = cart.find(c => c.id === itemId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                id: itemInfo.id,
                name: itemInfo.name,
                price: itemInfo.price,
                img: itemInfo.img,
                quantity: 1
            });
        }
        
        updateCartUI();
        showToast(`Added ${itemInfo.name} to basket!`);
    }

    function changeQuantity(itemId, increment) {
        const cartItem = cart.find(c => c.id === itemId);
        if (!cartItem) return;
        
        if (increment) {
            cartItem.quantity++;
        } else {
            cartItem.quantity--;
            if (cartItem.quantity <= 0) {
                cart = cart.filter(c => c.id !== itemId);
            }
        }
        updateCartUI();
    }

    function removeFromCart(itemId) {
        const itemInfo = cart.find(c => c.id === itemId);
        cart = cart.filter(c => c.id !== itemId);
        updateCartUI();
        if (itemInfo) {
            showToast(`Removed ${itemInfo.name} from basket.`, 'error');
        }
    }

    // Attach Click Event listeners to Card Plus Buttons in both Grid and Carousel
    document.addEventListener('click', (e) => {
        const button = e.target.closest('.add-to-cart-btn');
        if (button) {
            const card = button.closest('.menu-card');
            if (card) {
                const itemId = parseInt(card.getAttribute('data-id'), 10);
                addToCart(itemId);
            }
        }
    });

    // Attach Quantity Actions in Cart Drawer
    cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target;
        
        // Plus button
        if (target.closest('.qty-btn.plus')) {
            const itemId = parseInt(target.closest('.qty-btn.plus').getAttribute('data-id'), 10);
            changeQuantity(itemId, true);
        }
        
        // Minus button
        else if (target.closest('.qty-btn.minus')) {
            const itemId = parseInt(target.closest('.qty-btn.minus').getAttribute('data-id'), 10);
            changeQuantity(itemId, false);
        }
        
        // Delete button
        else if (target.closest('.remove-cart-item')) {
            const itemId = parseInt(target.closest('.remove-cart-item').getAttribute('data-id'), 10);
            removeFromCart(itemId);
        }
    });

    // Checkout button listener
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            showToast("Mock Order placed! Thank you for ordering from JTGeats.");
            cart = [];
            updateCartUI();
            closeModal(cartModal);
        });
    }

    
    // --- 7. Search Form & Modal Search Logic ---
    function runSearch(query) {
        if (!query.trim()) {
            searchResultsList.innerHTML = '';
            return;
        }
        
        const matches = menuItems.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        );
        
        searchResultsList.innerHTML = '';
        
        if (matches.length === 0) {
            searchResultsList.innerHTML = '<p class="empty-cart-message">No matching dishes found.</p>';
        } else {
            matches.forEach(item => {
                const searchEl = document.createElement('article');
                searchEl.className = 'search-result-item menu-card';
                searchEl.setAttribute('data-id', item.id);
                searchEl.innerHTML = `
                    <img src="${item.img}" alt="${item.name}" class="search-result-thumb">
                    <div class="search-result-details">
                        <h4 class="search-result-title">${item.name}</h4>
                        <span class="search-result-price">$${item.price.toFixed(2)}</span>
                    </div>
                    <button class="add-to-cart-btn" aria-label="Add ${item.name} to cart">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                `;
                searchResultsList.appendChild(searchEl);
            });
        }
    }

    // Hero Search Trigger
    const heroSearch = document.getElementById('hero-search');
    if (heroSearch) {
        heroSearch.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = heroSearch.querySelector('.search-input');
            const query = input.value.trim();
            if (query) {
                openModal(searchModal);
                searchInput.value = query;
                runSearch(query);
                input.value = '';
            }
        });
    }

    // Modal Realtime Search Input listener
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            runSearch(e.target.value);
        });
    }

    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            runSearch(searchInput.value);
        });
    }

    
    // --- 8. Validation Forms System ---
    
    // Contact Form Validation
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            
            const nameInp = document.getElementById('form-name');
            const emailInp = document.getElementById('form-email');
            const msgInp = document.getElementById('form-message');
            
            // Name check
            if (!nameInp.value.trim()) {
                nameInp.closest('.form-group').classList.add('invalid');
                isValid = false;
            } else {
                nameInp.closest('.form-group').classList.remove('invalid');
            }
            
            // Email check
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInp.value.trim() || !emailPattern.test(emailInp.value)) {
                emailInp.closest('.form-group').classList.add('invalid');
                isValid = false;
            } else {
                emailInp.closest('.form-group').classList.remove('invalid');
            }
            
            // Message check
            if (!msgInp.value.trim()) {
                msgInp.closest('.form-group').classList.add('invalid');
                isValid = false;
            } else {
                msgInp.closest('.form-group').classList.remove('invalid');
            }
            
            if (isValid) {
                showToast(`Form submitted! We will contact you soon, ${nameInp.value.trim()}.`);
                contactForm.reset();
            } else {
                showToast('Please correct the highlighted errors in the form.', 'error');
            }
        });
        
        // Remove error classes dynamically on input
        const inputs = contactForm.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.closest('.form-group').classList.remove('invalid');
            });
        });
    }

    // Custom Request Dish Modal Validation
    if (requestForm && requestModal) {
        requestForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            
            const dishName = document.getElementById('req-dish-name');
            const name = document.getElementById('req-name');
            const phone = document.getElementById('req-phone');
            
            if (!dishName.value.trim()) {
                dishName.closest('.form-group').classList.add('invalid');
                isValid = false;
            } else {
                dishName.closest('.form-group').classList.remove('invalid');
            }
            
            if (!name.value.trim()) {
                name.closest('.form-group').classList.add('invalid');
                isValid = false;
            } else {
                name.closest('.form-group').classList.remove('invalid');
            }
            
            if (!phone.value.trim()) {
                phone.closest('.form-group').classList.add('invalid');
                isValid = false;
            } else {
                phone.closest('.form-group').classList.remove('invalid');
            }
            
            if (isValid) {
                showToast(`Custom request submitted for "${dishName.value.trim()}"!`);
                requestForm.reset();
                closeModal(requestModal);
            } else {
                showToast('Please enter all required information.', 'error');
            }
        });
        
        const reqInputs = requestForm.querySelectorAll('.form-control');
        reqInputs.forEach(input => {
            input.addEventListener('input', () => {
                input.closest('.form-group').classList.remove('invalid');
            });
        });
    }

});
