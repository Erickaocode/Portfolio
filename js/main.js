// ===== TRANSIÇÃO PORTFOLIO — scroll reveal letra a letra =====
(function () {
    const sec = document.getElementById('portfolio-transicao');
    if (!sec) return;
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                sec.classList.add('pt-visible');
                obs.unobserve(sec);
            }
        });
    }, { threshold: 0.25 });
    obs.observe(sec);
})();
(function () {
    const hs = document.getElementById('headline-scroll');
    if (!hs) return;
    const clone = hs.cloneNode(true);
    clone.id = '';
    hs.parentNode.appendChild(clone);
})();
