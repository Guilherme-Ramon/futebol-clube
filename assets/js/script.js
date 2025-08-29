/* ========================
   ELEMENTOS GERAIS
======================== */
const links = document.querySelectorAll("#menu .nav-link");
const menu = document.getElementById("menu");
const btnTopo = document.getElementById("btnTopo");
const seletor = document.getElementById("seletorMapa");
const iframe = document.getElementById("iframeMapa");
const loading = document.getElementById("loading");

/* ========================
   FUNÇÃO MODAL DE IMAGENS
======================== */
function abrirModal(src) {
    const img = document.getElementById("imgModal");
    const modalEl = document.getElementById("modalImagem");

    if (!img || !modalEl) {
        console.error("Modal ou imagem não encontrados!");
        return;
    }

    img.src = src; // troca a imagem do modal
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
}

/* ========================
   FILTRAGEM POR MODALIDADE
======================== */
const filterButtons = document.querySelectorAll(".filter-btn");
const galleryItems = document.querySelectorAll(".gallery-item");

filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter");
        galleryItems.forEach((item) => {
            item.style.display =
                filter === "all" || item.classList.contains(filter)
                    ? "block"
                    : "none";
        });
    });
});

/* ========================
   BOTÃO VOLTAR AO TOPO
======================== */
btnTopo.style.opacity = 0;
btnTopo.style.pointerEvents = "none";

window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
        btnTopo.style.opacity = 1;
        btnTopo.style.pointerEvents = "auto";
    } else {
        btnTopo.style.opacity = 0;
        btnTopo.style.pointerEvents = "none";
    }
});

btnTopo.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ========================
   FECHAR MENU MOBILE AO CLICAR
======================== */
links.forEach((link) => {
    link.addEventListener("click", () => {
        if (menu.classList.contains("show")) {
            new bootstrap.Collapse(menu).toggle();
        }
    });
});

/* ========================
   TROCA DE MAPA NO DROPDOWN
======================== */
if (seletor && iframe) {
    seletor.addEventListener("change", () => {
        iframe.src = seletor.value;
    });
}

/* ========================
   LOADING DA PÁGINA
======================== */
document.body.classList.add("loading"); // bloqueia scroll

window.addEventListener("load", () => {
    const timing = window.performance.timing;
    const carregamentoTotal = timing.loadEventEnd - timing.navigationStart;
    const minimo = 1000;
    const maximo = 4000;
    const tempoLoading = Math.min(Math.max(carregamentoTotal, minimo), maximo);

    setTimeout(() => {
        if (loading) {
            loading.style.transition = "opacity 0.5s";
            loading.style.opacity = 0;
            setTimeout(() => {
                loading.style.display = "none";
                document.body.classList.remove("loading");
                window.scrollTo({ top: 0, behavior: "smooth" });
            }, 500);
        }
    }, tempoLoading);
});

document.getElementById("ano").textContent = new Date().getFullYear();

