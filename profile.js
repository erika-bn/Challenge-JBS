// ===== Avatar (preview + compress + persist) =====
const fileInput = document.getElementById('avatarInput');
const img       = document.getElementById('avatarPreview');
const removeBtn = document.getElementById('removeAvatarBtn');
const LS_KEY    = 'avatarDataUrl';
const PLACEHOLDER = './assets/img/user-placeholder.png';

// carrega se já tiver salvo
const saved = localStorage.getItem(LS_KEY);
img.src = saved || PLACEHOLDER;

// clique no avatar também abre o seletor
img.addEventListener('click', () => fileInput?.click());

fileInput?.addEventListener('change', async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // validações básicas
  const allowed = ['image/jpeg','image/png','image/webp','image/jpg','image/heic','image/heif'];
  if (!allowed.includes(file.type) && !file.type.startsWith('image/')) {
    alert('Escolha uma imagem (jpg, png ou webp).');
    return;
  }
  if (file.size > 5 * 1024 * 1024) { // 5MB
    alert('Arquivo muito grande. Escolha uma imagem até 5MB.');
    return;
  }

  try {
    // reduz e corta para quadrado (ex.: 256px)
    const dataUrl = await resizeAndCropToSquare(file, 256);
    img.src = dataUrl;
    localStorage.setItem(LS_KEY, dataUrl);
  } catch (err) {
    console.error(err);
    alert('Não foi possível processar a imagem.');
  } finally {
    fileInput.value = ''; // permite reenviar o mesmo arquivo depois
  }
});

// remover foto
removeBtn?.addEventListener('click', () => {
  localStorage.removeItem(LS_KEY);
  img.src = PLACEHOLDER;
});

// ===== Helpers =====
function loadImage(fileOrUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = reject;
    if (fileOrUrl instanceof File) {
      const url = URL.createObjectURL(fileOrUrl);
      img.src = url;
      img.onloadend = () => URL.revokeObjectURL(url);
    } else {
      img.src = fileOrUrl;
    }
  });
}

/**
 * Redimensiona mantendo cover e corta para quadrado, depois exporta como WEBP (fallback JPEG).
 * @param {File} file - arquivo de imagem
 * @param {number} size - tamanho final (ex.: 256)
 * @returns {Promise<string>} dataURL
 */
async function resizeAndCropToSquare(file, size = 256) {
  const image = await loadImage(file);

  // define o menor lado para garantir crop quadrado
  const srcSize = Math.min(image.naturalWidth || image.width, image.naturalHeight || image.height);
  const sx = ((image.naturalWidth || image.width)  - srcSize) / 2;
  const sy = ((image.naturalHeight || image.height) - srcSize) / 2;

  // desenha em canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = size;
  canvas.height = size;
  // desenha quadrado centralizado com cover
  ctx.drawImage(image, sx, sy, srcSize, srcSize, 0, 0, size, size);

  // tenta WEBP (economiza espaço), senão JPEG
  let dataUrl = '';
  try {
    dataUrl = canvas.toDataURL('image/webp', 0.9);
    if (!dataUrl.startsWith('data:image/webp')) throw new Error('webp not supported');
  } catch {
    dataUrl = canvas.toDataURL('image/jpeg', 0.9);
  }
  return dataUrl;
}

// ===== Campos editáveis (se quiser manter por enquanto) =====
window.editEmail = () => {
  const current = document.getElementById('email').value;
  const novo = prompt('Informe seu e-mail:', current);
  if (!novo) return;
  document.getElementById('email').value = novo;
};

window.editCel = () => {
  const current = document.getElementById('cel').value;
  const novo = prompt('Informe seu celular:', current);
  if (!novo) return;
  document.getElementById('cel').value = novo;
};

window.changePassword = () => {
  alert('Aqui você pode abrir um modal para troca de senha.');
};
