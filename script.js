document.addEventListener('DOMContentLoaded', () => {
    // 1. Loader Logic
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1000); // Small delay for better feel
    });

    // 2. Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline with a slight delay for smooth effect
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // 3. Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.background = 'rgba(10, 10, 10, 0.95)';
        } else {
            header.style.padding = '0';
            header.style.background = 'rgba(20, 20, 20, 0.7)';
        }

        // 4. Parallax Effect for Hero
        const heroImage = document.querySelector('.hero-image');
        let scrollValue = window.scrollY;
        if (heroImage) {
            heroImage.style.transform = `scale(1.1) translateY(${scrollValue * 0.4}px)`;
        }
    });

    // 5. Gallery Filtering & Lightbox
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    let currentGallery = [];
    let currentIndex = 0;

    const updateLightbox = (index) => {
        currentIndex = index;
        lightboxImg.src = currentGallery[currentIndex].querySelector('img').src;
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentGallery = Array.from(document.querySelectorAll('.gallery-item')).filter(i => i.style.display !== 'none');
            const indexInFiltered = currentGallery.indexOf(item);

            updateLightbox(indexInFiltered);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Block scroll
        });
    });

    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        const nextIndex = (currentIndex + 1) % currentGallery.length;
        updateLightbox(nextIndex);
    });

    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        const prevIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
        updateLightbox(prevIndex);
    });

    // Filtering logic (Improved to avoid overlapping)
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            // 1. First, set opacity 0 for all gallery items to "clear" the grid
            galleryItems.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.95)';
            });

            // 2. Wait for fade-out, then switch display and fade-in
            setTimeout(() => {
                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.classList.contains(filterValue)) {
                        item.style.display = 'block';
                        // Trigger reflow for animation
                        item.offsetHeight;
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }, 300); // Wait for the 0.4s transition to mostly complete
        });
    });

    // 6. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(faq => faq.classList.remove('active'));
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 7. Intersection Observer for Animations
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .gallery-item, .offer-card, .faq-item').forEach(el => {
        observer.observe(el);
    });
});

// 8. Interactive Calendar Logic
const calendarDays = document.getElementById("calendarDays");
const monthYearText = document.getElementById("currentMonthYear");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");

let currentDate = new Date(2026, 0, 1); // Start with Jan 2026

// Mock booked dates for 2026 (Month: [days])
const bookedDates = {
    0: [10, 11, 24, 25], // Jan
    1: [7, 14, 21],      // Feb
    2: [14, 28],         // Mar
    4: [2, 16, 23, 30],  // May
    5: [6, 13, 20, 27],  // Jun
    6: [4, 11, 18, 25],  // Jul
    7: [1, 8, 15, 22, 29], // Aug
    8: [5, 12, 19, 26]   // Sep
};

const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Limit to 2026
    prevBtn.style.opacity = (year === 2026 && month === 0) ? "0.2" : "1";
    prevBtn.style.pointerEvents = (year === 2026 && month === 0) ? "none" : "auto";
    nextBtn.style.opacity = (year === 2026 && month === 11) ? "0.2" : "1";
    nextBtn.style.pointerEvents = (year === 2026 && month === 11) ? "none" : "auto";

    const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Convert JS 0-6 (Sun-Sat) to 0-6 (Mon-Sun)
    let startingDay = firstDay === 0 ? 6 : firstDay - 1;

    const monthName = new Intl.DateTimeFormat("pl", { month: "long" }).format(currentDate);
    monthYearText.innerText = `${monthName} ${year}`;

    calendarDays.innerHTML = "";

    // Padding for empty days
    for (let i = 0; i < startingDay; i++) {
        const emptyDiv = document.createElement("div");
        emptyDiv.classList.add("calendar-day", "empty");
        calendarDays.appendChild(emptyDiv);
    }

    // Real days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("calendar-day");
        dayDiv.innerText = day;

        // Check if booked
        if (bookedDates[month] && bookedDates[month].includes(day)) {
            dayDiv.classList.add("booked");
        }

        calendarDays.appendChild(dayDiv);
    }
};

if (calendarDays) {
    renderCalendar();
    prevBtn.addEventListener("click", () => {
        if (currentDate.getFullYear() === 2026 && currentDate.getMonth() === 0) return;
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    nextBtn.addEventListener("click", () => {
        if (currentDate.getFullYear() === 2026 && currentDate.getMonth() === 11) return;
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
}

    // 9. Dynamic Statistics Counter
    const animateCounters = () => {
        const counters = document.querySelectorAll(".stat-number");
        const speed = 200;

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute("data-target");
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target + (target > 50 ? "+" : counter.innerText.includes("%") ? "%" : "");
                }
            };
            updateCount();
        });
    };

    const statsSection = document.querySelector(".about-stats");
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (statsSection) statsObserver.observe(statsSection);

    // 10. Back to Top Button
    const backToTop = document.getElementById("backToTop");
    window.addEventListener("scroll", () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add("visible");
        } else {
            backToTop.classList.remove("visible");
        }
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });


    // 11. Mobile Menu Toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            menuToggle.classList.toggle("active");
            // Prevent scrolling when menu is open
            document.body.style.overflow = navLinks.classList.contains("active") ? "hidden" : "initial";
        });

        // Close menu when clicking on a link
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                menuToggle.classList.remove("active");
                document.body.style.overflow = "initial";
            });
        });
    }

