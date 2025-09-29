// assets/js/auth.js
function enableBootstrapValidation() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        const email = form.email.value.trim();
        const senha = form.senha.value.trim();

        if (senha.length < 6) {
            form.classList.add('was-validated');
            return;
        }

        const payload = { email, ts: Date.now() };
        localStorage.setItem('auth', JSON.stringify(payload));

        // Redireciona para a página principal (home) após autenticação
        window.location.href = './pages/home.html';
    });
}

document.addEventListener('DOMContentLoaded', enableBootstrapValidation);

// Função para verificar autenticação e redirecionar se necessário
export function requireAuth() {
    const auth = localStorage.getItem('auth');
    if (!auth) {
        window.location.href = '../index.html';
        return false;
    }
    return true;
}

