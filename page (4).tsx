'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Enter a valid email address';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 4) newErrors.password = 'Password must be at least 4 characters';
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.error || 'Login failed' });
        return;
      }

      localStorage.setItem('user', JSON.stringify(data.data));
      window.dispatchEvent(new Event('userUpdated'));
      router.push('/');
    } catch {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      background: `radial-gradient(ellipse at center, #7b2fff10 0%, transparent 70%)`
    }}>
      <div data-testid="login-container" style={{ width: '100%', maxWidth: '420px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            fontWeight: 900,
            color: 'var(--accent-primary)',
            letterSpacing: '0.1em',
            textDecoration: 'none'
          }}>
            GEEK<span style={{ color: 'var(--accent-secondary)' }}>STORE</span>
          </Link>
          <h1 data-testid="login-title" style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            marginTop: '16px',
            color: 'var(--text-primary)'
          }}>
            WELCOME BACK
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '32px' }}>
          {/* General error */}
          {errors.general && (
            <div data-testid="login-error-general" style={{
              background: '#ff2d5510',
              border: '1px solid #ff2d5540',
              borderRadius: 'var(--radius)',
              padding: '12px 16px',
              color: 'var(--accent-hot)',
              fontSize: '14px',
              marginBottom: '24px'
            }}>
              {errors.general}
            </div>
          )}

          {/* Email */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              data-testid="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vivi@geekstore.com"
              className={`form-input ${errors.email ? 'error' : ''}`}
              autoComplete="email"
            />
            {errors.email && (
              <span data-testid="login-error-email" className="form-error">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              data-testid="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`form-input ${errors.password ? 'error' : ''}`}
              autoComplete="current-password"
            />
            {errors.password && (
              <span data-testid="login-error-password" className="form-error">{errors.password}</span>
            )}
          </div>

          {/* Submit */}
          <button
            data-testid="login-submit"
            onClick={handleSubmit}
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Test credentials hint */}
          <div data-testid="test-credentials" style={{
            marginTop: '24px',
            padding: '12px',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius)',
            fontSize: '12px',
            color: 'var(--text-muted)'
          }}>
            <strong style={{ color: 'var(--text-secondary)' }}>Test credentials:</strong><br />
            📧 vivi@geekstore.com<br />
            🔑 Test1234!
          </div>
        </div>
      </div>
    </div>
  );
}
