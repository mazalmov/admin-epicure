
import axios from 'axios';

export const uploadFileToS3 = async (file: File): Promise<string> => {
  try {
    const { data } = await axios.post(`http://localhost:3000/s3/upload-url`, {
    //   fileName: file.name,
      fileName: encodeURIComponent(file.name),
      fileType: file.type,
    });

    const uploadUrl = data.uploadUrl;

    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });

    const imageUrl = uploadUrl.split('?')[0];
    return imageUrl;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error('Failed to upload file to S3');
  }
};

