import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import './Background.css';

const Background = ({ image, children }) => {
    const [cascadingImages, setCascadingImages] = useState([]);

    useEffect(() => {
        if (!image) {
            console.error('Background component requires a valid image URL.');
            return;
        }

        const interval = setInterval(() => {
            const scale = Math.random() * 0.5 + 0.5; // Random scale between 0.5 and 1
            const left = Math.random() * 100; // Random horizontal position between 0% and 100%
            setCascadingImages(prevImages => [
                ...prevImages,
                { id: prevImages.length + 1, src: image, scale, left }
            ]);
        }, 3000); // Spawn less frequently (every 3 seconds)

        return () => clearInterval(interval);
    }, [image]);

    return (
        <div className="background-container">
            {cascadingImages.map((img, index) => (
                <div
                    key={index}
                    className="cascading-image"
                    style={{
                        backgroundImage: `url(${img.src})`,
                        transform: `scale(${img.scale})`,
                        left: `${img.left}%`,
                        animationDuration: `${Math.random() * 10 + 10}s`, // Slower travel (random duration between 10 and 20 seconds)
                        position: 'absolute', // Ensure images are positioned independently
                        top: 0, // Start from the top
                        width: '100px', // Ensure the image is not cut off
                        height: '100px', // Ensure the image is not cut off
                        backgroundSize: 'contain', // Ensure the image is fully visible
                        backgroundRepeat: 'no-repeat', // Ensure the image is not repeated
                        animationTimingFunction: 'linear' // Ensure smooth animation
                    }}
                />
            ))}
            <div className="background-children">
                {children}
            </div>
        </div>
    );
};

Background.propTypes = {
    image: PropTypes.string.isRequired,
    children: PropTypes.node
};

export default Background;
