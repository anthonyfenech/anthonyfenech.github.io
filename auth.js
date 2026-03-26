// Password Protection for anthonyfenech.com
// Simple hash-based authentication with localStorage persistence

(function() {
    'use strict';

    // Password hash (run simpleHash('NEWPASSWORD') in console to update)
    const PASSWORD_HASH = -55499576;
    const AUTH_KEY = 'af_site_auth';

    // Simple hash function for password obfuscation
    function simpleHash(str) {
        if (!str || typeof str !== 'string') return 0;
        let hash = 0;
        const salt = 'af2024personal';
        const salted = salt + str.toUpperCase() + salt;
        for (let i = 0; i < salted.length; i++) {
            const char = salted.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    }

    // Check if user is authenticated
    function isAuthenticated() {
        try {
            const auth = localStorage.getItem(AUTH_KEY);
            return auth === 'true';
        } catch {
            return false;
        }
    }

    // Authenticate user
    function authenticate(password) {
        const inputHash = simpleHash(password);
        if (inputHash === PASSWORD_HASH) {
            localStorage.setItem(AUTH_KEY, 'true');
            return true;
        }
        return false;
    }

    // Logout
    function logout() {
        localStorage.removeItem(AUTH_KEY);
        window.location.reload();
    }

    // Create and show the password gate
    function createGate() {
        // Create gate container
        const gate = document.createElement('div');
        gate.id = 'passwordGate';
        gate.innerHTML = `
            <div class="gate-content">
                <h1 class="gate-title">ANTH<span class="letter-o">O<span class="red-dot"></span></span>NY FENECH</h1>
                <form id="passwordForm" class="gate-form">
                    <input type="password" id="passwordInput" placeholder="Enter password" autocomplete="off" autofocus>
                    <button type="submit">ENTER</button>
                </form>
                <p id="passwordError" class="gate-error"></p>
            </div>
        `;

        // Create styles
        const styles = document.createElement('style');
        styles.id = 'gateStyles';
        styles.textContent = `
            #passwordGate {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: #fefefe;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
            }

            #passwordGate.hidden {
                display: none !important;
            }

            .gate-content {
                text-align: center;
                padding: 20px;
                width: 100%;
                max-width: 400px;
            }

            .gate-title {
                font-family: 'Courier New', monospace;
                font-size: 28px;
                text-transform: uppercase;
                letter-spacing: 3px;
                color: #333;
                margin-bottom: 40px;
                font-weight: bold;
            }

            .gate-title .letter-o {
                position: relative;
                display: inline-block;
            }

            .gate-title .red-dot {
                position: absolute;
                top: 48%;
                left: 46%;
                transform: translate(-50%, -50%);
                width: 4px;
                height: 4px;
                background-color: #e31c1c;
                border-radius: 50%;
            }

            .gate-form {
                display: flex;
                flex-direction: column;
                gap: 15px;
                align-items: center;
            }

            .gate-form input {
                font-family: 'Courier New', monospace;
                font-size: 16px;
                padding: 12px 20px;
                border: 2px solid #333;
                background: #fefefe;
                color: #333;
                width: 100%;
                max-width: 280px;
                text-align: center;
                letter-spacing: 2px;
            }

            .gate-form input:focus {
                outline: none;
                border-color: #000;
            }

            .gate-form input::placeholder {
                color: #999;
                letter-spacing: 1px;
            }

            .gate-form button {
                font-family: 'Courier New', monospace;
                font-size: 14px;
                font-weight: bold;
                padding: 12px 40px;
                background: #333;
                color: #fefefe;
                border: 2px solid #333;
                cursor: pointer;
                text-transform: uppercase;
                letter-spacing: 2px;
                transition: all 0.2s ease;
            }

            .gate-form button:hover {
                background: #fefefe;
                color: #333;
            }

            .gate-error {
                font-family: 'Courier New', monospace;
                font-size: 14px;
                color: #e31c1c;
                margin-top: 20px;
                min-height: 20px;
            }

            .shake {
                animation: shake 0.5s ease-in-out;
            }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                20%, 60% { transform: translateX(-10px); }
                40%, 80% { transform: translateX(10px); }
            }

            /* Logout button styles */
            #logoutBtn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                font-family: 'Courier New', monospace;
                font-size: 11px;
                color: #ccc;
                background: none;
                border: none;
                cursor: pointer;
                padding: 5px 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
                transition: color 0.2s ease;
                z-index: 1000;
            }

            #logoutBtn:hover {
                color: #999;
            }

            @media (max-width: 600px) {
                .gate-title {
                    font-size: 22px;
                    letter-spacing: 2px;
                }

                .gate-form input {
                    font-size: 14px;
                    padding: 10px 15px;
                }

                .gate-form button {
                    font-size: 12px;
                    padding: 10px 30px;
                }
            }
        `;

        document.head.appendChild(styles);
        document.body.insertBefore(gate, document.body.firstChild);

        // Handle form submission
        const form = document.getElementById('passwordForm');
        const input = document.getElementById('passwordInput');
        const error = document.getElementById('passwordError');

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const password = input.value.trim();
            if (authenticate(password)) {
                gate.classList.add('hidden');
                document.body.style.overflow = '';
                addLogoutButton();
            } else {
                error.textContent = 'Incorrect password';
                input.value = '';
                input.focus();
                form.classList.add('shake');
                setTimeout(() => form.classList.remove('shake'), 500);
            }
        });

        input.addEventListener('input', function() {
            error.textContent = '';
        });

        // Prevent scrolling on body while gate is visible
        document.body.style.overflow = 'hidden';
    }

    // Add logout button
    function addLogoutButton() {
        if (document.getElementById('logoutBtn')) return;

        const btn = document.createElement('button');
        btn.id = 'logoutBtn';
        btn.textContent = 'Logout';
        btn.addEventListener('click', logout);
        document.body.appendChild(btn);
    }

    // Initialize
    function init() {
        if (isAuthenticated()) {
            addLogoutButton();
        } else {
            createGate();
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose logout function globally for manual use
    window.siteLogout = logout;
})();
