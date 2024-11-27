'use client';

import { useState, useEffect, ChangeEvent } from 'react';

interface Photo {
  name: string;
  url: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        console.error(error);
        alert('Failed to upload photo');
        return;
      }

      alert('Photo uploaded!');
      fetchPhotos();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload photo');
    }
  };

  const fetchPhotos = async () => {
    try {
      const response = await fetch('/api/photos');
      if (!response.ok) throw new Error('Failed to fetch photos');

      const data: Photo[] = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <div className="container">
      <h1 className="title">📸 Photo Sharing App</h1>

      <div className="upload-container">
        <input type="file" onChange={handleFileChange} className="file-input" />
        <button onClick={handleUpload} className="upload-button">
          Upload Photo
        </button>
      </div>

      <div>
        <h2 className="gallery-title">Photo Gallery</h2>
        <div className="gallery-container">
          {photos.map((photo) => (
            <div key={photo.name} className="photo-card">
              <img src={photo.url} alt={photo.name} className="photo" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
