const flashcard = document.getElementById('flashcard');
const backCard = document.getElementById('backCard');
const cardImage = document.getElementById('cardImage');
const cardQuestion = document.getElementById('cardQuestion');
const cardAnswers = document.getElementById('cardAnswers');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

let isDragging = false;
let startX = 0;
let currentX = 0;
let cardsIndex = 0;

// deck de exemplo 
const deck = [
  { imgText: 'Imagem 1', question: 'Qual é a cor do céu?', answers: ['A', 'B', 'C', 'D'] },
  { imgText: 'Imagem 2', question: 'Quantos pés tem um cachorro?', answers: ['A', 'B', 'C', 'D'] },
  { imgText: 'Imagem 3', question: 'Quem descobriu o Brasil?', answers: ['A', 'B', 'C', 'D'] },
  { imgText: 'Imagem 4', question: 'Qual é 2 + 2?', answers: ['A', 'B', 'C', 'D'] }
];

function loadCard(idx){
  const card = deck[idx % deck.length];
  cardImage.textContent = card.imgText;
  cardQuestion.textContent = card.question;

  // atualiza os botões de resposta
  const buttons = cardAnswers.querySelectorAll('.answer-btn');
  buttons.forEach((b, i) => {
    b.textContent = card.answers[i] || ['A','B','C','D'][i];
  });

  // atualiza progresso
  const pct = Math.round(((idx % deck.length)+1) / deck.length * 100);
  progressBar.style.width = pct + '%';
  progressText.textContent = pct + '%';
}

// inicializa
loadCard(cardsIndex);

// pointer events para drag 
flashcard.addEventListener('pointerdown', (e) => {
  isDragging = true;
  startX = e.clientX;
  flashcard.setPointerCapture(e.pointerId);
  flashcard.style.transition = 'none';
});

flashcard.addEventListener('pointermove', (e) => {
  if(!isDragging) return;
  currentX = e.clientX - startX;
  const rotate = currentX / 18; 
  flashcard.style.transform = `translateX(${currentX}px) rotate(${rotate}deg)`;
});

function releaseCard(direction = null){
  isDragging = false;
  flashcard.style.transition = 'transform 300ms ease, opacity 300ms ease';

  // Se arrastou o suficiente - considera "jogado fora"
  if(Math.abs(currentX) > 140 || direction){
    const outToRight = (direction === 'right') || currentX > 0;
    const endX = outToRight ? window.innerWidth : -window.innerWidth;
    const rotate = outToRight ? 30 : -30;
    flashcard.style.transform = `translateX(${endX}px) rotate(${rotate}deg)`;
    flashcard.style.opacity = '0';

    // animação para o "back card" ficar visível levemente antes da troca
    backCard.style.opacity = '1';

    setTimeout(() => {
      // atualizar índice e recarregar conteúdo
      cardsIndex++;
      loadCard(cardsIndex);

      // reset visual do card (volta ao centro)
      flashcard.style.transition = 'none';
      flashcard.style.transform = `translateX(0) rotate(0)`;
      flashcard.style.opacity = '1';

      // efeito breve de pilha
      backCard.style.opacity = '0';
      currentX = 0;
    }, 260);
  } else {
    // volta para o centro
    flashcard.style.transform = 'translateX(0) rotate(0)';
    currentX = 0;
  }
}

// finalizar arrasto
flashcard.addEventListener('pointerup', (e) => {
  releaseCard();
  try{ flashcard.releasePointerCapture(e.pointerId); }catch(e){}
});
flashcard.addEventListener('pointercancel', (e) => {
  releaseCard();
  try{ flashcard.releasePointerCapture(e.pointerId); }catch(e){}
});


document.getElementById('prevBtn').addEventListener('click', () => {
  // joga para a esquerda e mostra anterior
  cardsIndex = Math.max(0, cardsIndex-1);
  // animação: manda o card para a esquerda e traz o novo
  releaseCard('left');
});
document.getElementById('nextBtn').addEventListener('click', () => {
  releaseCard('right');
});

// exemplo: clicar em alternativa
cardAnswers.addEventListener('click', (e) => {
  const btn = e.target.closest('.answer-btn');
  if(!btn) return;
  // animação rápida de feedback
  btn.animate([{ transform: 'scale(1)' }, { transform: 'scale(0.9)' }, { transform: 'scale(1)' }], { duration: 150 });
  
});
