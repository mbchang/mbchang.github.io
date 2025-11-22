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

document.addEventListener('DOMContentLoaded', function() {
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
      <img class="lightbox-content" src="" alt="Full screen view">
    `;
    document.body.appendChild(lightbox);
    return lightbox;
  };

  const lightbox = createLightbox();
  const lightboxImg = lightbox.querySelector('.lightbox-content');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  const openLightbox = (src) => {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    setTimeout(() => {
      lightboxImg.src = '';
    }, 300); // Clear source after transition
  };

  // Add click listeners to hobby images
  const hobbyImages = document.querySelectorAll('.hobby-image');
  hobbyImages.forEach(img => {
    img.addEventListener('click', () => {
      openLightbox(img.src);
    });
  });

  // Close on click outside or close button
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightboxClose) {
      closeLightbox();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
});
