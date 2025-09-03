/* A modern, dark, and clean color palette */
:root {
    --bg-color: #0d1117;
    --card-bg: #161b22;
    --text-primary: #f0f6fc;
    --text-secondary: #c9d1d9;
    --accent-color: #38a3a5;
    --accent-hover: #4dc2c4;
}

body {
    font-family: 'Inter', sans-serif;
    background-color: var(--bg-color);
    color: var(--text-primary);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
    padding: 2rem;
    line-height: 1.6;
}

.container {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    display: grid;
    gap: 2rem;
}

.header, .footer {
    text-align: center;
    padding: 1rem 0;
}

.card {
    background-color: var(--card-bg);
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    border: 1px solid #30363d;
}

h2 {
    font-size: 2.25rem;
    font-weight: 700;
    color: var(--accent-color);
    text-align: center;
    margin-bottom: 1.5rem;
}

h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1rem;
}

/* Form and input styles */
.form-group {
    margin-bottom: 1.25rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

input[type="text"],
input[type="email"],
textarea,
select {
    width: 100%;
    padding: 0.75rem;
    background-color: #010409;
    border: 1px solid #30363d;
    border-radius: 8px;
    color: var(--text-primary);
    transition: border-color 0.2s;
}

input:focus,
textarea:focus,
select:focus {
    outline: none;
    border-color: var(--accent-color);
}

button {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background-color: var(--accent-color);
    color: var(--bg-color);
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.1s;
}

button:hover {
    background-color: var(--accent-hover);
    transform: translateY(-2px);
}

button:disabled {
    background-color: #585858;
    cursor: not-allowed;
    transform: none;
}

/* Utility classes */
.hidden {
    display: none !important;
}

.text-center {
    text-align: center;
}

/* Community tips display */
#community-tips-display {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-top: 1.5rem;
}

#community-tips-display .card {
    background-color: #0c1016;
    border: 1px solid #2d343a;
    padding: 1.5rem;
}

/* Toast Notification */
#toast-notification {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--accent-color);
    color: var(--bg-color);
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease-in-out, visibility 0s 0.3s;
    z-index: 1000;
}

#toast-notification.show {
    opacity: 1;
    visibility: visible;
    transition-delay: 0s;
}

/* Mobile menu */
#mobile-menu-btn {
    display: none;
}

@media (max-width: 768px) {
    .container {
        padding: 1rem;
    }
    #mobile-menu-btn {
        display: block;
    }
    .desktop-nav {
        display: none;
    }
    #mobile-menu.hidden {
        display: none;
    }
}
