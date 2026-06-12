import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload un fichier image vers Cloudinary et retourne son URL sécurisée.
 */
export async function uploadImage(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: 'activities', resource_type: 'image' }, (error, uploadResult) => {
        if (error || !uploadResult) return reject(error);
        resolve(uploadResult as { secure_url: string });
      })
      .end(buffer);
  });

  return result.secure_url;
}

export { cloudinary };
