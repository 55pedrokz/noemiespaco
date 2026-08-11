// ================= LOADING SCREEN =================
window.addEventListener("load", () => {
    setTimeout(() => {
        const loader = document.getElementById("loading-screen");
        if (!loader) return;
        loader.classList.add("hide");
        setTimeout(() => loader.remove(), 700);
    }, 1800);
});

document.addEventListener("DOMContentLoaded", () => {
    const hora = new Date().getHours();
    let saudacao = "BOM DIA";
    if (hora >= 12 && hora < 18) saudacao = "BOA TARDE";
    else if (hora >= 18 || hora < 5) saudacao = "BOA NOITE";
    document.getElementById("greeting-text").innerText = saudacao;

    carregarClimaReal(); // não utilizado nesta versão (salão não exibe clima)
    iniciarCarrossel();
    iniciarCarrosseisAuto();
    gerarQRCode();
    iniciarShimmer();
    iniciarParallax();
});

// ================= PARALLAX SUTIL NO FUNDO =================
function iniciarParallax() {
    let ticking = false;
    const raiz = document.documentElement;
    const appScreen = document.querySelector(".app-screen");

    function atualizarParallax() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = appScreen && appScreen.scrollTop > 0 ? appScreen.scrollTop : window.scrollY;
                const offset = scrollY * 0.08;
                raiz.style.setProperty("--parallax-offset", Math.min(offset, 40) + "px");
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener("scroll", atualizarParallax, { passive: true });
    if (appScreen) appScreen.addEventListener("scroll", atualizarParallax, { passive: true });
}

// ================= CLIMA (desativado nesta versão) =================
function carregarClimaReal() { /* clima removido para o cartão do salão */ }

