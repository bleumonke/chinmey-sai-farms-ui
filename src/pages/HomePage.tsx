import React from 'react';
import NavBar from '../components/navbar/navbar';

import type { IconBaseProps } from 'react-icons';

const FaPhoneAlt = require('react-icons/fa').FaPhoneAlt;
const FaEnvelope = require('react-icons/fa').FaEnvelope;


const InfoBar: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#1b5e20',
        color: 'white',
        fontSize: '0.85rem',
        padding: '8px 20px',
        fontWeight: 400,
        flexWrap: 'wrap',
        gap: '40px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FaPhoneAlt {...({} as IconBaseProps)} />
        <span>+1 (234) 567-8901</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FaEnvelope {...({} as IconBaseProps)} />
        <span>info@chimneysaifarms.com</span>
      </div>
    </div>
  );
};


const Content: React.FC = () => {
  return (
    <div
      className="home-page-content"
      style={{
        position: 'relative',
        backgroundImage: 'url(/images/farmer.jpeg)',
        backgroundSize: 'cover',
        minHeight: '500px',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '60px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
        }}
      ></div>
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          Welcome to Chimney Saif Farms
        </h1>
        <h3 style={{ fontWeight: '400', marginBottom: '1.5rem' }}>
          Nature’s Freshness Delivered to Your Doorstep
        </h3>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '2rem' }}>
          Your one-stop destination for fresh produce, organic farming, and sustainable living.
          Discover a healthier lifestyle, grown with love and care.
        </p>
        <button
          style={{
            padding: '12px 24px',
            backgroundColor: '#1b5e20',
            border: 'none',
            borderRadius: '5px',
            color: 'white',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = '#45a049'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = '#4CAF50'}
        >
          Explore Products
        </button>
      </div>
    </div>
  )
}

const HomePage: React.FC = () => {
  return (
    <div>
      <InfoBar />
      <NavBar />
      <Content />
    </div>
  );
};

export default HomePage;
