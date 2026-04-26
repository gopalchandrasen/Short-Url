import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function RedirectHandler() {
  const { shortId } = useParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const performRedirect = async () => {
      try {
        // Because of our Vite proxy settings, fetching /shortId routes to http://localhost:8002/shortId
        const response = await axios.get(`/${shortId}`);
        if (response.data && response.data.url) {
          // Immediately redirect the user to the original URL
          window.location.href = response.data.url;
        } else {
          setError('Invalid redirect URL received.');
        }
      } catch (err) {
        setError(err.response?.data?.error || 'URL not found or expired.');
      }
    };

    performRedirect();
  }, [shortId]);

  if (error) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem' }}>
          <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Oops!</h2>
          <p style={{ color: 'var(--text-muted)' }}>{error}</p>
          <button onClick={() => window.location.href = '/'} className="btn-primary" style={{ width: 'auto', margin: '2rem auto 0' }}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Beautiful loading state while redirecting
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ width: '50px', height: '50px', border: '3px solid rgba(59, 130, 246, 0.3)', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      <h2 style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>Redirecting you securely...</h2>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