// ================= QR CODE =================
function gerarQRCode() {
    const container = document.getElementById("qrcode-container");
    if (!container || typeof QRCode === "undefined") return;
    try {
        new QRCode(container, {
            text: window.location.href,
            width: 180, height: 180,
            colorDark: "#3E332A", colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    } catch (e) {
        container.innerHTML = '<i class="fas fa-qrcode" style="font-size:160px;color:#3E332A;"></i>';
    }
}

function abrirQrModal() { document.getElementById("page-qr-modal").classList.add("active"); }
function fecharQrModal() { document.getElementById("page-qr-modal").classList.remove("active"); }

// ================= WHATSAPP (ESCOLHA DA PROFISSIONAL) =================
function abrirWhatsModal() { document.getElementById("whats-modal").classList.add("active"); }
function fecharWhatsModal() { document.getElementById("whats-modal").classList.remove("active"); }

// ================= LOCALIZAÇÃO (GOOGLE MAPS / WAZE) =================
function abrirLocalModal() { document.getElementById("local-modal").classList.add("active"); }
function fecharLocalModal() { document.getElementById("local-modal").classList.remove("active"); }

// ================= MENU FIXO DE ATALHOS =================
function irPara(idSecao) {
    const el = document.getElementById(idSecao);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ================= GALERIAS (DADOS) =================
const galeriasFotos = {
    trabalhos: [
        "assets/img/trabalho1.jpg", "assets/img/trabalho2.jpg", "assets/img/trabalho3.jpg",
        "assets/img/trabalho4.jpg", "assets/img/trabalho5.png", "assets/img/foto6.jpg",
        "assets/img/foto7.jpg", "assets/img/foto8.jpg", "assets/img/foto9.jpg",
        "assets/img/foto10.jpg", "assets/img/foto11.jpg",
        "assets/img/trabalho6.jpg", "assets/img/trabalho7.jpg", "assets/img/trabalho8.jpg",
        "assets/img/trabalho9.jpg", "assets/img/trabalho10.jpg", "assets/img/trabalho11.jpg",
        "assets/img/trabalho12.jpg", "assets/img/trabalho13.jpg", "assets/img/trabalho14.jpg",
        "assets/img/trabalho15.jpg", "assets/img/trabalho16.jpg"
    ],
    espaco: [
        "assets/img/foto1.webp", "assets/img/foto2.webp", "assets/img/foto3.webp",
        "assets/img/foto4.webp", "assets/img/foto5.webp"
    ],
    unhas: [
        "assets/img/unha1.jpg", "assets/img/unha2.jpg", "assets/img/unha3.jpg",
        "assets/img/unha4.jpg", "assets/img/unha5.jpg", "assets/img/unha6.jpg"
    ]
};
let galeriaAtual = "trabalhos";
let indiceAtual = 0;

// ================= CARROSSEL AUTOMÁTICO =================
function iniciarCarrosseisAuto() {
    Object.keys(galeriasFotos).forEach(nome => {
        const track = document.getElementById("track-" + nome);
        if (!track) return;
        const originais = Array.from(track.children);
        originais.forEach(img => {
            const clone = img.cloneNode(true);
            clone.setAttribute("aria-hidden", "true");
            track.appendChild(clone);
        });
    });
}

function cliqueCarrossel(evento, nomeGaleria) {
    if (evento.target.tagName === "IMG") {
        const idx = parseInt(evento.target.getAttribute("data-idx"), 10);
        abrirFoto(nomeGaleria, idx);
    }
}

// ================= LIGHTBOX COM SETAS =================
function abrirFoto(nomeGaleria, idx) {
    galeriaAtual = nomeGaleria;
    indiceAtual = idx;
    document.getElementById("foto-modal-img").src = galeriasFotos[galeriaAtual][indiceAtual];
    document.getElementById("foto-modal").classList.add("active");
}
function navegarFoto(direcao) {
    const total = galeriasFotos[galeriaAtual].length;
    indiceAtual = (indiceAtual + direcao + total) % total;
    document.getElementById("foto-modal-img").src = galeriasFotos[galeriaAtual][indiceAtual];
}
function fecharFotoModal() { document.getElementById("foto-modal").classList.remove("active"); }

document.addEventListener("keydown", function(e) {
    if (!document.getElementById("foto-modal").classList.contains("active")) return;
    if (e.key === "ArrowLeft") navegarFoto(-1);
    if (e.key === "ArrowRight") navegarFoto(1);
    if (e.key === "Escape") fecharFotoModal();
});

document.addEventListener("click", function(e) {
    const qrModal = document.getElementById("page-qr-modal");
    const fotoModal = document.getElementById("foto-modal");
    const whatsModal = document.getElementById("whats-modal");
    const localModal = document.getElementById("local-modal");
    if (e.target === qrModal) fecharQrModal();
    if (e.target === fotoModal) fecharFotoModal();
    if (e.target === whatsModal) fecharWhatsModal();
    if (e.target === localModal) fecharLocalModal();
});

// ================= COMPARTILHAMENTO =================
function compartilharSite() {
    if (navigator.share) {
        navigator.share({ title: 'Noemi Stefanoni Hairdresser', text: 'Veja os serviços e contatos!', url: window.location.href })
            .then(() => fecharQrModal()).catch(() => {});
    } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
            mostrarToastGlobal("<i class='fas fa-link'></i> Link copiado!");
            fecharQrModal();
        });
    }
}

