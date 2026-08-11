// Hevo marketing site — no framework, no build step.

document.addEventListener('DOMContentLoaded', () => {
    initNavToggle();
    initReveal();
    initHeroChat();
    initMiniHeat();
    initYear();
});

function initNavToggle() {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', () => {
        const open = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
    });
    links.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => links.classList.remove('open'));
    });
}

function initReveal() {
    const targets = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || targets.length === 0) {
        targets.forEach((el) => el.classList.add('in'));
        return;
    }
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    targets.forEach((el) => observer.observe(el));
}

// Loops a small, believable qualification conversation inside the hero
// phone frame: client message -> typing indicator -> Hevo's reply.
function initHeroChat() {
    const body = document.getElementById('hero-chat-body');
    if (!body) return;

    const script = [
        { from: 'in', text: 'Oi! Vocês têm espaço disponível pra um casamento em outubro, uns 120 convidados?' },
        { from: 'out', text: 'Oi! Temos sim 🎉 Outubro ainda tem datas livres. Você já tem um dia específico em mente?' },
        { from: 'in', text: 'Ainda não fechei, mas queria saber a faixa de valor pra esse número de convidados' },
        { from: 'out', text: 'Pra 120 convidados o pacote fica entre R$ 18 mil e R$ 24 mil, dependendo do cardápio. Quer que eu já veja um horário pra uma visita?' },
        { from: 'in', text: 'Quero sim! Pode ser sábado de manhã?' },
        { from: 'out', text: 'Consegui um horário sábado às 10h — te enviei a confirmação e já registrei tudo aqui 👍' },
    ];

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        script.forEach((msg) => body.appendChild(makeBubble(msg)));
        return;
    }

    let i = 0;
    const MAX_BUBBLES = 4;

    function trim() {
        while (body.children.length > MAX_BUBBLES) {
            body.removeChild(body.firstChild);
        }
    }

    function step() {
        if (!document.body.contains(body)) return;
        const msg = script[i % script.length];

        if (msg.from === 'out') {
            const typing = document.createElement('div');
            typing.className = 'bubble typing';
            typing.innerHTML = '<span></span><span></span><span></span>';
            body.appendChild(typing);
            trim();
            body.scrollTop = body.scrollHeight;
            setTimeout(() => {
                typing.remove();
                body.appendChild(makeBubble(msg));
                trim();
                body.scrollTop = body.scrollHeight;
                i += 1;
                setTimeout(step, 1900);
            }, 1100);
        } else {
            body.appendChild(makeBubble(msg));
            trim();
            body.scrollTop = body.scrollHeight;
            i += 1;
            setTimeout(step, 1500);
        }
    }

    setTimeout(step, 700);
}

function makeBubble(msg) {
    const el = document.createElement('div');
    el.className = `bubble ${msg.from}`;
    el.textContent = msg.text;
    return el;
}

// Fills the dashboard mockup's heatmap with a fixed, plausible-looking
// pattern (busier weekend evenings) — decorative, not real data.
function initMiniHeat() {
    const grid = document.querySelector('.mini-heat');
    if (!grid) return;
    const levels = [
        0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 1, 1, 2, 1, 0, 0, 0,
        0, 0, 0, 0, 1, 2, 3, 2, 1, 1, 0, 0,
        0, 0, 0, 1, 2, 3, 4, 3, 2, 1, 0, 0,
    ];
    const shades = ['#eef1ee', '#cfe1e4', '#8fb8bf', '#3f8391', '#206172'];
    grid.innerHTML = levels
        .map((lvl) => `<i style="background:${shades[lvl]}"></i>`)
        .join('');
}

function initYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
}
