/**
 * Resume Builder - Common Functionality
 * Shared functionality across all pages (e.g., mobile navigation)
 */
const CommonFunctions = (function () {
    function init() { setupMobileNavigation(); }
    function setupMobileNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        if (hamburger && navLinks) {
            hamburger.addEventListener('click', function () { hamburger.classList.toggle('active'); navLinks.classList.toggle('active'); });
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', function (event) {
                    const isSamePageAnchor = link.getAttribute('href').startsWith('#');
                    const isCurrentPage = link.href === window.location.href || link.pathname === window.location.pathname;
                    if (isSamePageAnchor || (isCurrentPage && !isSamePageAnchor)) {
                        if (hamburger.classList.contains('active')) { hamburger.classList.remove('active'); navLinks.classList.remove('active'); }
                    }
                });
            });
            document.addEventListener('click', function (event) {
                const isClickInsideNav = navLinks.contains(event.target); const isClickOnHamburger = hamburger.contains(event.target);
                if (!isClickInsideNav && !isClickOnHamburger && navLinks.classList.contains('active')) { hamburger.classList.remove('active'); navLinks.classList.remove('active'); }
            });
        }
    }
    return { init: init };
})();
document.addEventListener('DOMContentLoaded', CommonFunctions.init);
