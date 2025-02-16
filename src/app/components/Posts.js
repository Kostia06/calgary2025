"use client";

import React, { useEffect, useRef, useState } from 'react';
import exifr from 'exifr'; // <-- 1) Make sure you installed this
import { supabase } from '../../lib/supabase';
import { DialogContent, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ImageUploader = () => {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Image + state
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);

  // We'll store lat/lng in state for display
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  // uploadToSupabase remains the same except we accept optional lat/lng
  const uploadToSupabase = async (file, lat, lng) => {
    if (!file) return;
    setUploading(true);

    try {
      // Log or store lat/lng if you want
      console.log("uploadToSupabase -> lat:", lat, " lng:", lng);

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

  // ================
  //  CAMERA CAPTURE
  // ================
  const handleCameraClick = async () => {
    setShowOptions(false);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(mediaStream);
      setShowCamera(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  // Once camera is open, assign stream to video
  useEffect(() => {
    if (showCamera && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((err) => {
        console.error("Error playing video stream:", err);
      });
    }
  }, [showCamera, stream]);

  // Actually capture the photo
  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    // 1) Ask user for geolocation 
    let lat = null;
    let lng = null;
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      lat = position.coords.latitude;
      lng = position.coords.longitude;
    } catch (err) {
      console.error("Error using geolocation for camera capture:", err);
    }

    // 2) Draw the video frame to canvas
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 3) Convert canvas to Blob
    canvas.toBlob(async (blob) => {
      if (blob) {
        const file = new File([blob], 'camera_capture.jpg', {
          type: blob.type,
          lastModified: Date.now(),
        });
        // 4) Upload with the lat/lng from geolocation
        setLatitude(lat);
        setLongitude(lng);
        await uploadToSupabase(file, lat, lng);
      }
    }, 'image/jpeg');

    // 5) Stop camera and close modal
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
    setStream(null);
  };

  const handleCancelCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setShowCamera(false);
    setStream(null);
  };

  // =======================
  //  FILE UPLOAD (EXIF GPS)
  // =======================
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // 1) Attempt to parse EXIF data (including GPS)
      const exifData = await exifr.parse(file);
      console.log("EXIF data:", exifData);

      // exifr returns latitude/longitude if present
      if (exifData && exifData.latitude && exifData.longitude) {
        setLatitude(exifData.latitude);
        setLongitude(exifData.longitude);
      } else {
        // No location in EXIF
        setLatitude(null);
        setLongitude(null);
      }
    } catch (error) {
      console.error("Error reading EXIF data:", error);
      setLatitude(null);
      setLongitude(null);
    }

    // 2) Upload (we pass lat/lng to supabase if we want)
    // but we only have them if exif had them
    await uploadToSupabase(file, latitude, longitude);
  };

  // ===================
  //  UI / RENDER LOGIC
  // ===================
  const handleImageClick = () => setShowOptions(!showOptions);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
    setShowOptions(false);
  };

  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      {imageUrl ? (
        <DialogContent className="sm:max-w-[425px] w-full flex flex-col items-center justify-center">
          <img
            src={imageUrl}
            alt="Uploaded"
            style={{
              width: '200px',
              height: '200px',
              cursor: 'pointer',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
            onClick={handleImageClick}
          />
          {(latitude || longitude) && (
            <div style={{ marginTop: '10px' }}>
              <p>Latitude: {latitude}</p>
              <p>Longitude: {longitude}</p>
            </div>
          )}
          <div>
            <Label className="text-xl text-s" name="Title">
              Title:
            </Label>
            <Input type="text" className='text-black' />
            <Label name="Title">
              <textarea className="w-full text-black" />
            </Label>
          </div>
        </DialogContent>
      ) : (
        <div
          onClick={handleImageClick}
          style={{
            height: '200px',
            border: '2px dashed #ccc',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexDirection: 'column',
            gap: '10px',
          }}
          className="w-full"
        >
          {uploading ? 'Uploading...' : 'Click to Add Image'}
        </div>
      )}

      {showOptions && (
        <DialogDescription
          style={{
            borderRadius: '8px',
            marginTop: '10px',
            display: 'flex',
            gap: '10px',
            zIndex: 1000,
          }}
        >
          <button
            onClick={handleUploadClick}
            style={{
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
            }}
            className="bg-s py-2 px-2"
          >
            Upload Image
          </button>
          <button
            onClick={handleCameraClick}
            style={{
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
            }}
            className="bg-s py-2 px-2"
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

      {showCamera && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}
        >
          <video
            ref={videoRef}
            style={{ width: '300px', maxWidth: '90%' }}
            autoPlay
            playsInline
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <div
            style={{
              marginTop: '20px',
              display: 'flex',
              gap: '10px',
            }}
          >
            <button
              onClick={handleCapture}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: '#28a745',
                color: 'white',
                cursor: 'pointer',
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
                cursor: 'pointer',
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
