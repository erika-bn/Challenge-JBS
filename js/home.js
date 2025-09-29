// /assets/js/dashboard.js
import { dashboardData } from '../js/mocks/homeData.js';

(function init() {
    // Progresso Quiz
    const percent = dashboardData.quiz.progresso ?? 0;
    const bar = document.getElementById('quizBar');
    const label = document.getElementById('quizPercent');
    if (bar && label) {
        requestAnimationFrame(() => {
            bar.style.width = percent + '%';
            label.textContent = percent + '%';
            bar.setAttribute('aria-valuenow', String(percent));
            bar.setAttribute('aria-valuemin', '0');
            bar.setAttribute('aria-valuemax', '100');
        });
    }

    // SWP
    const swp = document.getElementById('swpPoints');
    if (swp) swp.textContent = String(dashboardData.swp);

    // Rank
    const rankBadge = document.getElementById('myRank');
    const ul = document.getElementById('rankList');
    if (rankBadge) rankBadge.textContent = String(dashboardData.rank.minhaPosicao);
    if (ul) {
        ul.innerHTML = '';
        dashboardData.rank.lista.forEach((item) => {
            const li = document.createElement('li');
            const avatarSrc = item.avatar ? `../assets/img/${item.avatar}` : '';
            li.innerHTML = `
                <img src="${avatarSrc}" alt="${item.nome} avatar" class="me-2 rounded-circle align-middle" width="28" height="28">
                <span class="align-middle">${item.nome}</span>
            `;
            ul.appendChild(li);
        });
    }

    // Streak
    const streak = document.getElementById('streakDays');
    if (streak) streak.textContent = String(dashboardData.streak);

    // Missão
    const mission = document.getElementById('missionText');
    if (mission) mission.textContent = dashboardData.missao;
})();
