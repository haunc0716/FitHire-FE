const GOOGLE_SCRIPT_ID = 'google-identity-service-script';
const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

function getGoogleIdentityApi() {
  return window.google?.accounts?.id;
}

export function loadGoogleIdentityScript() {
  const existingApi = getGoogleIdentityApi();
  if (existingApi) {
    return Promise.resolve(existingApi);
  }

  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        const api = getGoogleIdentityApi();
        if (!api) {
          reject(new Error('Không thể khởi tạo Google Identity API.'));
          return;
        }
        resolve(api);
      });
      existingScript.addEventListener('error', () => {
        reject(new Error('Không tải được Google Sign-In script.'));
      });
      return;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_SCRIPT_ID;
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const api = getGoogleIdentityApi();
      if (!api) {
        reject(new Error('Không thể khởi tạo Google Identity API.'));
        return;
      }
      resolve(api);
    };
    script.onerror = () => reject(new Error('Không tải được Google Sign-In script.'));
    document.head.appendChild(script);
  });
}

export function renderGoogleSignInButton({
  api,
  containerElement,
  clientId,
  onCredential,
}) {
  if (!api) {
    throw new Error('Google Identity API chưa sẵn sàng.');
  }
  if (!containerElement) {
    throw new Error('Thiếu vùng hiển thị nút đăng nhập Google.');
  }
  if (!clientId) {
    throw new Error('Thiếu VITE_GOOGLE_CLIENT_ID.');
  }

  api.initialize({
    client_id: clientId,
    callback: onCredential,
    auto_select: false,
    cancel_on_tap_outside: true,
  });

  containerElement.innerHTML = '';
  const width = Math.min(Math.max(containerElement.offsetWidth || 320, 240), 400);

  api.renderButton(containerElement, {
    theme: 'outline',
    size: 'large',
    shape: 'pill',
    text: 'continue_with',
    width,
    locale: 'vi',
  });
}

export function cancelGoogleOneTap() {
  const api = getGoogleIdentityApi();
  api?.cancel?.();
}
