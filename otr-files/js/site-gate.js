// OTR Files - Site Access Gate
// Runs synchronously before page render to enforce password protection

(function() {
  'use strict';

  // Immediately hide page content
  document.documentElement.style.visibility = 'hidden';

  const AUTH_KEY = 'otr-site-auth';
  const PASSWORD = 'goatmode';

  // Check if already authenticated
  if (sessionStorage.getItem(AUTH_KEY) === 'true') {
    document.documentElement.style.visibility = 'visible';
    return;
  }

  // Wait for DOM to be ready, then inject overlay
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectOverlay);
  } else {
    injectOverlay();
  }

  function injectOverlay() {
    // Create overlay container
    const overlay = document.createElement('div');
    overlay.id = 'site-gate-overlay';
    overlay.innerHTML = `
      <div class="gate-container">
        <div class="gate-header">RESTRICTED ACCESS</div>
        <div class="gate-line"></div>
        <div class="gate-form">
          <input type="password" id="gate-password" class="gate-input" placeholder="ENTER ACCESS CODE" autocomplete="off" autofocus>
          <button type="button" id="gate-submit" class="gate-button">AUTHENTICATE</button>
        </div>
        <div id="gate-error" class="gate-error"></div>
      </div>
    `;

    document.body.appendChild(overlay);
    document.documentElement.style.visibility = 'visible';

    // Get elements
    const input = document.getElementById('gate-password');
    const button = document.getElementById('gate-submit');
    const error = document.getElementById('gate-error');
    const container = overlay.querySelector('.gate-container');

    // Focus input
    setTimeout(function() { input.focus(); }, 100);

    // Handle authentication
    function authenticate() {
      const entered = input.value;

      if (entered === PASSWORD) {
        // Success
        sessionStorage.setItem(AUTH_KEY, 'true');
        overlay.classList.add('gate-success');
        setTimeout(function() {
          overlay.remove();
        }, 200);
      } else {
        // Failure
        error.textContent = 'ACCESS DENIED';
        error.classList.add('visible');
        input.value = '';
        container.classList.add('shake');
        setTimeout(function() {
          container.classList.remove('shake');
        }, 500);
        input.focus();
      }
    }

    // Event listeners
    button.addEventListener('click', authenticate);
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        authenticate();
      }
      // Clear error on new input
      if (error.classList.contains('visible')) {
        error.classList.remove('visible');
      }
    });
  }
})();
