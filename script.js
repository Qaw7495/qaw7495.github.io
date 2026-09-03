/* ===========================================================================
   Sayali Magdum — Cloud & DevOps Engineer Portfolio
   Vanilla JavaScript (ES6+) — Zero external dependencies
   =========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ---- DOM Element References ----
  const nav            = document.getElementById('navbar');
  const hamburger      = document.getElementById('hamburger');
  const mobileMenu     = document.getElementById('mobile-menu');
  const allNavLinks    = document.querySelectorAll('.nav-link');
  const navLinksMobile = document.querySelectorAll('.mobile-menu .nav-link');
  const sections       = document.querySelectorAll('.section');
  const animElements   = document.querySelectorAll('.animate-on-scroll');
  const contactForm    = document.getElementById('contact-form');
  const profileImg     = document.querySelector('.about-photo');
  const placeholder    = document.querySelector('.about-photo-placeholder');

  // ---- Motion Preference Check ----
  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==========================================================================
  // 1. NAVBAR SCROLL EFFECT
  // ==========================================================================
  const handleNavbarScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // ==========================================================================
  // 2. MOBILE HAMBURGER MENU
  // ==========================================================================
  const openMobileMenu = () => {
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close mobile menu on any link click
    navLinksMobile.forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close when clicking outside mobile menu
    document.addEventListener('click', (e) => {
      if (
        mobileMenu.classList.contains('active') &&
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        closeMobileMenu();
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }

  // ==========================================================================
  // 3. SMOOTH SCROLLING WITH NAVBAR OFFSET
  // ==========================================================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 70;
      const targetPosition =
        targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    });
  });

  // ==========================================================================
  // 4. ACTIVE SECTION HIGHLIGHTING
  // ==========================================================================
  const setActiveLink = (sectionId) => {
    allNavLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${sectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  const updateActiveSection = () => {
    const navHeight = nav ? nav.offsetHeight : 70;
    const scrollPosition = window.scrollY + navHeight + 80;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;

    // Check if at the very top
    if (window.scrollY < 100) {
      setActiveLink('home');
      return;
    }

    // Check if reached the bottom of the page
    if (window.scrollY + windowHeight >= documentHeight - 50) {
      setActiveLink('contact');
      return;
    }

    // Determine current section in viewport
    let currentId = 'home';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.id;
      }
    });

    setActiveLink(currentId);
  };

  window.addEventListener('scroll', updateActiveSection, { passive: true });
  updateActiveSection();

  // ==========================================================================
  // 5. SCROLL ENTRANCE ANIMATIONS
  // ==========================================================================
  const applyAllVisible = () => {
    animElements.forEach((el) => {
      el.classList.add('animated');
      el.style.opacity = '1';
    });
  };

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    applyAllVisible();
  } else {
    const animObserverOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.05,
    };

    const animObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, animObserverOptions);

    animElements.forEach((el) => animObserver.observe(el));
  }

  // Handle runtime change to reduced motion preference
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery.addEventListener) {
    motionQuery.addEventListener('change', () => {
      if (prefersReducedMotion()) {
        applyAllVisible();
      }
    });
  }

  // ==========================================================================
  // 6. CONTACT FORM — MAILTO GENERATION
  // ==========================================================================
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput    = document.getElementById('contact-name');
      const emailInput   = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');

      const name    = nameInput ? nameInput.value.trim() : '';
      const email   = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !email || !subject || !message) {
        return;
      }

      const emailBody = `Full Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

      const mailtoUrl =
        `mailto:sayalimagdum@outlook.com` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(emailBody)}`;

      window.location.href = mailtoUrl;
    });
  }

  // ==========================================================================
  // 7. PROFILE IMAGE FALLBACK
  // ==========================================================================
  if (profileImg) {
    const showPlaceholder = () => {
      profileImg.classList.add('hidden');
      if (placeholder) {
        placeholder.style.display = 'flex';
      }
    };

    const hidePlaceholder = () => {
      profileImg.classList.remove('hidden');
      if (placeholder) {
        placeholder.style.display = 'none';
      }
    };

    profileImg.addEventListener('error', showPlaceholder);
    profileImg.addEventListener('load', hidePlaceholder);

    // If image is already in error state or missing on execution
    if (profileImg.complete) {
      if (profileImg.naturalWidth === 0) {
        showPlaceholder();
      } else {
        hidePlaceholder();
      }
    }
  }
});
