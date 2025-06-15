// LogoutPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem' }}>
      <h2>You are not authenticated</h2>
      <p>Please log in to access the dashboard.</p>
      <button
        onClick={() => navigate('/login', { replace: true })}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Go to Login
      </button>
    </div>
  );
};

export default LogoutPage;
