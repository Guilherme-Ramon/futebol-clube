/* ========================
   ELEMENTOS GERAIS
======================== */
const links = document.querySelectorAll("#menu .nav-link");
const menu = document.getElementById("menu");
const btnTopo = document.getElementById("btnTopo");
const seletor = document.getElementById("seletorMapa");
const iframe = document.getElementById("iframeMapa");

/* ========================
   FUNÇÃO MODAL DE IMAGENS
======================== */
function abrirModal(src) {
    document.getElementById("imgModal").src = src;
    var modal = new bootstrap.Modal(document.getElementById("modalImagem"));
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
            if (filter === "all") {
                item.style.display = "block";
            } else {
                item.style.display = item.classList.contains(filter)
                    ? "block"
                    : "none";
            }
        });
    });
});

/* ========================
   BOTÃO VOLTAR AO TOPO
======================== */
// Inicialmente escondido
btnTopo.style.opacity = 0;
btnTopo.style.pointerEvents = "none";

// Mostra ou esconde ao rolar
window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
        btnTopo.style.opacity = 1;
        btnTopo.style.pointerEvents = "auto";
    } else {
        btnTopo.style.opacity = 0;
        btnTopo.style.pointerEvents = "none";
    }
});

// Scroll suave ao clicar
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

window.addEventListener("load", function () {
    // Medir tempo real de carregamento
    const timing = window.performance.timing;
    const carregamentoTotal = timing.loadEventEnd - timing.navigationStart;

    // Definir tempo mínimo e máximo de loading
    const minimo = 1000; // 1s
    const maximo = 4000; // 4s
    const tempoLoading = Math.min(Math.max(carregamentoTotal, minimo), maximo);

    setTimeout(function () {
        const loading = document.getElementById("loading");
        if (loading) {
            // Fade-out suave
            loading.style.transition = "opacity 0.5s";
            loading.style.opacity = 0;
            setTimeout(() => {
                loading.style.display = "none";
                document.body.classList.remove("loading"); // libera scroll
            }, 500);
        }
    }, tempoLoading);
});
