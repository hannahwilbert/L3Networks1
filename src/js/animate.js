// Function to animate elements with Anime.js
const animateElements = (selector, options) => {
  const elements = document.querySelectorAll(selector);

  elements.forEach((element, index) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate when the element enters the viewport
            anime({
              targets: entry.target,
              ...options.animation,
              delay: index * options.stagger, // Add stagger effect
            });
            observer.unobserve(entry.target); // Stop observing after animation
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5, // Trigger when 50% of the element is visible
      }
    );

    observer.observe(element); // Start observing the element
  });
};

// Animate .warn elements
animateElements(".warn-ani", {
  animation: {
    translateY: 0,
    translateX: 0,
    opacity: 1,
    duration: 2000,
    easing: "easeOutElastic",
  },
  stagger: 300, // 0.3 seconds stagger
});

// Animate .feature-ani elements
animateElements(".feature-ani", {
  animation: {
    translateY: 0,
    translateX: 0,
    opacity: 1,
    duration: 1000,
    easing: "easeOutCirc",
  },
  stagger: 300, // 0.3 seconds stagger
});

// Ensure Anime.js is loaded
document.addEventListener("DOMContentLoaded", () => {
  const topfeaturestimeline = anime.timeline({
    easing: "easeOutCubic",
    autoplay: true, // Ensure the timeline starts automatically
  });

  topfeaturestimeline.add(
    {
      targets: ".top-feature-ani", // Use class selector
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 300,
      delay: (el, i, l) => i * 120,
    },
    "-=275"
  );
});


// Home hero title/subtitle: always use typing effect
(function () {
  var type1element = document.getElementById('type1');
  var type2element = document.getElementById('type2');
  if (!type1element || !type2element) return;

  var titleHTML = 'Trust Your IT. Empower Your <span class="text-teal-500">Business</span>.';
  var subtitleText = 'Partner with L3 Networks for Secure, Reliable IT Services. 24/7.';

  function startTyping() {
    // Guard against multiple inits
    if (!window.Typed) { return; }
    new Typed(type1element, {
      strings: [titleHTML],
      typeSpeed: 22,
      backSpeed: 0,
      showCursor: false,
      smartBackspace: true,
      contentType: 'html',
      onComplete: function () {
        new Typed(type2element, {
          strings: [subtitleText],
          typeSpeed: 22,
          backSpeed: 0,
          showCursor: false,
          smartBackspace: true,
        });
      },
    });
  }

  if (window.Typed) {
    startTyping();
  } else {
    // Fallback: try after DOM is fully loaded
    window.addEventListener('load', startTyping, { once: true });
  }
})();

document.addEventListener('alpine:init', () => {
  Alpine.data('dropdownAnimation', () => ({
    isDropdownOpen: false,

    init() {
      // Optional: Log the initial state for debugging
      console.log('Dropdown initialized');
    },

    animateDropdown() {
      const dropdown = this.$refs.dropdown;
      if (this.isDropdownOpen) {
        anime({
          targets: dropdown,
          opacity: 1,
          translateY: 0,
          duration: 200,
          easing: 'easeOutQuad'
        });
      } else {
        anime({
          targets: dropdown,
          opacity: 0,
          translateY: 10,
          duration: 150,
          easing: 'easeInQuad'
        });
      }
    }
  }));
});
