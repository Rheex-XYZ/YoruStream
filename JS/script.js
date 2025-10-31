// YoruStream - Main JavaScript File

// Global Variables
let currentTab = "homeTab";
let isOwnerLoggedIn = false;

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

// Initialize Application
function initializeApp() {
  // Hide loading screen after delay
  setTimeout(() => {
    const loadingScreen = document.getElementById("loadingScreen");
    if (loadingScreen) {
      loadingScreen.classList.add("hidden");
      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, 500);
    }
  }, 2000);

  // Initialize navigation
  initializeNavigation();

  // Initialize modals
  initializeModals();

  // Initialize theme system
  initializeThemes();

  // Initialize owner system
  initializeOwnerSystem();

  // Initialize search functionality
  initializeSearch();

  // Initialize card observers
  observeCards();

  // Load saved settings
  loadSavedSettings();

  console.log("YoruStream initialized successfully!");
}

// Navigation System
function initializeNavigation() {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");
  const heroButtons = document.querySelectorAll(".hero-buttons .btn");

  // Hamburger menu toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      }
    });
  }

  // Tab switching
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const tabId = link.getAttribute("data-tab");
      if (tabId) {
        switchTab(tabId);
        // Close mobile menu
        if (hamburger && navMenu) {
          hamburger.classList.remove("active");
          navMenu.classList.remove("active");
        }
      }
    });
  });

  // Hero buttons
  heroButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const tabId = button.getAttribute("data-tab");
      if (tabId) {
        switchTab(tabId);
      }
    });
  });
}

// Tab Switching Function
function switchTab(tabId) {
  // Hide all tabs
  const allTabs = document.querySelectorAll(".tab-content");
  allTabs.forEach((tab) => {
    tab.classList.remove("active");
  });

  // Show selected tab
  const selectedTab = document.getElementById(tabId);
  if (selectedTab) {
    selectedTab.classList.add("active");
    currentTab = tabId;
  }

  // Update navigation
  const allNavLinks = document.querySelectorAll(".nav-link");
  allNavLinks.forEach((link) => {
    link.classList.remove("active");
  });

  const activeNavLink = document.querySelector(`[data-tab="${tabId}"]`);
  if (activeNavLink) {
    activeNavLink.classList.add("active");
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Initialize tab-specific functionality
  initializeTabContent(tabId);
}

// Initialize Tab Content
function initializeTabContent(tabId) {
  switch (tabId) {
    case "animeTab":
      // Anime tab is initialized in anime.js
      break;
    case "donghuaTab":
      // Donghua tab is initialized in donghua.js
      if (typeof initDonghuaTab === "function") {
        initDonghuaTab();
      }
      break;
    case "mangaTab":
      // Manga tab is initialized in manga.js
      if (typeof initMangaTab === "function") {
        initMangaTab();
      }
      break;
    case "filmTab":
      // Film tab is initialized in film.js
      if (typeof loadFilms === "function") {
        loadFilms();
      }
      break;
    case "tvTab":
      // TV tab is initialized in tv.js
      if (typeof initTvTab === "function") {
        initTvTab();
      }
      break;
  }
}

// Modal System
function initializeModals() {
  // Settings Modal
  const settingsBtn = document.getElementById("settingsBtn");
  const settingsModal = document.getElementById("settingsModal");
  const closeSettings = document.getElementById("closeSettings");

  if (settingsBtn && settingsModal) {
    settingsBtn.addEventListener("click", () => {
      settingsModal.classList.add("show");
    });
  }

  if (closeSettings && settingsModal) {
    closeSettings.addEventListener("click", () => {
      settingsModal.classList.remove("show");
    });
  }

  // Owner Modal
  const ownerBtn = document.getElementById("ownerBtn");
  const ownerModal = document.getElementById("ownerModal");
  const closeOwner = document.getElementById("closeOwner");

  if (ownerBtn && ownerModal) {
    ownerBtn.addEventListener("click", () => {
      ownerModal.classList.add("show");
    });
  }

  if (closeOwner && ownerModal) {
    closeOwner.addEventListener("click", () => {
      ownerModal.classList.remove("show");
    });
  }

  // Close modals when clicking outside
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("show");
      }
    });
  });

  // Close popups when clicking outside
  const popups = document.querySelectorAll(".popup-overlay");
  popups.forEach((popup) => {
    popup.addEventListener("click", (e) => {
      if (e.target === popup) {
        popup.classList.remove("show");
      }
    });
  });
}

