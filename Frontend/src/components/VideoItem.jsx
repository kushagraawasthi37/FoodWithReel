import React from 'react';
import VideoPlayer from  "../components/VideoPlayer";
import VisitStoreButton from '../components/VisitStoreButton';
import TruncatedDescription from '../components/TruncatedDescription';

const VideoItem = ({ video }) => {
  return (
    <div className="video-item">
      <VideoPlayer src={video.src} />
      <TruncatedDescription description={video.description} />
      <VisitStoreButton storeUrl={video.storeUrl} />
    </div>
  );
};

export default VideoItem;