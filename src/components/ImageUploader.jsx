'use client';

import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DialogContent, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MdClose } from 'react-icons/md';

const useCamera = (setImageUrl, setUploading) => {
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

    const handleCapture = async () => {
        if (!videoRef.current || !canvasRef.current) return;
        const canvas = canvasRef.current;
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas
            .getContext('2d')
            .drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(async (blob) => {
            if (blob) {
                await uploadToSupabase(
                    new File([blob], 'camera_capture.jpg', { type: blob.type }),
                    setImageUrl,
                    setUploading
                );
            }
        });
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

const uploadToSupabase = async (file, setImageUrl, setUploading) => {
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

const ImageUploaded = ({ imageUrl }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleTitleChange = (event) => setTitle(event.target.value);
    const handleDescriptionChange = (event) =>
        setDescription(event.target.value);

    const handleSubmit = () => {
        // Handle form submission, e.g., send to server or save to state
        console.log('Title:', title);
        console.log('Description:', description);
    };

    const handleCancel = () => {
        // Handle cancel (reset or close form)
        setTitle('');
        setDescription('');
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="flex flex-col items-center p-4 space-y-4">
            <button className="relative" onClick={() => openModal()}>
                <img
                    src={imageUrl}
                    alt="Uploaded"
                    className="w-72 h-48 cursor-pointer object-cover rounded-lg shadow-md"
                />
                <div className="absolute bottom-2 right-2 bg-black text-white text-xs py-1 px-2 rounded-md opacity-70">
                    Click to view full image
                </div>
            </button>

            {/* Full-Size Image Modal */}
            {isModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 z-50">
                    <div className="relative">
                        <img
                            src={imageUrl}
                            alt="Uploaded"
                            className="max-w-full max-h-full object-contain rounded-lg"
                        />
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 bg-white text-black rounded-full hover:bg-gray-300"
                        >
                            <MdClose className="h-6 w-6 text-black fill-black" />
                        </button>
                    </div>
                </div>
            )}

            <div className="w-full">
                <Label className="text-lg text-black">Title:</Label>
                <Input
                    type="text"
                    className="w-full border-2 border-[#008148]"
                    placeholder="Enter the title"
                    value={title}
                    onChange={handleTitleChange}
                />
            </div>

            <div className="w-full">
                <Label className="text-lg text-gray-700">Description:</Label>
                <Textarea
                    className="w-full border-2 border-[#008148]"
                    placeholder="Enter a brief description"
                    rows={4}
                    value={description}
                    onChange={handleDescriptionChange}
                />
            </div>

            <div className="flex w-full justify-between">
                <Button
                    className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition"
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
                <Button
                    className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 transition"
                    onClick={handleCancel}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
};
const ImageIsUploading = ({ uploading, fileInputRef, handleCameraClick }) => {
    const handleUploadClick = () => fileInputRef.current?.click();
    return (
        <>
            <button
                onClick={handleUploadClick}
                className="w-72 outline-none h-48 border-4 hover:border-8 smooth text-s text-lg hover:text-xl font-bold border-dashed border-[#008148] rounded-lg text-center"
            >
                {uploading ? 'Uploading...' : 'Click to Add Image'}
            </button>
            <button
                onClick={handleCameraClick}
                className="bg-s py-2 px-4 text-a text-lg rounded-md smooth hover:scale-110"
            >
                Take Photo
            </button>
        </>
    );
};

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
                onClick={handleCapture}
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
    } = useCamera(setImageUrl, setUploading); // Pass setUploading here

    const handleFileChange = async (event) =>
        await uploadToSupabase(
            event.target.files[0],
            setImageUrl,
            setUploading
        );

    return (
        <>
            {imageUrl ? (
                <ImageUploaded imageUrl={imageUrl} />
            ) : (
                <ImageIsUploading
                    uploading={uploading}
                    fileInputRef={fileInputRef}
                    handleCameraClick={handleCameraClick}
                />
            )}

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
        </>
    );
}
