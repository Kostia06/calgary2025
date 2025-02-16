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
            setCascadingImages(prevImages => [
                ...prevImages,
                { src: image, scale }
            ]);
        }, 1000);

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
                        animationDuration: `${Math.random() * 5 + 5}s` // Random duration between 5 and 10 seconds
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
