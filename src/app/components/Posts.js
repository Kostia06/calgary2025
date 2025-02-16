"use client";

import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { DialogContent, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ImageUploader = () => {
    const fileInputRef = useRef(null);
    const [imageUrl, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const uploadToSupabase = async (file) => {
        if (!file) return;
        setUploading(true);
        try {
            const fileName = `${Date.now()}_${file.name || 'camera_capture.jpg'}`;
            const { data, error: uploadError } = await supabase
                .storage
                .from('posts')
                .upload(fileName, file);
            if (uploadError) throw uploadError;

            const { data: urlData, error: urlError } = await supabase
                .storage
                .from('posts')
                .getPublicUrl(data.path);
            if (urlError) throw urlError;

            setImageUrl(urlData.publicUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setUploading(false);
        }
    };

    // Handle file selection from file input
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        await uploadToSupabase(file);
    };

    // Toggle options menu
    const handleImageClick = () => {
        setShowOptions(!showOptions);
    };

    // Trigger file input for image upload
    const handleUploadClick = () => {
        fileInputRef.current?.click();
        setShowOptions(false);
    };

    // Request camera access and show the camera modal
    const handleCameraClick = async () => {
        setShowOptions(false);
        try {
            // Request the environment-facing camera if available
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setStream(mediaStream);
            setShowCamera(true);
        } catch (error) {
            console.error("Error accessing camera:", error);
        }
    };

    // When the camera modal is shown and stream is available, assign it to the video element
    useEffect(() => {
        if (showCamera && videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch((err) => {
                console.error("Error playing video stream:", err);
            });
        }
    }, [showCamera, stream]);

    // Capture photo from video stream
    const handleCapture = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        // Set canvas dimensions to match the video feed
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert the canvas image to a blob then upload
        canvas.toBlob(async (blob) => {
            if (blob) {
                const file = new File([blob], 'camera_capture.jpg', { type: blob.type });
                await uploadToSupabase(file);
            }
        }, 'image/jpeg');

        // Stop the video stream and close the camera modal
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        setShowCamera(false);
        setStream(null);
    };

    // Cancel camera capture and close the modal
    const handleCancelCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        setShowCamera(false);
        setStream(null);
    };

    return (
        <div style={{ textAlign: 'center', position: 'relative' }}>
            {imageUrl ? (
                <DialogContent className="sm:max-w-[425px] w-full flex flex-col items-center justify-center">
                    <img
                        src={imageUrl}
                        alt="Uploaded"
                        style={{ width: '200px', height: '200px', cursor: 'pointer', objectFit: 'cover', borderRadius: '8px' }}
                        onClick={handleImageClick}
                    />
                    <div>
                        <Label className='text-xl text-s' name="Title">
                            Title:
                        </Label>
                            <Input type="text" />
                        <Label name="Title">
                            <textarea className='w-full' />
                        </Label>
                    </div>
                </DialogContent>
            ) : (
                <div
                    onClick={handleImageClick}
                    style={{
                        // width: '200px',
                        height: '200px',
                        border: '2px dashed #ccc',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexDirection: 'column',
                        gap: '10px'
                    }}
                    className='w-full'
                >
                    {uploading ? 'Uploading...' : 'Click to Add Image'}
                </div>
            )}

            {showOptions && (
                <DialogDescription style={{
                    borderRadius: '8px',
                    marginTop: '10px',
                    display: 'flex',
                    gap: '10px',
                    zIndex: 1000
                }}>
                    <button
                        onClick={handleUploadClick}
                        style={{
                            border: 'none',
                            borderRadius: '4px',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                        className='bg-s py-2 px-2'
                    >
                        Upload Image
                    </button>
                    <button
                        onClick={handleCameraClick}
                        style={{
                            border: 'none',
                            borderRadius: '4px',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                        className='bg-s py-2 px-2'
                    >
                        Take Photo
                    </button>
                </DialogDescription>
            )}

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />

            {/* Camera Modal */}
            {showCamera && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000
                }}>
                    <video ref={videoRef} style={{ width: '300px', maxWidth: '90%' }} autoPlay playsInline />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                        <button
                            onClick={handleCapture}
                            style={{
                                padding: '8px 16px',
                                border: 'none',
                                borderRadius: '4px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            Capture Photo
                        </button>
                        <button
                            onClick={handleCancelCamera}
                            style={{
                                padding: '8px 16px',
                                border: 'none',
                                borderRadius: '4px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