// ================= PIX + CONFETTI =================
function copiarPix(botaoElemento, chavePix) {
    navigator.clipboard.writeText(chavePix).then(() => {
        const htmlOriginal = botaoElemento.innerHTML;
        botaoElemento.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;width:100%;gap:10px;color:#2E7D32;font-weight:600;font-size:15px;padding:6px 0;">
                <i class="fas fa-check-circle"></i> Chave PIX Copiada!
            </div>`;
        botaoElemento.style.background = "rgba(232,245,233,0.7)";
        botaoElemento.style.borderColor = "rgba(76,175,80,0.3)";
        dispararConfetti();
        mostrarToastGlobal("<i class='fas fa-check-circle' style='color:#4CAF50;'></i> Chave CNPJ Copiada!");
        setTimeout(() => {
            botaoElemento.innerHTML = htmlOriginal;
            botaoElemento.style.background = "";
            botaoElemento.style.borderColor = "";
        }, 2200);
    }).catch(err => console.error("Erro ao copiar:", err));
}

function dispararConfetti() {
    const colors = ["#B8895A","#E8D5C0","#D4A96A","#8A6238","#F5E6D3","#C4A882","#FFD700"];
    const container = document.querySelector(".app-screen") || document.body;
    const rect = container.getBoundingClientRect();

    for (let i = 0; i < 60; i++) {
        const el = document.createElement("div");
        el.style.cssText = `
            position:fixed;
            left:${rect.left + Math.random() * rect.width}px;
            top:${rect.top + rect.height * 0.5}px;
            width:${6 + Math.random() * 6}px;
            height:${6 + Math.random() * 6}px;
            background:${colors[Math.floor(Math.random() * colors.length)]};
            border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
            pointer-events:none;
            z-index:99999;
            opacity:1;
        `;
        document.body.appendChild(el);
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI;
        const speed = 4 + Math.random() * 8;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        let x = 0, y = 0, vy2 = vy, opacity = 1;
        let frame = 0;
        const animate = () => {
            frame++;
            vy2 += 0.35;
            x += vx;
            y += vy2;
            opacity -= 0.018;
            el.style.transform = `translate(${x}px, ${y}px) rotate(${frame * 8}deg)`;
            el.style.opacity = opacity;
            if (opacity > 0) requestAnimationFrame(animate);
            else el.remove();
        };
        setTimeout(() => requestAnimationFrame(animate), Math.random() * 300);
    }
}

// ================= SHIMMER NOS CARDS =================
function iniciarShimmer() {
    document.querySelectorAll(".card-item, .premium-pix-banner, .cafe-card").forEach(card => {
        card.addEventListener("touchstart", function() {
            this.classList.add("shimmer-active");
        }, { passive: true });
        card.addEventListener("touchend", function() {
            setTimeout(() => this.classList.remove("shimmer-active"), 400);
        }, { passive: true });
    });
}

// ================= ACORDEÃO =================
function toggleAccordion(triggerElement) {
    const container = triggerElement.parentElement;
    const bodyElement = container.querySelector(".accordion-body");
    const isActive = container.classList.contains("active");
    if (isActive) {
        container.classList.remove("active");
        bodyElement.style.maxHeight = null;
    } else {
        container.classList.add("active");
        bodyElement.style.maxHeight = bodyElement.scrollHeight + "px";
    }
}

// ================= CARROSSEL (COM SWIPE) =================
function iniciarCarrossel() {
    const track = document.getElementById("reviews-track");
    const dotsContainer = document.getElementById("review-dots");
    if (!track || !dotsContainer) return;
    const cards = track.querySelectorAll(".review-card");
    const total = cards.length;
    let atual = 0, autoplay, startX = 0, startY = 0, isDragging = false;

    cards.forEach((_, i) => {
        const dot = document.createElement("div");
        dot.className = "review-dot" + (i === 0 ? " active" : "");
        dot.addEventListener("click", () => { irParaSlide(i); resetAutoplay(); });
        dotsContainer.appendChild(dot);
    });

    function irParaSlide(index) {
        atual = (index + total) % total;
        track.style.transform = `translateX(-${atual * 100}%)`;
        dotsContainer.querySelectorAll(".review-dot").forEach((d, i) => d.classList.toggle("active", i === atual));
    }

    function resetAutoplay() { clearInterval(autoplay); autoplay = setInterval(() => irParaSlide(atual + 1), 4200); }

    // Touch swipe
    track.addEventListener("touchstart", e => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
        clearInterval(autoplay);
    }, { passive: true });

    track.addEventListener("touchend", e => {
        if (!isDragging) return;
        const dx = startX - e.changedTouches[0].clientX;
        const dy = startY - e.changedTouches[0].clientY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 35) {
            irParaSlide(dx > 0 ? atual + 1 : atual - 1);
        }
        isDragging = false;
        resetAutoplay();
    }, { passive: true });

    // Mouse drag (desktop)
    track.addEventListener("mousedown", e => { startX = e.clientX; isDragging = true; clearInterval(autoplay); });
    track.addEventListener("mouseup", e => {
        if (!isDragging) return;
        const dx = startX - e.clientX;
        if (Math.abs(dx) > 35) irParaSlide(dx > 0 ? atual + 1 : atual - 1);
        isDragging = false;
        resetAutoplay();
    });

    resetAutoplay();
}

// ================= TOAST GLOBAL =================
function mostrarToastGlobal(conteudoHTML) {
    const toast = document.getElementById("copy-toast");
    toast.innerHTML = conteudoHTML;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2800);
}
