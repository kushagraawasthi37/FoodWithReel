import React from 'react';

export default function TruncatedDescription({ description }) {
  const maxLength = 100; // Maximum length for the truncated description

  return (
    <div className="truncated-description">
      {description.length > maxLength 
        ? `${description.substring(0, maxLength)}...` 
        : description}
    </div>
  );
}