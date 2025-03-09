let comparaImagens = [];
let imagensCertas = [];
let contagemTentativas = 1;
let contagemAcertos = 1;
let blocos = [];
let bloqueiaCliques = false; // Flag para bloquear cliques extras

function inicializa() {
    comparaImagens = [];
    imagensCertas = [];
    contagemTentativas = 1;
    contagemAcertos = 1;
    blocos = [
        'img1.jpg', 'img1.jpg',
        'img2.jpg', 'img2.jpg',
        'img3.jpg', 'img3.jpg',
        'img4.jpg', 'img4.jpg',
        'img5.jpg', 'img5.jpg',
        'img6.jpg', 'img6.jpg',
        'img7.jpg', 'img7.jpg',
        'img8.jpg', 'img8.jpg',
        'img9.jpg', 'img9.jpg',
        'img10.jpg', 'img10.jpg'
    ];
}
// Função para embaralhar um array (algoritmo Fisher-Yates)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Troca os elementos
    }
}
function zeraTudo() {
    document.getElementById('recomecar').setAttribute('disabled', 'disabled');
    document.getElementById('recomecar').classList.add('disabled');
    document.getElementById('mensagem').innerHTML = '';
    document.getElementById('tentativas').value = '';
    document.getElementById('acertos').value = '';
}
// Função para criar os cards na tela
function inicio() {
    inicializa();
    zeraTudo();
    shuffle(blocos);
    const main = document.getElementById('main');
    main.innerHTML = ""; // Limpa a área antes de criar novos elementos
    blocos.forEach(bloco => {
        const makeBloco = document.createElement('div');
        makeBloco.classList.add("blocks");
        const makeImg = document.createElement('img');
        makeImg.src = `imgs/${bloco}`;
        makeImg.classList.add("card-img");
        makeImg.setAttribute("data-original", makeImg.src); // Armazena a imagem original
        makeBloco.appendChild(makeImg);
        main.appendChild(makeBloco);
    });
    // Ocultar as imagens após 5 segundos
    setTimeout(ocultarImagens, 5000);
}
// Função para substituir todas as imagens por "back.jpg"
function ocultarImagens() {
    document.querySelectorAll(".card-img").forEach(img => {
        const originalSrc = img.getAttribute("data-original");
        // Se a imagem NÃO estiver na lista de acertos, então ocultamos
        if (!imagensCertas.some(item => item.src === originalSrc)) {
            img.src = "imgs/back.jpg";
            img.setAttribute("data-revealed", "false");
            bloqueiaCliques = false;
        }
    });
}
function showHideMensages(msg) {
    document.getElementById('mensagem').innerHTML = msg;
    setTimeout(() => {
        document.getElementById('mensagem').innerHTML = '';
    }, 2000);
}
/**
 * Desativa os cliques nos cards.
 */
function disableClicks() {
    setTimeout(() => {
        document.querySelectorAll('.blocks').forEach((x) => {
            x.style.pointerEvents = 'none';
        })
    }, 1000);
}
/**
 * Ativa os cliques nos cards.
 */
function enableClicks() {
    setTimeout(() => {
        document.querySelectorAll('.blocks').forEach((x) => {
             x.style.pointerEvents = 'auto';
         });
    }, 1000);
}
// Evento de clique para revelar a imagem original e comparar
document.addEventListener('click', (event) => {
    if ( bloqueiaCliques ) {
        return; // Impede mais cliques quando já há 2
    } 
    if (event.target.classList.contains("card-img")) {
        const img = event.target;
        const originalSrc = img.getAttribute("data-original");
        if (img.getAttribute("data-revealed") === "true") return;
        // Revela a imagem original
        img.src = originalSrc;
        img.setAttribute("data-revealed", "true");
        // Adiciona a imagem clicada ao array de comparação
        comparaImagens.push({ imgElement: img, src: originalSrc });
        // Se já houver duas imagens no array, faz a comparação
        if (comparaImagens.length == 2) {
            bloqueiaCliques = true; // Bloqueia cliques até a verificação
            if (comparaImagens[0].src == comparaImagens[1].src) {
                if ( parseInt(imagensCertas.length) == 9 ) {
                    document.getElementById('recomecar').removeAttribute('disabled');
                    document.getElementById('recomecar').classList.remove('disabled');
                    document.getElementById('mensagem').innerHTML = 'Grande Vencedor!!';
                } else {
                    showHideMensages('Ótimo!, você acertou!');
                    document.getElementById('acertos').value = (contagemAcertos);
                    imagensCertas.push({ imgElement: img, src: originalSrc });
                    contagemAcertos++;
                    bloqueiaCliques = false;
                }
            } else {
                showHideMensages('Não são iguais..');
                //problema - apaga inclusive os corretos
                setTimeout(ocultarImagens, 2000);
            }
            document.getElementById('tentativas').value = parseInt(contagemTentativas / 2);
            // Limpa o array para a próxima comparação
            comparaImagens = [];
        } else {
            bloqueiaCliques = false; // Libera os cliques novamente
        }
        contagemTentativas++;
    }
});
inicio();