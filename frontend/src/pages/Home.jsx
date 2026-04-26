import React, { useState } from 'react';
import { Copy, Link2, Check } from 'lucide-react';
import api from '../api';

export default function Home() {
  const [url, setUrl] = useState('');
  const [shortId, setShortId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShorten = async (e) => {
    e.preventDefault();
    setError('');
    setShortId('');
    setLoading(true);
    try {
      const response = await api.post('/url/newUser', { url });
      setShortId(response.data.id);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.err || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const fullUrl = `${window.location.origin}/${shortId}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '4rem auto', width: '100%', textAlign: 'center' }}>
      <h1 className="heading-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        Shorten Your Links
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.25rem' }}>
        Create sleek, memorable, and trackable short links instantly.
      </p>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <form onSubmit={handleShorten} style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <Link2 size={20} />
            </div>
            <input
              type="url"
              className="input-field"
              placeholder="Enter your long URL here (https://...)"
              value={url}
              onChange={e => setUrl(e.target.value)}
              required
              style={{ paddingLeft: '3rem', height: '100%', fontSize: '1.1rem' }}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: 'auto', padding: '0 2rem' }}>
            {loading ? 'Shortening...' : 'Shorten'}
          </button>
        </form>
        {error && <p className="error-text" style={{ marginTop: '1rem', textAlign: 'left' }}>{error}</p>}
      </div>

      {shortId && (
        <div className="glass-panel" style={{ marginTop: '2rem', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Your shortened URL is ready:</p>
            <a href={`/${shortId}`} target="_blank" rel="noreferrer" style={{ fontSize: '1.25rem', fontWeight: 600 }}>
              {window.location.host}/{shortId}
            </a>
          </div>
          <button onClick={copyToClipboard} className="btn-primary" style={{ width: 'auto', background: copied ? '#10b981' : 'var(--bg-card)', color: copied ? 'white' : 'var(--text-main)', border: '1px solid var(--border-color)' }}>
            {copied ? <><Check size={18} /> Copied!</> : <><Copy size={18} /> Copy</>}
          </button>
        </div>
      )}
    </div>
  );
}