/* ========================
   PAINEL DE ACESSIBILIDADE
======================== */
(() => {
    "use strict";

    const DEFAULT_BASE = 16;
    const fonteMin = 12;
    const fonteMax = 28;
    let tamanhoFonte =
        parseInt(localStorage.getItem("fontSize"), 10) || DEFAULT_BASE;

    const painel = document.getElementById("painelAcessibilidade");
    const btnToggleAcess = document.getElementById("btnToggleAcessibilidade");
    const btnAumentar = document.getElementById("btnAumentarFonte");
    const btnDiminuir = document.getElementById("btnDiminuirFonte");
    const btnFontePadrao = document.getElementById("btnFontePadrao");
    const btnAltoContraste = document.getElementById("btnAltoContraste");
    const btnRemoverPainel = document.getElementById("btnRemoverPainel");
    const toggleButton = document.getElementById("themeToggle");

    const body = document.body;
    const navbar = document.querySelector(".navbar");
    const footer = document.querySelector("footer");
    const sections = document.querySelectorAll(
        "section:not(#painelAcessibilidade)"
    );

    const on = (el, evt, fn) => {
        if (el) el.addEventListener(evt, fn);
    };

    function storeOriginalSizes(root = document.body) {
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_ELEMENT,
            {
                acceptNode(node) {
                    const tag = node.tagName.toLowerCase();
                    if (tag === "script" || tag === "style")
                        return NodeFilter.FILTER_REJECT;
                    if (node.id === "painelAcessibilidade")
                        return NodeFilter.FILTER_REJECT;
                    if (
                        node.classList &&
                        node.classList.contains("material-icons")
                    )
                        return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                },
            },
            false
        );

        let node;
        while ((node = walker.nextNode())) {
            if (!node.dataset.originalFontSize) {
                const val =
                    parseFloat(window.getComputedStyle(node).fontSize) ||
                    DEFAULT_BASE;
                node.dataset.originalFontSize = String(val);
            }
        }

        [btnToggleAcess, btnTopo].forEach((btn) => {
            if (btn && !btn.dataset.originalFontSize) {
                const val =
                    parseFloat(window.getComputedStyle(btn).fontSize) ||
                    DEFAULT_BASE;
                btn.dataset.originalFontSize = String(val);
            }
        });
    }

    storeOriginalSizes();

    const mo = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
            m.addedNodes.forEach((n) => {
                if (n.nodeType === Node.ELEMENT_NODE) storeOriginalSizes(n);
            });
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    function aplicarFonte() {
        const scale = tamanhoFonte / DEFAULT_BASE;
        document.querySelectorAll("[data-original-font-size]").forEach((el) => {
            const orig =
                parseFloat(el.dataset.originalFontSize) || DEFAULT_BASE;
            el.style.fontSize =
                Math.max(fonteMin, Math.min(fonteMax * 2, orig * scale)) + "px";
        });

        [btnToggleAcess, btnTopo].forEach((btn) => {
            if (btn) {
                const origSize = parseFloat(btn.dataset.originalFontSize);
                const newSize = Math.max(
                    fonteMin,
                    Math.min(fonteMax * 2, origSize * scale)
                );
                btn.style.fontSize = newSize + "px";
                btn.style.width = newSize * 2 + "px";
                btn.style.height = newSize * 2 + "px";
            }
        });

        localStorage.setItem("fontSize", String(tamanhoFonte));
    }

    function resetFontePadrao() {
        tamanhoFonte = DEFAULT_BASE;
        aplicarFonte();
        body.classList.remove("alto-contraste");
        localStorage.removeItem("fontSize");
        localStorage.removeItem("altoContraste");
    }

    function abrirPainel() {
        if (!painel) return;
        painel.style.display = "block";
        painel.setAttribute("aria-hidden", "false");
        const primeira = painel.querySelector("button, [tabindex], input, a");
        if (primeira) primeira.focus();
    }
    function fecharPainel() {
        if (!painel) return;
        painel.style.display = "none";
        painel.setAttribute("aria-hidden", "true");
        if (btnToggleAcess) btnToggleAcess.focus();
    }

    on(btnToggleAcess, "click", (e) => {
        e.stopPropagation();
        painel &&
            (painel.style.display === "block" ? fecharPainel() : abrirPainel());
    });
    document.addEventListener("click", (e) => {
        if (
            painel &&
            painel.style.display === "block" &&
            !painel.contains(e.target) &&
            e.target !== btnToggleAcess
        )
            fecharPainel();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && painel && painel.style.display === "block")
            fecharPainel();
    });

    on(btnRemoverPainel, "click", () => {
        const menu = document.getElementById("menuAcessibilidade");
        if (menu) menu.style.display = "none";
    });
    on(btnAumentar, "click", () => {
        if (tamanhoFonte < fonteMax) {
            tamanhoFonte += 2;
            aplicarFonte();
        }
    });
    on(btnDiminuir, "click", () => {
        if (tamanhoFonte > fonteMin) {
            tamanhoFonte -= 2;
            aplicarFonte();
        }
    });
    on(btnFontePadrao, "click", resetFontePadrao);
    on(btnAltoContraste, "click", () => {
        body.classList.toggle("alto-contraste");
        localStorage.setItem(
            "altoContraste",
            body.classList.contains("alto-contraste") ? "1" : "0"
        );
    });

    function setTheme(theme) {
        const isDark = theme === "dark";
        const carouselButtons = document.querySelectorAll(
            ".carousel-control-prev, .carousel-control-next"
        );
        [body, navbar, footer, painel, loading, ...sections].forEach((el) => {
            if (el)
                el &&
                    (isDark
                        ? el.classList.add("dark-mode")
                        : el.classList.remove("dark-mode"));
        });
        carouselButtons.forEach((btn) => {
            isDark
                ? btn.classList.add("dark-mode")
                : btn.classList.remove("dark-mode");
        });
        if (toggleButton) toggleButton.textContent = isDark ? "☀️" : "🌙";
        localStorage.setItem("theme", theme);
    }
    on(toggleButton, "click", () =>
        setTheme(body.classList.contains("dark-mode") ? "light" : "dark")
    );

    (function init() {
        storeOriginalSizes();
        aplicarFonte();
        if (localStorage.getItem("altoContraste") === "1")
            body.classList.add("alto-contraste");
        setTheme(localStorage.getItem("theme") || "light");
        if (painel)
            painel.setAttribute(
                "aria-hidden",
                painel.style.display === "block" ? "false" : "true"
            );
    })();
})();

/* ========================
   FILTRO DE TREINOS
======================== */
const filtroEsporte = document.getElementById("filtroEsporte");
const filtroSub = document.getElementById("filtroSub");
const cards = document.querySelectorAll(".treino-card");

function filtrarCards() {
    const esporteSelecionado = filtroEsporte.value;
    const subSelecionado = filtroSub.value;

    cards.forEach((card) => {
        let linhas = card.querySelectorAll("tbody tr");
        let mostrarCard = false;

        linhas.forEach((linha) => {
            const esporte = linha.dataset.esporte;
            const sub = linha.dataset.sub;
            const mostrarLinha =
                (esporteSelecionado === "all" ||
                    esporteSelecionado === esporte) &&
                (subSelecionado === "all" || subSelecionado === sub);
            linha.style.display = mostrarLinha ? "" : "none";
            if (mostrarLinha) mostrarCard = true;
        });

        card.style.display = mostrarCard ? "" : "none";
    });
}

filtroEsporte.addEventListener("change", filtrarCards);
filtroSub.addEventListener("change", filtrarCards);

const animItems = document.querySelectorAll(".anim-left, .anim-right");

const animOnScroll = () => {
    animItems.forEach((item) => {
        const itemTop = item.getBoundingClientRect().top;
        const triggerPoint = window.innerHeight * 0.85;

        if (itemTop < triggerPoint) {
            item.classList.add("active");
        }
    });
};

window.addEventListener("scroll", animOnScroll);
window.addEventListener("load", animOnScroll);

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker.register("./sw.js").then(
            function (registration) {
                console.log(
                    "Service Worker registrado com sucesso:",
                    registration.scope
                );
            },
            function (err) {
                console.log("Falha ao registrar o Service Worker:", err);
            }
        );
    });
}
