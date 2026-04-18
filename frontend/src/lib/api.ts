export const REGISTER_URL = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/register`
  : "http://localhost:8000/api/register";

export const DETECT_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/detect`
  : "http://localhost:8000/api/detect";

export async function uploadOfficialAsset(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(REGISTER_URL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Upload failed: ${res.statusText}`);
  }
  return res.json();
}

export async function detectSuspiciousAsset(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(DETECT_URL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Detection failed: ${res.statusText}`);
  }
  return res.json();
}
