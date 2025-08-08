/**
 * Matthew Gall Custom Theme JavaScript
 */

(function() {
  'use strict';

  // Theme Management
  class ThemeManager {
    constructor() {
      this.themeToggle = document.getElementById('theme-toggle');
      this.currentTheme = this.getCurrentTheme();
      this.init();
    }

    getCurrentTheme() {
      // Check localStorage first
      const stored = localStorage.getItem('theme');
      if (stored && (stored === 'light' || stored === 'dark')) {
        return stored;
      }
      
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      
      return 'light';
    }

    setTheme(theme) {
      this.currentTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      
      // Update ARIA label
      if (this.themeToggle) {
        this.themeToggle.setAttribute('aria-label', 
          theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
        );
      }
    }

    toggleTheme() {
      const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
      this.setTheme(newTheme);
    }

    init() {
      // Set initial theme
      this.setTheme(this.currentTheme);
      
      // Add theme toggle event listener
      if (this.themeToggle) {
        this.themeToggle.addEventListener('click', () => {
          this.toggleTheme();
        });
      }
      
      // Listen for system theme changes
      if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          if (!localStorage.getItem('theme')) {
            this.setTheme(e.matches ? 'dark' : 'light');
          }
        });
      }
    }
  }

  // Mobile Menu Management
  class MobileMenu {
    constructor() {
      this.toggle = document.getElementById('mobile-menu-toggle');
      this.menu = document.getElementById('navbar-menu');
      this.isOpen = false;
      this.init();
    }

    init() {
      if (this.toggle && this.menu) {
        this.toggle.addEventListener('click', () => {
          this.toggleMenu();
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
          if (this.isOpen && 
              !this.menu.contains(e.target) && 
              !this.toggle.contains(e.target)) {
            this.closeMenu();
          }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && this.isOpen) {
            this.closeMenu();
          }
        });
        
        // Close menu when window is resized to desktop size
        let resizeTimeout;
        window.addEventListener('resize', () => {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(() => {
            // Use media query instead of reading innerWidth
            if (window.matchMedia('(min-width: 769px)').matches && this.isOpen) {
              this.closeMenu();
            }
          }, 150);
        });
      }
    }

    toggleMenu() {
      if (this.isOpen) {
        this.closeMenu();
      } else {
        this.openMenu();
      }
    }

    openMenu() {
      this.isOpen = true;
      this.menu.classList.add('active');
      this.toggle.classList.add('active');
      this.toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
    }

    closeMenu() {
      this.isOpen = false;
      this.menu.classList.remove('active');
      this.toggle.classList.remove('active');
      this.toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }
  }

  // Smooth Scrolling for Anchor Links
  class SmoothScroll {
    constructor() {
      this.init();
    }

    init() {
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (link && link.hash) {
          const target = document.querySelector(link.hash);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
            
            // Update URL without triggering scroll
            if (history.pushState) {
              history.pushState(null, null, link.hash);
            }
          }
        }
      });
    }
  }

  // Reading Progress Bar (for blog posts)
  class ReadingProgress {
    constructor() {
      this.progressBar = this.createProgressBar();
      this.init();
    }

    createProgressBar() {
      const bar = document.createElement('div');
      bar.className = 'reading-progress';
      bar.innerHTML = '<div class="reading-progress-fill"></div>';
      
      // CSS is now in main.css to prevent layout shifts
      document.body.appendChild(bar);
      
      return bar;
    }

    updateProgress() {
      // Batch DOM reads to prevent forced reflow
      const scrollTop = window.pageYOffset;
      
      // Use cached values when possible
      if (!this.viewportHeight) {
        this.viewportHeight = window.innerHeight;
        this.documentHeight = document.documentElement.scrollHeight - this.viewportHeight;
      }
      
      const progress = (scrollTop / this.documentHeight) * 100;
      const clampedProgress = Math.max(0, Math.min(100, progress));
      
      // Use transform instead of width for better performance
      const fill = this.progressBar.querySelector('.reading-progress-fill');
      fill.style.transform = `scaleX(${clampedProgress / 100})`;
      fill.style.transformOrigin = 'left center';
    }

    init() {
      // Only show on blog posts
      if (document.querySelector('.post')) {
        let ticking = false;
        
        const updateProgress = () => {
          this.updateProgress();
          ticking = false;
        };
        
        window.addEventListener('scroll', () => {
          if (!ticking) {
            requestAnimationFrame(updateProgress);
            ticking = true;
          }
        });
        
        // Show/hide based on scroll position
        window.addEventListener('scroll', () => {
          if (window.pageYOffset > 100) {
            this.progressBar.classList.add('visible');
          } else {
            this.progressBar.classList.remove('visible');
          }
        });
        
        // Recalculate on resize
        window.addEventListener('resize', () => {
          this.viewportHeight = null; // Force recalculation
        });
      }
    }
  }

  // Copy Code Button for Code Blocks
  class CodeCopyButton {
    constructor() {
      this.init();
    }

    init() {
      document.querySelectorAll('pre code').forEach((codeBlock) => {
        const button = document.createElement('button');
        button.className = 'code-copy-btn';
        button.textContent = 'Copy';
        button.setAttribute('aria-label', 'Copy code to clipboard');
        
        button.addEventListener('click', () => {
          this.copyToClipboard(codeBlock.textContent, button);
        });
        
        const wrapper = codeBlock.parentElement;
        wrapper.appendChild(button);
      });
      
      // CSS is now in main.css to prevent layout shifts
    }

    async copyToClipboard(text, button) {
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = 'Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
          button.textContent = 'Copy';
          button.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy code: ', err);
        button.textContent = 'Failed';
        
        setTimeout(() => {
          button.textContent = 'Copy';
        }, 2000);
      }
    }
  }

  // Lazy Loading for Images
  class LazyLoading {
    constructor() {
      this.imageObserver = null;
      this.init();
    }

    init() {
      if ('IntersectionObserver' in window) {
        this.imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              observer.unobserve(img);
            }
          });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
          img.classList.add('lazy');
          this.imageObserver.observe(img);
        });
      }
      
      // CSS is now in main.css to prevent layout shifts
    }
  }

  // Accessibility Features
  class AccessibilityManager {
    constructor() {
      this.init();
    }

    init() {
      // Font size controls
      document.addEventListener('click', (e) => {
        if (e.target.matches('[data-action="increase-font"]')) {
          this.toggleFontSize('large');
          e.target.blur(); // Remove focus after click
        } else if (e.target.matches('[data-action="decrease-font"]')) {
          this.toggleFontSize('small');
          e.target.blur(); // Remove focus after click
        } else if (e.target.matches('[data-action="high-contrast"]')) {
          this.toggleHighContrast();
          e.target.blur(); // Remove focus after click
        } else if (e.target.matches('[data-action="focus-mode"]')) {
          this.toggleFocusMode();
          e.target.blur(); // Remove focus after click
        }
      });

      // Skip to top functionality
      this.initSkipToTop();
    }

    toggleFontSize(size) {
      const targetClass = size + '-font';
      const btn = document.querySelector(`[data-action="${size === 'large' ? 'increase' : 'decrease'}-font"]`);
      
      if (document.body.classList.contains(targetClass)) {
        // Currently active, so turn it off
        document.body.classList.remove(targetClass);
        btn?.classList.remove('active');
      } else {
        // Not active, so turn it on and turn off the other
        document.body.classList.remove('large-font', 'small-font');
        document.body.classList.add(targetClass);
        
        // Update button states
        document.querySelectorAll('.font-size-btn').forEach(button => {
          button.classList.remove('active');
        });
        btn?.classList.add('active');
      }
    }

    toggleHighContrast() {
      document.body.classList.toggle('high-contrast');
      const btn = document.querySelector('[data-action="high-contrast"]');
      btn?.classList.toggle('active');
    }

    toggleFocusMode() {
      document.body.classList.toggle('focus-mode');
      const btn = document.querySelector('[data-action="focus-mode"]');
      btn?.classList.toggle('active');
    }

    initSkipToTop() {
      const skipButton = document.querySelector('.skip-to-top');
      if (!skipButton) return;

      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
          skipButton.classList.add('visible');
        } else {
          skipButton.classList.remove('visible');
        }
      });
    }
  }

  // Table of Contents Highlighting
  class TOCHighlighter {
    constructor() {
      this.toc = document.querySelector('#toc');
      this.headings = document.querySelectorAll('.prose-content h1, .prose-content h2, .prose-content h3, .prose-content h4, .prose-content h5, .prose-content h6');
      this.init();
    }

    init() {
      if (!this.toc || this.headings.length === 0) return;

      // Create intersection observer for headings
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const id = entry.target.id;
          const tocLink = this.toc.querySelector(`a[href="#${id}"]`);
          
          if (tocLink) {
            if (entry.isIntersecting) {
              tocLink.style.fontWeight = '600';
              tocLink.style.color = 'var(--primary)';
            } else {
              tocLink.style.fontWeight = '400';
              tocLink.style.color = 'var(--text-secondary)';
            }
          }
        });
      }, {
        rootMargin: '-20% 0% -80% 0%'
      });

      this.headings.forEach(heading => {
        if (heading.id) {
          observer.observe(heading);
        }
      });
    }
  }

  // Initialize all components when DOM is ready
  function init() {
    new ThemeManager();
    new MobileMenu();
    new SmoothScroll();
    new ReadingProgress();
    new CodeCopyButton();
    new LazyLoading();
    new AccessibilityManager();
    new TOCHighlighter();
    
    console.log('Matthew Gall theme initialized');
  }

  // DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();