import React, { useEffect, useState } from 'react';
import { BarChart3, Link as LinkIcon, ExternalLink } from 'lucide-react';
import api from '../api';

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await api.get('/url/viewAll');
        // If the backend returned JSON (in case it was fixed)
        if (typeof response.data === 'object' && response.data.urls) {
          setUrls(response.data.urls);
        } else if (typeof response.data === 'string') {
          // Attempt to parse HTML if it returned the EJS render
          const parser = new DOMParser();
          const doc = parser.parseFromString(response.data, 'text/html');
          const rows = Array.from(doc.querySelectorAll('table tbody tr')).map((tr, index) => {
            const tds = tr.querySelectorAll('td');
            if (tds.length === 0) return null;
            return {
              _id: index.toString(),
              shortId: tds[1]?.textContent?.trim(),
              redirectURL: tds[2]?.textContent?.trim(),
              visitHistory: { length: parseInt(tds[3]?.textContent?.trim() || '0', 10) }
            };
          }).filter(Boolean);
          setUrls(rows);
        }
      } catch (err) {
        if (err.response?.status === 500) {
          setError("Your backend triggered a 500 Server Error while trying to render the EJS view. Please check if your 'views' folder exists on the backend!");
        } else {
          setError(err.response?.data?.message || 'Failed to fetch dashboard data. Are you logged in?');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <BarChart3 size={32} color="var(--primary)" />
        <h1 className="heading-gradient" style={{ fontSize: '2rem' }}>Your Dashboard</h1>
      </div>

      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading your links...</div>
        ) : error ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <p className="error-text" style={{ fontSize: '1.1rem' }}>{error}</p>
          </div>
        ) : urls.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <LinkIcon size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <h3>No links found</h3>
            <p>You haven't shortened any URLs yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
                <tr>
                  <th>Short Link</th>
                  <th>Original URL</th>
                  <th>Total Clicks</th>
                </tr>
              </thead>
              <tbody>
                {urls.map((url) => (
                  <tr key={url._id}>
                    <td style={{ fontWeight: 500 }}>
                      <a href={`/${url.shortId}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {window.location.host}/{url.shortId} <ExternalLink size={14} />
                      </a>
                    </td>
                    <td style={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
                      {url.redirectURL}
                    </td>
                    <td>
                      <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', borderRadius: '99px', fontWeight: 600, fontSize: '0.875rem' }}>
                        {url.visitHistory?.length || 0} clicks
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
