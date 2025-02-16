'use client';

import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DialogContent, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const useCamera = (setImageUrl) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [showCamera, setShowCamera] = useState(false);

    const handleCameraClick = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
            });
            setStream(mediaStream);
            setShowCamera(true);
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };

    useEffect(() => {
        if (showCamera && videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(console.error);
        }
    }, [showCamera, stream]);

    const handleCapture = async (uploadToSupabase) => {
        if (!videoRef.current || !canvasRef.current) return;
        const canvas = canvasRef.current;
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas
            .getContext('2d')
            .drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
            async (blob) =>
                blob &&
                (await uploadToSupabase(
                    new File([blob], 'camera_capture.jpg', { type: blob.type })
                ))
        );
        handleCancelCamera();
    };

    const handleCancelCamera = () => {
        stream?.getTracks().forEach((track) => track.stop());
        setShowCamera(false);
        setStream(null);
    };

    return {
        videoRef,
        canvasRef,
        showCamera,
        handleCameraClick,
        handleCapture,
        handleCancelCamera,
    };
};

const uploadToSupabase = async (file, setupLoading) => {
    if (!file) return;
    setUploading(true);
    try {
        const fileName = `${Date.now()}_${file.name || 'camera_capture.jpg'}`;
        const { data, error } = await supabase.storage
            .from('posts')
            .upload(fileName, file);
        if (error) throw error;
        const { data: urlData, error: urlError } = await supabase.storage
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

const ImageUploaded = ({ imageUrl, handleImageClick }) => (
    <DialogContent className="sm:max-w-[425px] w-full flex flex-col items-center justify-center">
        <img
            src={imageUrl}
            alt="Uploaded"
            className="w-48 h-48 cursor-pointer object-cover rounded-lg"
            onClick={handleImageClick}
        />
        <Label className="text-xl text-s">Title:</Label>
        <Input type="text" />
        <Label>Description:</Label>
        <textarea className="w-full" />
    </DialogContent>
);

const ImageIsUploading = ({ handleImageClick, uploading }) => (
    <button className="w-72 h-48 border-4 hover:border-8 smooth text-s text-lg hover:text-xl font-bold border-dashed border-[#008148] rounded-lg text-center">
        {uploading ? 'Uploading...' : 'Click to Add Image'}
    </button>
);

const Options = ({ handleUploadClick, handleCameraClick }) => (
    <DialogDescription className="mt-4 flex items-center justify-evenly space-x-6">
        <button
            onClick={handleUploadClick}
            className="bg-s py-2 px-4 text-a text-lg rounded-md smooth hover:scale-110"
        >
            Upload Image
        </button>
        <button
            onClick={handleCameraClick}
            className="bg-s py-2 px-4 text-a text-lg rounded-md smooth hover:scale-110"
        >
            Take Photo
        </button>
    </DialogDescription>
);

const ShowCamera = ({
    videoRef,
    canvasRef,
    handleCapture,
    handleCancelCamera,
    setImageUrl,
    setUploading,
}) => (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
        <video
            ref={videoRef}
            className="w-72 max-w-full"
            autoPlay
            playsInline
        />
        <canvas ref={canvasRef} className="hidden" />
        <div className="mt-4 flex gap-4">
            <button
                onClick={() =>
                    handleCapture(uploadToSupabase(setImageUrl, setUploading))
                }
                className="px-4 py-2 bg-green-600 text-white rounded-md"
            >
                Capture
            </button>
            <button
                onClick={handleCancelCamera}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
            >
                Cancel
            </button>
        </div>
    </div>
);

export default function ImageUploade() {
    const fileInputRef = useRef(null);
    const [imageUrl, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const {
        videoRef,
        canvasRef,
        showCamera,
        handleCameraClick,
        handleCapture,
        handleCancelCamera,
    } = useCamera(setImageUrl);

    const handleFileChange = async (event) =>
        await uploadToSupabase(event.target.files[0], setUploading);

    const handleUploadClick = () =>
        fileInputRef.current?.click() || setShowOptions(false);

    return (
        <div className="flex flex-col items-center justify-center">
            {imageUrl ? (
                <ImageUploaded
                    imageUrl={imageUrl}
                    handleImageClick={handleImageClick}
                />
            ) : (
                <ImageIsUploading uploading={uploading} />
            )}

            <Options
                handleUploadClick={handleUploadClick}
                handleCameraClick={handleCameraClick}
            />

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
            />

            {showCamera && (
                <ShowCamera
                    videoRef={videoRef}
                    canvasRef={canvasRef}
                    handleCapture={handleCapture}
                    handleCancelCamera={handleCancelCamera}
                    setImageUrl={setImageUrl}
                    setUploading={setUploading}
                />
            )}
        </div>
    );
}
