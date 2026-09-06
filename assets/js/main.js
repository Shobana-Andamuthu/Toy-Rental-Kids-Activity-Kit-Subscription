document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Sticky Header on Scroll
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Theme and Direction Persistence via localStorage
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('joyloop-theme') || 'light';
  const savedDirection = localStorage.getItem('joyloop-direction') || 'ltr';

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      const icon = button.querySelector('i');
      if (icon) icon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
      const label = button.querySelector('.theme-label');
      if (label) label.textContent = theme === 'dark' ? 'Light' : 'Dark';
      button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  };

  const applyDirection = (direction) => {
    root.dir = direction;
    document.querySelectorAll('[data-direction-toggle] span').forEach((label) => {
      label.textContent = direction === 'rtl' ? 'RTL' : 'LTR';
    });
  };

  applyTheme(savedTheme);
  applyDirection(savedDirection);

  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('joyloop-theme', theme);
      applyTheme(theme);
    });
  });

  document.querySelectorAll('[data-direction-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const direction = root.dir === 'rtl' ? 'ltr' : 'rtl';
      localStorage.setItem('joyloop-direction', direction);
      applyDirection(direction);
    });
  });

  // Password visibility toggle on Auth pages
  document.querySelectorAll('[data-password-toggle]').forEach((toggleBtn) => {
    toggleBtn.addEventListener('click', () => {
      const targetId = toggleBtn.getAttribute('data-password-toggle');
      const input = document.getElementById(targetId);
      const icon = toggleBtn.querySelector('i');
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          if (icon) icon.className = 'bi bi-eye-slash';
        } else {
          input.type = 'password';
          if (icon) icon.className = 'bi bi-eye';
        }
      }
    });
  });

  // Mobile sidebar controls in Dashboard
  document.querySelectorAll('[data-dash-open-sidebar]').forEach((button) => {
    button.addEventListener('click', () => document.querySelector('#dashSidebar')?.classList.add('show'));
  });

  const closeSidebarBtn = document.getElementById('closeSidebarBtn');
  if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener('click', () => {
      document.querySelector('#dashSidebar')?.classList.remove('show');
    });
  }

  // Dashboard Logout
  document.querySelectorAll('[data-dashboard-logout]').forEach((button) => {
    button.addEventListener('click', () => {
      localStorage.removeItem('joyloop-session');
      localStorage.removeItem('joyloop-auth');
      window.location.href = '../login.html';
    });
  });

  // Mobile Nav: collapsible Home accordion (always starts closed)
  document.querySelectorAll('.mobile-nav-list').forEach((list) => {
    // Remove FAQ from mobile nav list
    list.querySelectorAll('a[href="faq.html"]').forEach((link) => link.closest('li')?.remove());

    const homeLinks = [...list.querySelectorAll('a[href="index.html"], a[href="home-2.html"]')];
    if (homeLinks.length === 2 && !list.querySelector('.mobile-nav-home')) {
      const currentPath = window.location.pathname.toLowerCase();
      const currentFile = currentPath.split('/').pop() || 'index.html';
      const isHomeActive = currentFile === 'index.html' ||
                           currentFile === 'home-2.html' ||
                           currentFile === 'home-2' ||
                           currentFile === '' ||
                           currentPath.endsWith('/') ||
                           currentPath.includes('index') ||
                           currentPath.includes('home-2');

      const homeItem = document.createElement('li');
      homeItem.className = 'mobile-nav-home' + (isHomeActive ? ' has-active' : '');

      // Build button toggle
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', 'mobileHomeSubNav');
      btn.innerHTML = '<span>Home</span> <i class="bi bi-chevron-down mobile-home-caret"></i>';

      if (isHomeActive) {
        btn.classList.add('active');
      }

      // Build sub-list
      const subList = document.createElement('ul');
      subList.className = 'mobile-home-sub list-unstyled';
      subList.id = 'mobileHomeSubNav';
      homeLinks.forEach((link) => {
        const oldItem = link.closest('li');
        const subLi = document.createElement('li');
        subLi.appendChild(link);
        subList.appendChild(subLi);
        if (oldItem) oldItem.remove();

        // Highlight matching sublink
        const href = link.getAttribute('href');
        if (href === currentFile || 
            (currentFile === 'home-2' && href === 'home-2.html') ||
            ((currentFile === '' || currentFile === 'index') && href === 'index.html')) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      homeItem.appendChild(btn);
      homeItem.appendChild(subList);
      list.insertBefore(homeItem, list.firstElementChild);

      // Re-apply highlight whenever mobile offcanvas opens
      const offcanvasEl = document.getElementById('mobileNav');
      if (offcanvasEl) {
        offcanvasEl.addEventListener('show.bs.offcanvas', () => {
          if (isHomeActive) {
            btn.classList.add('active');
            homeItem.classList.add('has-active');
          }
        });
      }

      // Toggle logic
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = homeItem.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        if (isHomeActive) {
          btn.classList.add('active');
          homeItem.classList.add('has-active');
        }
      });
    }
  });

  // Close Home dropdown on outside click
  document.addEventListener('click', () => {
    document.querySelectorAll('.mobile-nav-home.open').forEach((el) => {
      el.classList.remove('open');
      const btn = el.querySelector('button');
      if (btn) {
        btn.setAttribute('aria-expanded', 'false');
        if (el.classList.contains('has-active')) {
          btn.classList.add('active');
        }
      }
    });
  });

  // Dashboard mobile tabs: highlight active page & auto-scroll into view
  const tabLinks = document.querySelectorAll('.dash-tab-btn');
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  tabLinks.forEach((tab) => {
    const tabHref = tab.getAttribute('href');
    if (tabHref === currentFile) {
      tab.classList.add('active');
      setTimeout(() => {
        tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }, 150);
    } else {
      tab.classList.remove('active');
    }
  });

  // Active Link Highlighter
  const navLinks = document.querySelectorAll('.nav-link, .dash-nav-pill');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });

  // Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal-anim');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });
  
  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // ==========================================================================
  // Back To Top Button
  // ==========================================================================
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================================================
  // Modern Page Loader
  // ==========================================================================
  let loader = document.getElementById('pageLoader');
  if (!loader && document.body) {
    loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.id = 'pageLoader';
    loader.innerHTML = `
      <div class="page-loader-inner">
        <div class="loader-spinner-ring">
          <i class="bi bi-box-seam text-primary fs-3"></i>
        </div>
        <div class="loader-brand-text">Joy<span>Loop</span></div>
        <div class="loader-progress-bar"><div class="loader-progress-val"></div></div>
      </div>
    `;
    document.body.insertBefore(loader, document.body.firstChild);
  }

  const dismissLoader = () => {
    const pageLoaderEl = document.getElementById('pageLoader');
    if (pageLoaderEl && !pageLoaderEl.classList.contains('loader-hidden')) {
      pageLoaderEl.classList.add('loader-hidden');
      setTimeout(() => {
        if (pageLoaderEl.parentNode) pageLoaderEl.parentNode.removeChild(pageLoaderEl);
      }, 500);
    }
  };

  if (document.readyState === 'complete') {
    dismissLoader();
  } else {
    window.addEventListener('load', dismissLoader);
    setTimeout(dismissLoader, 900); // Fallback guarantee
  }
});

