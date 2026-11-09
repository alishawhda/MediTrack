/* Page chrome, auth guard and Bootstrap behaviour shared by signed-in pages. */
import 'bootstrap';
import { getUser, signOut } from './auth.js';
import { renderFooter, renderNavbar } from './ui.js';

function defaultNavigate(url) {
  globalThis.location.assign(url);
}

/**
 * Render the navbar/footer and enforce the session guard.
 * Returns false when the visitor has no session and a redirect was started.
 */
export function initShell({ doc = document, storage, navigate = defaultNavigate } = {}) {
  const page = doc.body?.dataset?.page;
  if (!page || page === 'login') return true;

  const user = getUser(storage);
  if (!user) {
    navigate('index.html');
    return false;
  }

  const navbar = doc.getElementById('navbar');
  const footer = doc.getElementById('footer');

  if (navbar) {
    renderNavbar(navbar, {
      page,
      user,
      onLogout: () => {
        signOut(storage);
        navigate('index.html');
      },
    });
  }
  if (footer) renderFooter(footer);

  return true;
}
