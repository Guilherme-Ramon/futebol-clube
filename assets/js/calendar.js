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
