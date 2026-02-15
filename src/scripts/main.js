/**
 * Load external HTML into an element
 * @param {string} selector - Element ID or selector
 * @param {string} path - File path
 */
async function loadComponent(selector, path) {
  try {
    const container = document.querySelector(selector);
    if (!container) {
      console.warn(`Container not found: ${selector}`);
      return;
    }

    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${path} | Status: ${response.status}`);
    }

    const html = await response.text();
    container.innerHTML = html;

    // Dispatch a custom event to signal component loaded
    const event = new CustomEvent("componentLoaded", { detail: { selector } });
    document.dispatchEvent(event);
  } catch (error) {
    console.error(`Component load error (${path}):`, error);
  }
}

// Animation Observer
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Clear inline styles that were hiding the element
      entry.target.style.opacity = "";
      entry.target.style.animationPlayState = "";

      // Add class to trigger CSS animations if generic
      entry.target.classList.add("fade-in");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

function initAnimations() {
  const animatedElements = document.querySelectorAll(
    ".hero-text, .info-card, .news-card, .stat-item, .section-title",
  );
  animatedElements.forEach((el) => {
    el.style.opacity = "0"; // Start hidden
    el.style.animationPlayState = "paused"; // Pause CSS animations if any
    observer.observe(el);
  });
}

// Scroll To Top
function createScrollTopButton() {
  const btn = document.createElement("button");
  btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
  btn.className = "scroll-top-btn";
  btn.setAttribute("aria-label", "Back to top");
  document.body.appendChild(btn);

  btn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });

  window.addEventListener("scroll", () => {
    btn.classList.toggle("is-visible", window.scrollY > 300);
  });
}

/* Stats Counter Animation */
function initStatsCounter() {
  const stats = document.querySelectorAll(".stat-number");

  const statsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          // Clean text to get number (e.g. "+7" -> 7)
          const originalText = el.textContent;
          const target = parseInt(originalText.replace(/\D/g, ""));

          if (isNaN(target)) return;

          const duration = 2000;
          let startTimestamp = null;
          const hasPlus = originalText.includes("+");

          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min(
              (timestamp - startTimestamp) / duration,
              1,
            );

            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * target);

            el.textContent = (hasPlus ? "+" : "") + current;

            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              el.textContent = originalText;
            }
          };

          window.requestAnimationFrame(step);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 },
  );

  stats.forEach((stat) => statsObserver.observe(stat));
}

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("#header", "../components/header/header.html");
  loadComponent("#footer", "../components/footer/footer.html");

  // Initialize features after a slight delay to ensure DOM is ready
  setTimeout(() => {
    initAnimations();
    createScrollTopButton();
    initStatsCounter();

    // Header scroll effect
    const header = document.querySelector(".main-header");
    window.addEventListener("scroll", () => {
      if (header) {
        header.classList.toggle("scrolled", window.scrollY > 50);
      }
    });
  }, 100);
});

// Re-run animations for dynamically loaded content if needed
document.addEventListener("componentLoaded", (e) => {
  if (e.detail.selector === "#header") {
    // Hook up mobile menu
    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");

    if (menuToggle && mainNav) {
      menuToggle.addEventListener("click", () => {
        mainNav.classList.toggle("active");
        menuToggle.classList.toggle("active");
      });
    }
  }
});
