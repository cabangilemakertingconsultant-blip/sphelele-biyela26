// ============================================================
// CABANGILE MARKETING CONSULTANT HUB — AUTH.JS
// supabase Authentication Logic (Login & Register)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── LOGIN FORM ────────────────────────────────────────────
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email    = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      const errorEl  = document.getElementById('login-error');
      const loader   = document.getElementById('login-loader');
      const btnText  = document.getElementById('login-btn-text');

      clearMessages();
      setLoading(true, loader, btnText, 'Signing in...');

      try {
        const cred = await auth.signInWithEmailAndPassword(email, password);
        showAuthSuccess('Welcome back, ' + (cred.user.displayName || cred.user.email.split('@')[0]) + '! Redirecting…');
        setTimeout(() => { window.location.href = 'index.html'; }, 1500);
      } catch (err) {
        showAuthError(formatFirebaseError(err), errorEl);
        setLoading(false, loader, btnText, 'Sign In');
      }
    });
  }

  // ── FORGOT PASSWORD ───────────────────────────────────────
  const forgotPasswordLink = document.getElementById('forgot-password-link');
  const cancelResetLink = document.getElementById('cancel-reset');
  const resetSection = document.getElementById('reset-section');
  const resetForm = document.getElementById('reset-form');

  if (forgotPasswordLink && resetSection && loginForm) {
    forgotPasswordLink.addEventListener('click', (e) => {
      e.preventDefault();
      loginForm.style.display = 'none';
      resetSection.style.display = 'block';
      clearMessages();
    });
  }

  if (cancelResetLink && resetSection && loginForm) {
    cancelResetLink.addEventListener('click', (e) => {
      e.preventDefault();
      resetSection.style.display = 'none';
      loginForm.style.display = 'block';
      clearMessages();
    });
  }

  if (resetForm) {
    resetForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('reset-email').value.trim();
      const errorEl = document.getElementById('reset-error');
      const successEl = document.getElementById('reset-success');
      const loader = document.getElementById('reset-loader');
      const btnText = document.getElementById('reset-btn-text');

      clearMessages();

      if (!email) {
        return showAuthError('Please enter your email address.', errorEl);
      }

      setLoading(true, loader, btnText, 'Sending reset link...');

      try {
        await auth.sendPasswordResetEmail(email);
        if (successEl) {
          successEl.textContent = 'Password reset email sent. Check your inbox.';
          successEl.classList.add('show');
        }

        if (resetSection && loginForm) {
          setTimeout(() => {
            resetSection.style.display = 'none';
            loginForm.style.display = 'block';
            clearMessages();
            showAuthSuccess('Password reset email sent. Check your inbox.');
          }, 2800);
        }
      } catch (err) {
        showAuthError(formatFirebaseError(err), errorEl);
      } finally {
        setLoading(false, loader, btnText, 'Reset Password');
      }
    });
  }

  // ── REGISTER FORM ────────────────────────────────────────
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name      = document.getElementById('reg-name').value.trim();
      const email     = document.getElementById('reg-email').value.trim();
      const password  = document.getElementById('reg-password').value;
      const password2 = document.getElementById('reg-password2').value;
      const agree     = document.getElementById('reg-agree').checked;
      const errorEl   = document.getElementById('register-error');
      const loader    = document.getElementById('register-loader');
      const btnText   = document.getElementById('register-btn-text');

      clearMessages();

      if (!name || !email || !password || !password2) {
        return showAuthError('Please fill in all fields.', errorEl);
      }
      if (password !== password2) {
        return showAuthError('Passwords do not match.', errorEl);
      }
      if (password.length < 8) {
        return showAuthError('Password must be at least 8 characters.', errorEl);
      }
      if (!agree) {
        return showAuthError('You must agree to the Terms of Service.', errorEl);
      }

      setLoading(true, loader, btnText, 'Creating account...');

      try {
        const cred = await auth.createUserWithEmailAndPassword(email, password);
        await cred.user.updateProfile({ displayName: name });
        showAuthSuccess('Account created! Welcome, ' + name + '! Redirecting…');
        setTimeout(() => { window.location.href = 'index.html'; }, 1500);
      } catch (err) {
        showAuthError(formatFirebaseError(err), errorEl);
        setLoading(false, loader, btnText, 'Create Account');
      }
    });
  }

  // ── PASSWORD TOGGLE ───────────────────────────────────────
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      if (!input) return;
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.innerHTML = isPassword
        ? '<i class="bi bi-eye-slash"></i>'
        : '<i class="bi bi-eye"></i>';
    });
  });

  // ── PASSWORD STRENGTH ─────────────────────────────────────
  const regPassword = document.getElementById('reg-password');
  if (regPassword) {
    regPassword.addEventListener('input', () => {
      const val = regPassword.value;
      const bar = document.getElementById('strength-bar');
      const label = document.getElementById('strength-label');
      if (!bar) return;

      let strength = 0;
      if (val.length >= 8) strength++;
      if (/[A-Z]/.test(val)) strength++;
      if (/[0-9]/.test(val)) strength++;
      if (/[^A-Za-z0-9]/.test(val)) strength++;

      bar.className = 'strength-bar';
      if (strength <= 1) {
        bar.classList.add('strength-weak');
        if (label) { label.textContent = 'Weak'; label.style.color = '#EF4444'; }
      } else if (strength <= 2) {
        bar.classList.add('strength-medium');
        if (label) { label.textContent = 'Medium'; label.style.color = '#F59E0B'; }
      } else {
        bar.classList.add('strength-strong');
        if (label) { label.textContent = 'Strong'; label.style.color = '#14B8A6'; }
      }
    });
  }

  // ── REDIRECT LOGGED-IN USERS ──────────────────────────────
  if (auth) {
    auth.onAuthStateChanged(user => {
      const isAuthPage = loginForm || registerForm;
      if (user && isAuthPage) {
        window.location.href = 'index.html';
      }
    });
  }

  let authSuccessTimeout = null;
  let authErrorTimeout = null;

  // ── HELPERS ───────────────────────────────────────────────
  function showAuthError(msg, el) {
    if (!el) return;
    if (authErrorTimeout) {
      clearTimeout(authErrorTimeout);
      authErrorTimeout = null;
    }

    el.textContent = msg;
    el.style.display = 'block';
    el.classList.add('show');

    authErrorTimeout = setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => { el.style.display = 'none'; }, 360);
      authErrorTimeout = null;
    }, 4000);
  }

  function showAuthSuccess(msg) {
    const el = document.getElementById('auth-success');
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
    el.classList.add('show');

    if (authSuccessTimeout) {
      clearTimeout(authSuccessTimeout);
    }

    authSuccessTimeout = setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => { el.style.display = 'none'; }, 360);
    }, 5000);
  }

  function clearMessages() {
    if (authSuccessTimeout) {
      clearTimeout(authSuccessTimeout);
      authSuccessTimeout = null;
    }

    if (authErrorTimeout) {
      clearTimeout(authErrorTimeout);
      authErrorTimeout = null;
    }

    document.querySelectorAll('.auth-error-msg, .auth-success-msg').forEach(el => {
      el.classList.remove('show');
      el.style.display = 'none';
    });
  }

  function setLoading(isLoading, loader, btnText, text) {
    if (loader) loader.classList.toggle('show', isLoading);
    if (btnText) btnText.textContent = isLoading ? text : btnText.dataset.default || text;
    const btn = loader?.closest('button');
    if (btn) btn.disabled = isLoading;
  }

  // Normalize Firebase errors: prefer friendly mapping, else use the raw message
  function formatFirebaseError(err) {
    if (!err) return 'An error occurred. Please try again.';
    const friendly = getFriendlyError(err.code);
    if (friendly && friendly !== 'An error occurred. Please try again.') return friendly;
    return err.message || friendly;
  }

  function getFriendlyError(code) {
    const errors = {
      'auth/invalid-email':             'Please enter a valid email address.',
      'auth/user-disabled':             'This account has been disabled.',
      'auth/user-not-found':            'No account found with this email.',
      'auth/wrong-password':            'Incorrect password. Please try again.',
      'auth/email-already-in-use':      'An account with this email already exists.',
      'auth/weak-password':             'Password must be at least 6 characters.',
      'auth/too-many-requests':         'Too many attempts. Please try again later.',
      'auth/network-request-failed':    'Network error. Check your connection.',
      'auth/configuration-not-found':   'Firebase authentication configuration was not found. Check your Firebase setup and API key.',
      'auth/popup-closed-by-user':      'Sign-in popup was closed. Please try again.',
      'auth/cancelled-popup-request':   'Sign-in was cancelled.',
      'auth/invalid-credential':        'Invalid credentials. Please check and try again.',
    };
    return errors[code] || 'An error occurred. Please try again.';
  }
});
