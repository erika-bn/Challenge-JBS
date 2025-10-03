// ranking.js
// carrega avatar salvo em localStorage (avatarDataUrl) e substitui o avatar do 1º lugar
(function () {
    try {
        const dataUrl = localStorage.getItem('avatarDataUrl');
        if (!dataUrl) return;
        // aguarda DOM
        document.addEventListener('DOMContentLoaded', function () {
            const first = document.getElementById('firstAvatar');
            if (first) {
                first.src = dataUrl;
            }
        });
    } catch (e) {
        console.error('ranking.js error', e);
    }
})();
