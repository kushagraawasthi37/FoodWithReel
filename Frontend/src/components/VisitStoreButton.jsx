import React from 'react';

export default function VisitStoreButton({ storeUrl }) {
  const handleVisitStore = () => {
    window.open(storeUrl, '_blank');
  };

  return (
    <button className="visit-store-button" onClick={handleVisitStore}>
      Visit Store
    </button>
  );
}