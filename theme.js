/**
 * Handles theme toggling functionality (light/dark mode)
 */
export function setupThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  // Check for user preference in localStorage or system preference
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');
  
  // Apply theme based on saved preference or system preference
  if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
    document.body.classList.add('dark-mode');
    updateThemeIcon(true);
  }
  
  // Toggle theme on button click
  themeToggleBtn.addEventListener('click', () => {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    updateThemeIcon(isDarkMode);
    
    // Add subtle animation for theme change
    animateThemeChange();
  });
}

/**
 * Updates the theme toggle icon based on current theme
 */
function updateThemeIcon(isDarkMode) {
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  if (isDarkMode) {
    themeToggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>`;
  } else {
    themeToggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>`;
  }
}

/**
 * Adds a subtle animation when theme changes
 */
function animateThemeChange() {
  const appCard = document.querySelector('.app-card');
  
  // Add a subtle scale effect
  appCard.style.transition = 'transform 0.3s ease, background-color 0.25s ease, box-shadow 0.25s ease';
  appCard.style.transform = 'scale(0.98)';
  
  setTimeout(() => {
    appCard.style.transform = 'scale(1)';
  }, 300);
}