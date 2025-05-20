/**
 * Handles the download functionality
 */
export function setupDownloader() {
  const downloadBtn = document.getElementById('download-btn');
  const urlInput = document.getElementById('youtubeUrl');
  const formatSelect = document.getElementById('formatOption');
  
  downloadBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    const format = formatSelect.value;
    
    if (!url) {
      showStatus('error', 'Error', 'Please enter a valid YouTube URL');
      return;
    }
    
    await startDownload(url, format);
  });
}

/**
 * Starts the download process
 */
async function startDownload(url, format) {
  const downloadBtn = document.getElementById('download-btn');
  const statusDiv = document.getElementById('status');
  
  // Update button state to loading
  downloadBtn.classList.add('loading');
  statusDiv.classList.add('hidden');
  
  try {
    const backendUrl = localStorage.getItem('backendUrl') || 'http://localhost:3000';
    const response = await fetch(`${backendUrl}/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, format }),
    });
    
    const result = await response.json();
    
    if (response.ok) {
      showSuccessStatus(result);
    } else {
      showErrorStatus(result);
    }
  } catch (error) {
    showStatus('error', 'Network Error', `Unable to connect to the server: ${error.message}`);
  } finally {
    // Reset button state
    downloadBtn.classList.remove('loading');
  }
}

function resetAll() {
  const statusCard = document.getElementById("status-card")
  const urlInput = document.getElementById("youtubeUrl")

  if (urlInput) {
    urlInput.value = '';
  }
  if (statusCard) {
    statusCard.innerHTML = '';
  }
  if (urlInput) {
    urlInput.focus();
  }
}
window.resetAll = resetAll;

function openDownloadTab(fileUrl) {
  const newTab = window.open();
  if (!newTab) {
    alert("Trình duyệt đã chặn pop-up. Hãy cho phép pop-up.");
    return;
  }

  const safeUrl = fileUrl.replace(/"/g, '&quot;');

  newTab.document.write(`
    <html>
      <head>
        <title>Downloading...</title>
      </head>
      <body>
        <p>Đang tải file... tab này sẽ tự đóng sau vài giây.</p>
        <script>
          const a = document.createElement('a');
          a.href = "${safeUrl}";
          a.download = "";
          document.body.appendChild(a);
          a.click();
          setTimeout(() => window.close(), 3000);
        <\/script>
      </body>
    </html>
  `);
  newTab.document.close();
}
window.openDownloadTab = openDownloadTab;
/**
 * Shows a success status with download link
 */
function showSuccessStatus(result) {
  const { message, download_link, details } = result;

  let statusHTML = `
    <div class="status-title success" id="status-card">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      Success
    </div>
    <div class="status-message">${message}</div>
  `;

  if (download_link) {
    const backend_url = localStorage.getItem('backendUrl') || 'http://localhost:3000';
    const full_url = `${backend_url}${download_link}`;

    statusHTML += `
    <a href="#" onclick="openDownloadTab('${full_url}')" class="download-link">
      Save to device
    </a>
    <br/>
    <button onclick="resetAll()" id="reset-btn" style="display: inline-block;
                                                      margin-top: var(--space-3);
                                                      padding: var(--space-2) var(--space-4);
                                                      background-color: var(--color-primary);
                                                      color: white;
                                                      border-radius: var(--radius-md);
                                                      text-decoration: none;
                                                      font-weight: 500;
                                                      transition: background-color var(--transition-fast);">
    Download Another Video</button>
  `;
  }

  if (details) {
    statusHTML += `
      <div class="details-section">
        <div class="details-title" id="details-toggle">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
          Show Details
        </div>
        <div class="details-content" id="details-content">${details}</div>
      </div>
    `;
  }

  showStatus('success', null, null, statusHTML);

  // Setup details toggle
  setupDetailsToggle();
}


/**
 * Shows an error status
 */
function showErrorStatus(result) {
  const { error, details, stdout } = result;
  
  let statusHTML = `
    <div class="status-title error">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      Error
    </div>
    <div class="status-message">${error}</div>
  `;
  
  if (details || stdout) {
    statusHTML += `
      <div class="details-section">
        <div class="details-title" id="details-toggle">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
          Show Details
        </div>
        <div class="details-content" id="details-content">
          ${details ? `<p>Details: ${details}</p>` : ''}
          ${stdout ? `<p>Output: ${stdout}</p>` : ''}
        </div>
      </div>
    `;
  }
  
  showStatus('error', null, null, statusHTML);
  
  // Setup details toggle
  setupDetailsToggle();
}

/**
 * Shows a status message
 */
function showStatus(type, title, message, customHTML = null) {
  const statusDiv = document.getElementById('status');
  
  // Reset classes
  statusDiv.className = 'status-container';
  statusDiv.classList.add(type);
  
  if (customHTML) {
    statusDiv.innerHTML = customHTML;
  } else {
    statusDiv.innerHTML = `
      <div class="status-title ${type}">
        ${type === 'success' ? 
          `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>` : 
          `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>`
        }
        ${title}
      </div>
      <div class="status-message">${message}</div>
    `;
  }
  
  // Show the status container
  statusDiv.classList.remove('hidden');
}

/**
 * Sets up the details toggle functionality
 */
function setupDetailsToggle() {
  const detailsToggle = document.getElementById('details-toggle');
  const detailsContent = document.getElementById('details-content');
  
  if (detailsToggle && detailsContent) {
    detailsToggle.addEventListener('click', () => {
      detailsToggle.classList.toggle('open');
      detailsContent.classList.toggle('open');
    });
  }
}