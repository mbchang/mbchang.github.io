(function() {
  // Parallax background effect
  var htmlStyles = window.getComputedStyle(document.querySelector("html"));
  var bkgd_multiplier = parseFloat(htmlStyles.getPropertyValue("--bkgd-multiplier")) / 100.0;
  var parallax = document.querySelectorAll("body"),
    speed = 0.5;
  window.onscroll = function() {
    [].slice.call(parallax).forEach(function(el, i) {
      var windowYOffset = window.pageYOffset,
        elBackgrounPos = "50% " + (-windowYOffset * speed) + "px";
      el.style.backgroundPosition = elBackgrounPos;
    });
  };
})();

// Page load fade-in animation
window.addEventListener('load', function() {
  document.body.classList.add('loaded');
});

const init = () => {
  // Theme Toggle Logic
  const initThemeToggle = () => {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle';
    toggleBtn.setAttribute('aria-label', 'Toggle dark mode');
    document.body.appendChild(toggleBtn);

    const moonIcon = '<svg viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/></svg>';
    const sunIcon = '<svg viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 000 1.41.996.996 0 001.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06z"/></svg>';

    const updateIcon = (theme) => {
      toggleBtn.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
    };

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');

    // Default to light mode unless saved otherwise
    let currentTheme = savedTheme || 'light';

    // Apply initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateIcon(currentTheme);

    toggleBtn.addEventListener('click', () => {
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateIcon(newTheme);
      currentTheme = newTheme;
    });
  };

  initThemeToggle();

  // Mobile Navigation
  const initMobileNav = () => {
    // Create toggle button
    const navToggle = document.createElement('button');
    navToggle.className = 'mobile-nav-toggle';
    navToggle.innerHTML = '☰'; // Hamburger icon
    navToggle.setAttribute('aria-label', 'Menu');
    document.body.appendChild(navToggle);

    // Create overlay
    const navOverlay = document.createElement('div');
    navOverlay.className = 'mobile-nav-overlay';
    document.body.appendChild(navOverlay);

    // Populate with links from vertical nav
    const desktopNavItems = document.querySelectorAll('.vertical-nav .nav-item');
    desktopNavItems.forEach(item => {
      const label = item.querySelector('.nav-label').textContent;
      const targetSelector = item.getAttribute('data-target');

      const link = document.createElement('a');
      link.className = 'mobile-nav-item';
      link.textContent = label;

      link.addEventListener('click', () => {
        const target = document.querySelector(targetSelector);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          // Close menu
          navOverlay.classList.remove('active');
          navToggle.innerHTML = '☰';
        }
      });

      navOverlay.appendChild(link);
    });

    // Toggle logic
    navToggle.addEventListener('click', () => {
      const isActive = navOverlay.classList.contains('active');
      if (isActive) {
        navOverlay.classList.remove('active');
        navToggle.innerHTML = '☰';
      } else {
        navOverlay.classList.add('active');
        navToggle.innerHTML = '✕'; // Close icon
      }
    });
  };

  initMobileNav();

  // Make external links open in new tab
  const links = document.querySelectorAll('a[href]');
  links.forEach(link => {
    const href = link.getAttribute('href');
    // Check if link is external (starts with http/https and not same domain)
    if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
      const currentDomain = window.location.hostname;
      try {
        const linkDomain = new URL(href).hostname;
        if (linkDomain !== currentDomain) {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      } catch (e) {
        // Invalid URL, skip
      }
    }
  });

  // Fade in sections on scroll
  const allSections = document.querySelectorAll('.section-card, .hero');
  const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        fadeInObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  allSections.forEach(section => {
    fadeInObserver.observe(section);
  });

  // Mark tweets as loaded when they render
  const tweetEmbeds = document.querySelectorAll('.tweet-embed');
  tweetEmbeds.forEach(embed => {
    const checkTweetLoaded = setInterval(() => {
      const iframe = embed.querySelector('iframe');
      if (iframe) {
        embed.classList.add('loaded');
        clearInterval(checkTweetLoaded);
      }
    }, 100);

    // Stop checking after 10 seconds
    setTimeout(() => {
      embed.classList.add('loaded');
      clearInterval(checkTweetLoaded);
    }, 10000);
  });

  const accordionToggles = Array.from(document.querySelectorAll('.accordion-toggle'));

  const updateAccordionState = (toggle, shouldExpand) => {
    const panel = toggle.nextElementSibling;
    if (!panel) return;
    toggle.setAttribute('aria-expanded', shouldExpand.toString());

    if (shouldExpand) {
      panel.hidden = false;
      // Force reflow to trigger animation
      void panel.offsetHeight;
    } else {
      // Wait for animation to finish before hiding
      setTimeout(() => {
        if (toggle.getAttribute('aria-expanded') === 'false') {
          panel.hidden = true;
        }
      }, 300); // Match CSS transition duration
    }
  };

  accordionToggles.forEach(toggle => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    updateAccordionState(toggle, expanded);
    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      updateAccordionState(toggle, !isExpanded);
    });
  });

  // Back to top button visibility
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
  }

  // Position Nav Items Proportionally
  const updateNavPositions = () => {
    const navItems = document.querySelectorAll('.nav-item');
    if (navItems.length === 0) return;

    const firstTarget = document.querySelector(navItems[0].getAttribute('data-target'));
    const lastTarget = document.querySelector(navItems[navItems.length - 1].getAttribute('data-target'));

    if (!firstTarget || !lastTarget) return;

    // Use the document offset top relative to the page top
    const getOffsetTop = (element) => {
      let offsetTop = 0;
      while (element) {
        offsetTop += element.offsetTop;
        element = element.offsetParent;
      }
      return offsetTop;
    }

    const startY = getOffsetTop(firstTarget);
    // Use the bottom of the last element as the end point
    const endY = getOffsetTop(lastTarget) + lastTarget.offsetHeight;
    const totalDist = endY - startY;

    if (totalDist <= 0) return;

    navItems.forEach(item => {
      const targetSelector = item.getAttribute('data-target');
      const target = document.querySelector(targetSelector);
      if (target) {
        const targetY = getOffsetTop(target);
        const percentage = (targetY - startY) / totalDist;
        // Clamp between 0 and 100%
        const clampedPercentage = Math.max(0, Math.min(1, percentage)) * 100;
        item.style.top = `${clampedPercentage}%`;
      }
    });
  };

  // Update positions on load and resize
  window.addEventListener('load', updateNavPositions);
  window.addEventListener('resize', updateNavPositions);
  // Also update after a short delay to ensure layout is settled (images loaded etc)
  setTimeout(updateNavPositions, 500);
  setTimeout(updateNavPositions, 2000);

  // Vertical Navigation Active State
  const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px', // Trigger when element is in middle of viewport
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
          item.classList.remove('active');
        });

        // Add active class to corresponding nav item
        const id = entry.target.id;
        let navItem;
        if (entry.target.classList.contains('hero')) {
          navItem = document.querySelector('.nav-item:first-child');
        } else {
          navItem = document.querySelector(`.nav-item[data-target="#${id}"]`);
        }

        if (navItem) {
          navItem.classList.add('active');
        }
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Observe all sections
  document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
  });

  // Lightbox Implementation
  const createLightbox = () => {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <button class="lightbox-close">&times;</button>
      <button class="lightbox-nav lightbox-prev">&lsaquo;</button>
      <button class="lightbox-nav lightbox-next">&rsaquo;</button>
      <div class="lightbox-caption"></div>
      <img class="lightbox-content" src="" alt="Full screen view">
    `;
    document.body.appendChild(lightbox);
    return lightbox;
  };

  const lightbox = createLightbox();
  const lightboxImg = lightbox.querySelector('.lightbox-content');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxPrev = lightbox.querySelector('.lightbox-prev');
  const lightboxNext = lightbox.querySelector('.lightbox-next');

  // Add click listeners to hobby images
  const hobbyImages = Array.from(document.querySelectorAll('.hobby-image'));
  let currentImageIndex = 0;

  const openLightbox = (index) => {
    if (index < 0 || index >= hobbyImages.length) return;
    currentImageIndex = index;
    const img = hobbyImages[index];
    lightboxImg.src = img.src;
    lightboxCaption.textContent = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    setTimeout(() => {
      lightboxImg.src = '';
      lightboxCaption.textContent = '';
    }, 300); // Clear source after transition
  };

  const showNextImage = (e) => {
    e?.stopPropagation();
    const nextIndex = (currentImageIndex + 1) % hobbyImages.length;
    openLightbox(nextIndex);
  };

  const showPrevImage = (e) => {
    e?.stopPropagation();
    const prevIndex = (currentImageIndex - 1 + hobbyImages.length) % hobbyImages.length;
    openLightbox(prevIndex);
  };

  hobbyImages.forEach((img, index) => {
    img.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  // Navigation listeners
  lightboxNext.addEventListener('click', showNextImage);
  lightboxPrev.addEventListener('click', showPrevImage);

  // Close on click outside or close button
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightboxClose) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNextImage();
    } else if (e.key === 'ArrowLeft') {
      showPrevImage();
    }
  });

  // Gallery Carousel Logic
  const initGalleryCarousel = () => {
    const track = document.querySelector('.carousel-track');
    if (!track) return; // No carousel on this page

    const slides = Array.from(track.children);
    const indicators = Array.from(document.querySelectorAll('.carousel-indicator'));
    let currentSlideIndex = 0;
    const slideInterval = 3000; // 3 seconds

    const goToSlide = (index) => {
      // Handle wrap-around
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;

      // Update slides
      slides.forEach((slide, i) => {
        if (i === index) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      // Update indicators
      indicators.forEach((indicator, i) => {
        if (i === index) {
          indicator.classList.add('active');
        } else {
          indicator.classList.remove('active');
        }
      });

      currentSlideIndex = index;
    };

    // Auto-play
    let autoPlayTimer = setInterval(() => {
      goToSlide(currentSlideIndex + 1);
    }, slideInterval);

    const resetTimer = () => {
      clearInterval(autoPlayTimer);
      autoPlayTimer = setInterval(() => {
        goToSlide(currentSlideIndex + 1);
      }, slideInterval);
    };

    // Indicator clicks
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        goToSlide(index);
        resetTimer();
      });
    });

    // Button clicks
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        goToSlide(currentSlideIndex - 1);
        resetTimer();
      });

      nextBtn.addEventListener('click', () => {
        goToSlide(currentSlideIndex + 1);
        resetTimer();
      });
    }

    // Pause on hover (optional)
    const carousel = document.querySelector('.gallery-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
      carousel.addEventListener('mouseleave', resetTimer);
    }
  };

  initGalleryCarousel();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
