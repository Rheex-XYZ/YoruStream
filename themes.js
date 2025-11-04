// YoruStream - Theme Management System

// Theme Configuration
const themes = {
  dark: {
    name: "Dark",
    description: "Default dark theme with blue accents",
    colors: {
      primary: "#6366f1",
      secondary: "#8b5cf6",
      accent: "#06b6d4",
      background: "#0f0f23",
      surface: "#1a1a2e",
      text: "#ffffff",
    },
  },
  light: {
    name: "Light",
    description: "Clean light theme for daytime viewing",
    colors: {
      primary: "#6366f1",
      secondary: "#8b5cf6",
      accent: "#06b6d4",
      background: "#ffffff",
      surface: "#f8fafc",
      text: "#1e293b",
    },
  },
  neon: {
    name: "Neon",
    description: "Cyberpunk-inspired neon theme",
    colors: {
      primary: "#00ff88",
      secondary: "#ff0080",
      accent: "#00ccff",
      background: "#000000",
      surface: "#0a0a0a",
      text: "#ffffff",
    },
  },
  purple: {
    name: "Purple",
    description: "Elegant purple gradient theme",
    colors: {
      primary: "#8b5cf6",
      secondary: "#a855f7",
      accent: "#ec4899",
      background: "#1a0033",
      surface: "#2d1b69",
      text: "#ffffff",
    },
  },
};

// Theme Manager Class
class ThemeManager {
  constructor() {
    this.currentTheme = "dark";
    this.transitionDuration = 300;
    this.init();
  }

  init() {
    // Load saved theme
    const savedTheme = localStorage.getItem("yorustream-theme");
    if (savedTheme && themes[savedTheme]) {
      this.setTheme(savedTheme, false);
    }

    // Initialize theme controls
    this.initializeThemeControls();

    // Listen for system theme changes
    this.listenForSystemThemeChanges();
  }

