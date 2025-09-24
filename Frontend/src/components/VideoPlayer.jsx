import React from 'react';

export default function VideoPlayer({ videoSrc }) {
  return (
    <div className="video-player">
      <video src={videoSrc} controls autoPlay loop className="video" />
    </div>
  );
}