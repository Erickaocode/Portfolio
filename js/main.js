// ===== FORMULÁRIO DE CONTATO (mailto) =====
(function () {
    const form = document.getElementById('formContato');
    if (!form) return;
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const nome = form.nome.value.trim();
        const telefone = form.telefone.value.trim();
        const email = form.email.value.trim();
        const mensagem = form.mensagem.value.trim();

        const assunto = encodeURIComponent(`Contato via portfólio - ${nome}`);
        const corpo = encodeURIComponent(
            `Nome: ${nome}\nTelefone: ${telefone || 'não informado'}\nEmail: ${email}\n\nMensagem:\n${mensagem}`
        );

        window.location.href = `mailto:ericksilva112017@gmail.com?subject=${assunto}&body=${corpo}`;
    });
})();

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