  initializeThemeControls() {
    const themeButtons = document.querySelectorAll(".theme-btn");

    themeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const theme = button.getAttribute("data-theme");
        if (theme && themes[theme]) {
          this.setTheme(theme);
          this.updateActiveButton(button);
        }
      });
    });

    // Update initial active button
    const currentButton = document.querySelector(
      `[data-theme="${this.currentTheme}"]`
    );
    if (currentButton) {
      this.updateActiveButton(currentButton);
    }
  }

  setTheme(themeName, animate = true) {
    if (!themes[themeName]) {
      console.error(`Theme "${themeName}" not found`);
      return;
    }

    const oldTheme = this.currentTheme;
    this.currentTheme = themeName;

    // Apply theme with animation
    if (animate) {
      this.animateThemeChange(oldTheme, themeName);
    } else {
      document.body.setAttribute("data-theme", themeName);
    }

    // Save theme preference
    localStorage.setItem("yorustream-theme", themeName);

    // Dispatch theme change event
    this.dispatchThemeChangeEvent(themeName, oldTheme);

    console.log(`Theme changed from ${oldTheme} to ${themeName}`);
  }

  animateThemeChange(oldTheme, newTheme) {
    // Add transition class
    document.body.classList.add("theme-transitioning");

    // Apply new theme
    document.body.setAttribute("data-theme", newTheme);

    // Remove transition class after animation
    setTimeout(() => {
      document.body.classList.remove("theme-transitioning");
    }, this.transitionDuration);

    // Add visual feedback
    this.showThemeChangeEffect(newTheme);
  }

  showThemeChangeEffect(themeName) {
    const theme = themes[themeName];

    // Create ripple effect
    const ripple = document.createElement("div");
    ripple.className = "theme-change-ripple";
    ripple.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: ${theme.colors.primary};
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 9999;
            opacity: 0.3;
            animation: themeRipple ${this.transitionDuration}ms ease-out;
        `;

    document.body.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, this.transitionDuration);
  }

  updateActiveButton(activeButton) {
    const allButtons = document.querySelectorAll(".theme-btn");
    allButtons.forEach((btn) => btn.classList.remove("active"));
    activeButton.classList.add("active");
  }

  listenForSystemThemeChanges() {
    // Listen for system dark/light mode changes
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    darkModeQuery.addEventListener("change", (e) => {
      // Only auto-switch if user hasn't manually selected a theme
      const hasManualTheme = localStorage.getItem("yorustream-theme");
      if (!hasManualTheme) {
        const systemTheme = e.matches ? "dark" : "light";
        this.setTheme(systemTheme);
      }
    });
  }

  dispatchThemeChangeEvent(newTheme, oldTheme) {
    const event = new CustomEvent("themeChanged", {
      detail: {
        newTheme,
        oldTheme,
        themeData: themes[newTheme],
      },
    });
    document.dispatchEvent(event);
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

  getThemeData(themeName = null) {
    const theme = themeName || this.currentTheme;
    return themes[theme];
  }

  getAllThemes() {
    return themes;
  }

  resetToDefault() {
    this.setTheme("dark");
    localStorage.removeItem("yorustream-theme");
  }

  // Advanced theme features
  createCustomTheme(name, config) {
    if (themes[name]) {
      console.warn(`Theme "${name}" already exists`);
      return false;
    }

    themes[name] = {
      name: config.name || name,
      description: config.description || "Custom theme",
      colors: {
        primary: config.primary || "#6366f1",
        secondary: config.secondary || "#8b5cf6",
        accent: config.accent || "#06b6d4",
        background: config.background || "#0f0f23",
        surface: config.surface || "#1a1a2e",
        text: config.text || "#ffffff",
      },
    };

    return true;
  }

  exportTheme(themeName = null) {
    const theme = themeName || this.currentTheme;
    if (!themes[theme]) return null;

    return JSON.stringify(themes[theme], null, 2);
  }

  importTheme(themeData, name) {
    try {
      const parsed =
        typeof themeData === "string" ? JSON.parse(themeData) : themeData;
      return this.createCustomTheme(name, parsed);
    } catch (error) {
      console.error("Failed to import theme:", error);
      return false;
    }
  }
}

// Theme-specific utilities
class ThemeUtils {
  static getContrastColor(backgroundColor) {
    // Convert hex to RGB
    const hex = backgroundColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? "#000000" : "#ffffff";
  }

  static adjustBrightness(color, amount) {
    const hex = color.replace("#", "");
    const r = Math.max(
      0,
      Math.min(255, parseInt(hex.substr(0, 2), 16) + amount)
    );
    const g = Math.max(
      0,
      Math.min(255, parseInt(hex.substr(2, 2), 16) + amount)
    );
    const b = Math.max(
      0,
      Math.min(255, parseInt(hex.substr(4, 2), 16) + amount)
    );

    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }

  static hexToRgba(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  static generateGradient(color1, color2, direction = "135deg") {
    return `linear-gradient(${direction}, ${color1}, ${color2})`;
  }
}

// Add theme transition styles
const themeTransitionStyles = document.createElement("style");
themeTransitionStyles.textContent = `
    .theme-transitioning * {
        transition: background-color 300ms ease, 
                   border-color 300ms ease, 
                   color 300ms ease, 
                   box-shadow 300ms ease !important;
    }

    @keyframes themeRipple {
        0% {
            width: 0;
            height: 0;
            opacity: 0.3;
        }
        50% {
            opacity: 0.1;
        }
        100% {
            width: 200vmax;
            height: 200vmax;
            opacity: 0;
        }
    }

    /* Theme-specific scrollbar animations */
    .theme-transitioning::-webkit-scrollbar-thumb {
        transition: background-color 300ms ease;
    }

    /* Theme preview hover effects */
    .theme-preview {
        transition: transform 200ms ease, box-shadow 200ms ease;
    }

    .theme-btn:hover .theme-preview {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .theme-btn.active .theme-preview {
        transform: scale(1.05);
        box-shadow: 0 0 0 3px var(--primary-color);
    }

    /* Smooth theme transitions for specific elements */
    .navbar, .hero-section, .features-section, .card, .modal-content, .popup-content {
        transition: background-color 300ms ease, border-color 300ms ease;
    }

    /* Theme-aware focus styles */
    .theme-transitioning *:focus {
        transition: box-shadow 300ms ease;
    }
`;
document.head.appendChild(themeTransitionStyles);

// Initialize theme manager when DOM is loaded
let themeManager;

document.addEventListener("DOMContentLoaded", () => {
  themeManager = new ThemeManager();

  // Make theme manager globally available
  window.themeManager = themeManager;
  window.ThemeUtils = ThemeUtils;

  // Listen for theme change events
  document.addEventListener("themeChanged", (e) => {
    const { newTheme, themeData } = e.detail;

    // Update any theme-dependent UI elements
    updateThemeDependentElements(newTheme, themeData);

    // Show theme change notification
    if (window.showNotification) {
      window.showNotification(
        `Tema berhasil diubah ke ${themeData.name}`,
        "success"
      );
    }
  });
});

// Update theme-dependent elements
function updateThemeDependentElements(themeName, themeData) {
  // Update meta theme-color for mobile browsers
  let themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (!themeColorMeta) {
    themeColorMeta = document.createElement("meta");
    themeColorMeta.name = "theme-color";
    document.head.appendChild(themeColorMeta);
  }
  themeColorMeta.content = themeData.colors.primary;

  // Update any canvas or dynamic elements that need theme updates
  const event = new CustomEvent("themeElementsUpdate", {
    detail: { themeName, themeData },
  });
  document.dispatchEvent(event);
}

// Theme keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + Shift + T to cycle themes
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "T") {
    e.preventDefault();
    if (themeManager) {
      const themeNames = Object.keys(themes);
      const currentIndex = themeNames.indexOf(themeManager.getCurrentTheme());
      const nextIndex = (currentIndex + 1) % themeNames.length;
      themeManager.setTheme(themeNames[nextIndex]);
    }
  }
});

// Export for use in other modules
export { ThemeManager, ThemeUtils, themes };
