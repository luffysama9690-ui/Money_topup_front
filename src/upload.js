// src/upload.js
// Uploads an image straight from the browser to Cloudinary's free image
// hosting, using an "unsigned upload preset" (safe to expose publicly —
// it can only accept uploads, not delete/manage anything).
//
// Needs two environment variables (set in Vercel's Project Settings):
//   VITE_CLOUDINARY_CLOUD_NAME   — your Cloudinary "Cloud name"
//   VITE_CLOUDINARY_UPLOAD_PRESET — the unsigned upload preset name you create
//
// Returns the uploaded image's public URL (a string), or throws if it fails.
export async function uploadImage(file) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary is not configured yet — set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Image upload failed");
  }

  const data = await res.json();
  return data.secure_url;
}
