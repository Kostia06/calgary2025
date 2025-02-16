'use client';

import React, { useEffect, useRef, useState } from 'react';
import exifr from 'exifr';
import { supabase } from '@/lib/supabase';
import { DialogContent, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MdClose } from 'react-icons/md';

//
// ================ HELPER: Upload to Supabase ================
//
const uploadToSupabase = async (
    file,
    setImageUrl,
    setUploading,
    lat = null,
    lng = null
) => {
    if (!file) return;
    setUploading(true);
    try {
        console.log('Uploading file with lat/lng:', lat, lng);

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

//
// ================ CUSTOM HOOK: Use Camera ================
//
const useCamera = (setImageUrl, setUploading, setLatitude, setLongitude) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [showCamera, setShowCamera] = useState(false);

    // 1) Open camera
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

    // 2) Attach stream to video element
    useEffect(() => {
        if (showCamera && videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(console.error);
        }
    }, [showCamera, stream]);

    // 3) Capture photo + geolocation
    const handleCapture = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        // Ask for geolocation
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setLatitude(lat);
                    setLongitude(lng);

                    // Draw the current frame on a canvas
                    const canvas = canvasRef.current;
                    canvas.width = videoRef.current.videoWidth;
                    canvas.height = videoRef.current.videoHeight;
                    canvas
                        .getContext('2d')
                        .drawImage(
                            videoRef.current,
                            0,
                            0,
                            canvas.width,
                            canvas.height
                        );

                    // Turn the canvas content into a file
                    canvas.toBlob(async (blob) => {
                        if (blob) {
                            const file = new File(
                                [blob],
                                'camera_capture.jpg',
                                {
                                    type: blob.type,
                                }
                            );
                            await uploadToSupabase(
                                file,
                                setImageUrl,
                                setUploading,
                                lat,
                                lng
                            );
                        }
                    });
                    handleCancelCamera();
                },
                (err) => {
                    console.error('Geolocation error:', err);
                    // Even if geolocation fails, still capture
                    captureWithoutLocation();
                }
            );
        } else {
            // If no geolocation support, capture anyway
            captureWithoutLocation();
        }
    };

    // Helper if geolocation fails
    const captureWithoutLocation = () => {
        const canvas = canvasRef.current;
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas
            .getContext('2d')
            .drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
            if (blob) {
                const file = new File([blob], 'camera_capture.jpg', {
                    type: blob.type,
                });
                // lat/lng remain null
                await uploadToSupabase(
                    file,
                    setImageUrl,
                    setUploading,
                    null,
                    null
                );
            }
        });
        handleCancelCamera();
    };

    // 4) Close camera
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

const ImageUploaded = ({ imageUrl, latitude, longitude, open, setOpen }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    let sLat = latitude ? parseFloat(latitude).toFixed(2) : 0;
    let sLng = longitude ? parseFloat(longitude).toFixed(2) : 0;

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleDescriptionChange = (e) => setDescription(e.target.value);

    const handleSubmit = async () => {
        const createPost = await fetch('/api/posts/create-post', {
            method: 'POST',
            body: JSON.stringify({
                title,
                description,
                lat: latitude.toString(),
                lng: longitude.toString(),
                imageUrl,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        setOpen(!open);
    };

    const handleCancel = () => {
        setTitle('');
        setDescription('');
        setOpen(!open);
    };

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
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 z-50 flex items-center justify-center">
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

            {/* Display lat/lng if available */}
            {(latitude !== null || longitude !== null) && (
                <div className="flex items-center space-x-4 text-sm *:text-black *:text-opacity-70">
                    <p>Latitude: {sLat}</p>
                    <p>Longitude: {sLng}</p>
                </div>
            )}

            <div className="w-full">
                <Label className="text-lg text-black">Title:</Label>
                <Input
                    type="text"
                    className="w-full border-2 border-[#008148] text-black"
                    placeholder="Enter the title"
                    value={title}
                    onChange={handleTitleChange}
                />
            </div>

            <div className="w-full">
                <Label className="text-lg text-gray-700">Description:</Label>
                <Textarea
                    className="w-full border-2 border-[#008148] text-black"
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
        <div className="flex flex-col items-center gap-4">
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
        </div>
    );
};

const ShowCamera = ({
    videoRef,
    canvasRef,
    handleCapture,
    handleCancelCamera,
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

//
// ================ MAIN COMPONENT ================
//
export default function ImageUploade({ open, setOpen }) {
    const fileInputRef = useRef(null);

    // Manage uploading and image state
    const [imageUrl, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    // For lat/lng display
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    // -- Initialize camera hook, passing the setState callbacks:
    const {
        videoRef,
        canvasRef,
        showCamera,
        handleCameraClick,
        handleCapture,
        handleCancelCamera,
    } = useCamera(setImageUrl, setUploading, setLatitude, setLongitude);

    // ========== HANDLE FILE UPLOAD (EXIF GPS) ==========
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // 1) Try reading EXIF for lat/lng
        try {
            const exifData = await exifr.parse(file);
            console.log('EXIF data:', exifData);

            if (exifData?.latitude && exifData?.longitude) {
                setLatitude(exifData.latitude);
                setLongitude(exifData.longitude);
            } else {
                setLatitude(null);
                setLongitude(null);
            }
        } catch (error) {
            console.error('Error reading EXIF data:', error);
            setLatitude(null);
            setLongitude(null);
        }

        // 2) Upload
        const latToSend = latitude;
        const lngToSend = longitude;
        await uploadToSupabase(
            file,
            setImageUrl,
            setUploading,
            latToSend,
            lngToSend
        );
    };

    return (
        <>
            {imageUrl ? (
                <ImageUploaded
                    imageUrl={imageUrl}
                    latitude={latitude}
                    longitude={longitude}
                    open={open}
                    setOpen={setOpen}
                />
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
                />
            )}
        </>
    );
}
