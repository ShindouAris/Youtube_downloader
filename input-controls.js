/**
 * Handles input-related controls (paste, clear buttons)
 */
export function setupInputControls() {
  const urlInput = document.getElementById('youtubeUrl');
  const pasteBtn = document.getElementById('paste-btn');
  const clearBtn = document.getElementById('clear-btn');
  
  // Paste button functionality
  pasteBtn.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      urlInput.value = text;
      validateInput();
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  });
  
  // Clear button functionality
  clearBtn.addEventListener('click', () => {
    urlInput.value = '';
    validateInput();
  });
  
  // Input validation
  urlInput.addEventListener('input', validateInput);
  
  // Initial validation
  validateInput();
}

/**
 * Validates the URL input
 * Shows/hides the clear button based on input value
 */
function validateInput() {
  const urlInput = document.getElementById('youtubeUrl');
  const clearBtn = document.getElementById('clear-btn');
  const downloadBtn = document.getElementById('download-btn');
  
  // Show/hide clear button based on input value
  if (urlInput.value.trim() === '') {
    clearBtn.style.opacity = '0';
    clearBtn.style.pointerEvents = 'none';
  } else {
    clearBtn.style.opacity = '1';
    clearBtn.style.pointerEvents = 'auto';
  }
  
  // Basic YouTube URL validation
  const isValidUrl = isYouTubeUrl(urlInput.value);
  
  // Update download button state
  if (isValidUrl) {
    downloadBtn.disabled = false;
    downloadBtn.style.opacity = '1';
  } else {
    downloadBtn.disabled = true;
    downloadBtn.style.opacity = '0.7';
  }
}

/**
 * Simple validation for YouTube URLs
 */
function isYouTubeUrl(url) {
  if (!url) return false;
  
  // Simple regex for YouTube URLs
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i;
  return youtubeRegex.test(url);
}