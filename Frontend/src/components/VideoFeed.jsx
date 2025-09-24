import React from 'react';
import VideoItem from '../components/VideoItem';
import useSnapScroll from '../hooks/useSnapScroll';
import '../styles/VideoFeed.css';

const VideoFeed = ({ videos }) => {
  useSnapScroll();

  return (
    <div className="video-feed">
      {videos.map((video, index) => (
        <VideoItem key={index} video={video} />
      ))}
    </div>
  );
};

export default VideoFeed;