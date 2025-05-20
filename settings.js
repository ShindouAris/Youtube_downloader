/**
 * Handles the settings functionality
 */
export function setupSettings() {
  const settingsBtn = document.getElementById('settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  const closeBtn = document.getElementById('close-settings');
  const cancelBtn = document.getElementById('cancel-settings');
  const saveBtn = document.getElementById('save-settings');
  const backendUrlInput = document.getElementById('backendUrl');
  
  // Load saved backend URL
  const savedBackendUrl = localStorage.getItem('backendUrl') || 'http://localhost:3000';
  backendUrlInput.value = savedBackendUrl;
  
  // Open settings modal
  settingsBtn.addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
  });
  
  // Close settings modal
  const closeModal = () => {
    settingsModal.classList.add('hidden');
  };
  
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  
  // Close modal when clicking outside
  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
      closeModal();
    }
  });
  
  // Save settings
  saveBtn.addEventListener('click', () => {
    const backendUrl = backendUrlInput.value.trim();
    localStorage.setItem('backendUrl', backendUrl);
    closeModal();
  });
}

/**
 * Get the current backend URL
 */
export function getBackendUrl() {
  return localStorage.getItem('backendUrl') || 'http://localhost:3000';
}