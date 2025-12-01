// URLs das imagens dos personagens do Clash Royale
// Substitua estas URLs pelas suas próprias imagens de alta qualidade
const cardImages = [
    { name: 'Cavaleiro', img: './img/images.jpg' },
    { name: 'Gigante', img: './img/gigante.png' },
    { name: 'P.E.K.K.A', img: './img/Pekka.jpg' },
    { name: 'Flechas', img: './img/flechas.png' },
    { name: 'Cabana de Goblins', img: './img/Cabana.jpg' },
    { name: 'Princesa', img: './img/princesa.jpg' },
    // Adicione mais personagens para os níveis Médio e Difícil
    { name: 'Corredor', img: './img/Corredor.jpg' },
    { name: 'Exército de Esqueletos', img: './img/esqueletos.jpg' },
    { name: 'Goblins com Lança', img: './img/Goblin.jpg' },
    { name: 'Mago Elétrico', img: './img/Mago elétrico.png' },
    { name: 'Lava Hound', img: './img/lava.png' },
    { name: 'Mini P.E.K.K.A', img: './img/Mini.png' },
    { name: 'Dragão Infernal', img: './img/Dragão infernal.jpg' },
    { name: 'Bandida', img: './img/bandida.png' },
    { name: 'Lenhador', img: './img/Lenhador.png' },
    { name: 'Espírito de Gelo', img: './img/gelo.jpg' },
    { name: 'Esqueletos', img: './img/E.png' },
    { name: 'Morcegos', img: './img/morcegos.png' }
];

let gameCards = [];
let flippedCards = [];
let matchesFound = 0;
let lockBoard = false;

const board = document.getElementById('game-board');
const messageDisplay = document.getElementById('message');

/**
 * Embaralha um array
 */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Inicia o jogo para o nível especificado
 * @param {number} numPairs - Número de pares de cartas (6, 10 ou 18)
 * @param {string} boardClass - Classe CSS para o layout da grade (board-facil, board-medio, board-dificil)
 */
function startGame(numPairs, boardClass) {
    matchesFound = 0;
    flippedCards = [];
    lockBoard = false;
    board.innerHTML = '';
    messageDisplay.textContent = 'Encontre os pares!';
    board.className = ''; 
    board.classList.add(boardClass); 

    // 1. Seleciona e duplica as cartas
    const selectedCards = cardImages.slice(0, numPairs);
    gameCards = [...selectedCards, ...selectedCards];
    shuffle(gameCards);

    // 2. Desenha o tabuleiro
    gameCards.forEach((cardData, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.name = cardData.name; 
        cardElement.dataset.index = index; 

        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-back"></div>
                <div class="card-face card-front">
                    <img src="${cardData.img}" alt="${cardData.name}">
                </div>
            </div>
        `;

        cardElement.addEventListener('click', () => flipCard(cardElement));
        board.appendChild(cardElement);
    });
}

function flipCard(card) {
    // Se o tabuleiro estiver travado, carta já encontrada, ou já virada, ignora o clique
    if (lockBoard || card.classList.contains('matched') || card.classList.contains('flipped')) {
        return;
    }

    // Virar a carta
    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        lockBoard = true; 
        checkForMatch();
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    // Checa se os nomes das cartas são iguais
    const isMatch = card1.dataset.name === card2.dataset.name;

    if (isMatch) {
        // 🎉 ACERTO: Mantém a carta virada e aplica o estilo 'matched'
        messageDisplay.textContent = '🥳 Acerto! Próximo par...';
        disableCards(card1, card2);
    } else {
        // 🙁 ERRO: Vira as cartas de volta
        messageDisplay.textContent = '😬 Erro! Tente novamente.';
        unflipCards();
    }
}

/**
 * Função que garante que as cartas acertadas permaneçam viradas.
 */
function disableCards(card1, card2) {
    // A classe 'flipped' permanece, e adicionamos 'matched' para o estilo e inatividade.
    card1.classList.add('flipped');
    card2.classList.add('flipped');
    card1.classList.add('rotateY(180deg)');
    card2.classList.add('rotateY(180deg)');
    

    matchesFound++;
    lockBoard = false;
    flippedCards = []; 

    if (matchesFound === gameCards.length / 2) {
        messageDisplay.textContent = '🏆 VITÓRIA! Você encontrou todos os pares!';
    }
}

/**
 * Função que desvira as cartas após um erro.
 */
function unflipCards() {
    setTimeout(() => {
        flippedCards.forEach(card => {
            // Remove 'flipped' APENAS se não foi acertada (o que é garantido pela lógica do checkForMatch,
            // mas é um bom passo de segurança).
            card.classList.remove('flipped');
        });
        lockBoard = false;
        flippedCards = [];
        messageDisplay.textContent = 'Encontre os pares!';
    }, 1200); // 1.2 segundos para ver o erro e a carta desvirar.
}

// Inicia o jogo ao carregar a página (Nível Fácil por padrão)
document.addEventListener('DOMContentLoaded', () => {
    // Inicia o jogo no nível fácil (6 pares)
    startGame(6, 'board-facil');
});