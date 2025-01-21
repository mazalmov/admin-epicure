import React, { useState } from 'react';

const MAX_SIZE = 5 * 1024 * 1024; // גודל קובץ מקסימלי (5MB)

const ImageUploader = ({ uploadImageToS3 }: { uploadImageToS3: (file: File) => Promise<string> }) => {
  const [formData, setFormData] = useState<any>({});
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/') || file.size > MAX_SIZE) {
        setErrorMessage('Please upload a valid image file smaller than 5MB');
        return;
      }
      try {
        setErrorMessage('');
        console.log('file',file);
        
        setIsUploading(true);

        const imageUrl = await uploadImageToS3(file); 
        console.log('imageUrl',imageUrl);
        setFormData((prevData: any) => ({
          ...prevData,
          image: imageUrl, 
        }));
      } catch (error) {
        console.error('Error uploading image:', error);
        setErrorMessage('Failed to upload image. Please try again.');
      } finally {
        setIsUploading(false);
        event.target.value = ''; 
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      // בדיקה אם זה קובץ תקין
      if (!file.type.startsWith('image/') || file.size > MAX_SIZE) {
        setErrorMessage('Please upload a valid image file smaller than 5MB');
        return;
      }
      try {
        setErrorMessage('');
        setIsUploading(true);
        const imageUrl = await uploadImageToS3(file); // העלאה ל-S3
        setFormData((prevData: any) => ({
          ...prevData,
          image: imageUrl, // שמירת ה-URL מהשרת
        }));
      } catch (error) {
        console.error('Error uploading image:', error);
        setErrorMessage('Failed to upload image. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div>
      <label style={{ display: 'block', fontWeight: 'bold' }}>Image:</label>
      <div
        style={{
          border: '2px dashed #ccc',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer',
          position: 'relative',
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById('imageUpload')?.click()}
      >
        {isUploading ? (
          <p>Uploading...</p>
        ) : formData.image ? (
          <img
            src={formData.image.startsWith('http') ? formData.image : URL.createObjectURL(formData.image)}
            alt="preview"
            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
          />
        ) : (
          <p>Drag and drop an image here, or click to select</p>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
          id="imageUpload"
        />
      </div>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default ImageUploader;
