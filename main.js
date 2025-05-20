import './style.css';
import { setupThemeToggle } from './theme.js';
import { setupInputControls } from './input-controls.js';
import { setupDownloader } from './downloader.js';
import { setupStatusView } from './status-view.js';
import { setupSettings } from './settings.js';

document.addEventListener('DOMContentLoaded', () => {
  setupThemeToggle();

  setupInputControls();

  setupDownloader();

  setupStatusView();

  setupSettings();
});