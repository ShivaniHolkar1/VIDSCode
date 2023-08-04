import React from 'react';
import ReactPlayer from 'react-player';
import { Card } from 'primereact/card';
import { ScrollPanel } from 'primereact/scrollpanel';
import FireDetect from "./Videos/FireDetect.mp4";

const Live = () => {
    const videoUrls = [
        // '/VIDS/src/pages/Videos/event.mp4',      
        'https://example.com/video2.mp4',
        'https://example.com/video2.mp4',
        'https://example.com/video1.mp4',
        'https://example.com/video2.mp4',
        'https://example.com/video1.mp4',
        'https://example.com/video2.mp4',

        // Add more video URLs as needed
    ];

    return (

        <div className="video-container">

            {videoUrls.map((videoUrl, index) => (
                // <Card key={index} title={`Video ${index + 1}`}>
                <ReactPlayer url={videoUrl} controls width="80%" height="auto" />
                // </Card>
            ))}

        </div>

    );
};

export default Live;