// Theme System
function initializeThemes() {
  const themeButtons = document.querySelectorAll(".theme-btn");

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const theme = button.getAttribute("data-theme");
      if (theme) {
        setTheme(theme);

        // Update active button
        themeButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
      }
    });
  });
}

// Set Theme Function
function setTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem("yorustream-theme", theme);

  // Add theme transition effect
  document.body.style.transition = "all 0.3s ease";
  setTimeout(() => {
    document.body.style.transition = "";
  }, 300);

  console.log(`Theme changed to: ${theme}`);
}

// Owner System
function initializeOwnerSystem() {
  const ownerLogin = document.getElementById("ownerLogin");
  const ownerPassword = document.getElementById("ownerPassword");
  const ownerPanel = document.getElementById("ownerPanel");
  const clearCache = document.getElementById("clearCache");
  const resetSettings = document.getElementById("resetSettings");

  if (ownerLogin && ownerPassword) {
    ownerLogin.addEventListener("click", () => {
      const password = ownerPassword.value;
      if (password === "170508") {
        isOwnerLoggedIn = true;
        ownerPanel.style.display = "block";
        ownerPassword.value = "";
        showNotification("Login berhasil! Selamat datang, Owner.", "success");
      } else {
        showNotification("Password salah!", "error");
        ownerPassword.value = "";
      }
    });

    // Enter key login
    ownerPassword.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        ownerLogin.click();
      }
    });
  }

  // Owner actions
  if (clearCache) {
    clearCache.addEventListener("click", () => {
      if (isOwnerLoggedIn) {
        localStorage.clear();
        sessionStorage.clear();
        showNotification("Cache berhasil dibersihkan!", "success");
      }
    });
  }

  if (resetSettings) {
    resetSettings.addEventListener("click", () => {
      if (isOwnerLoggedIn) {
        localStorage.removeItem("yorustream-theme");
        setTheme("dark");
        showNotification("Pengaturan berhasil direset!", "success");
      }
    });
  }
}

// Search Functionality
function initializeSearch() {
  // This will be implemented in individual tab files
  // Each tab has its own search functionality
}

// Card Observer for Animations
function observeCards() {
  const cards = document.querySelectorAll(".card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = "running";
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  cards.forEach((card) => {
    observer.observe(card);
  });
}

// Load Saved Settings
function loadSavedSettings() {
  // Load theme
  const savedTheme = localStorage.getItem("yorustream-theme") || "dark";
  setTheme(savedTheme);

  // Update theme button
  const themeButton = document.querySelector(`[data-theme="${savedTheme}"]`);
  if (themeButton) {
    document
      .querySelectorAll(".theme-btn")
      .forEach((btn) => btn.classList.remove("active"));
    themeButton.classList.add("active");
  }
}

// Notification System
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notification) => notification.remove());

  // Create notification
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: var(--background-secondary);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-lg);
        padding: var(--spacing-md);
        box-shadow: 0 10px 30px var(--shadow-color);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;

  // Type-specific styles
  if (type === "success") {
    notification.style.borderColor = "var(--success-color)";
    notification.style.color = "var(--success-color)";
  } else if (type === "error") {
    notification.style.borderColor = "var(--error-color)";
    notification.style.color = "var(--error-color)";
  } else if (type === "warning") {
    notification.style.borderColor = "var(--warning-color)";
    notification.style.color = "var(--warning-color)";
  }

  // Add to DOM
  document.body.appendChild(notification);

  // Close button
  const closeBtn = notification.querySelector(".notification-close");
  closeBtn.addEventListener("click", () => {
    notification.style.animation = "slideOutRight 0.3s ease-in";
    setTimeout(() => notification.remove(), 300);
  });

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = "slideOutRight 0.3s ease-in";
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// Get Notification Icon
function getNotificationIcon(type) {
  switch (type) {
    case "success":
      return "fa-check-circle";
    case "error":
      return "fa-exclamation-circle";
    case "warning":
      return "fa-exclamation-triangle";
    default:
      return "fa-info-circle";
  }
}

// Utility Functions
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Add notification animations to CSS
const notificationStyles = document.createElement("style");
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        flex: 1;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: var(--spacing-xs);
        border-radius: var(--radius-sm);
        transition: all var(--transition-fast);
    }
    
    .notification-close:hover {
        background: var(--background-tertiary);
        color: var(--text-primary);
    }
`;
document.head.appendChild(notificationStyles);

// Export functions for use in other files
window.showNotification = showNotification;
window.switchTab = switchTab;
window.observeCards = observeCards;
window.escapeHtml = escapeHtml;
window.formatDate = formatDate;
window.debounce = debounce;
