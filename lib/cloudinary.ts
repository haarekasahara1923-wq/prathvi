import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export function getSignedUploadParams(folder: string, resourceType: "image" | "video" = "image") {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const paramsToSign = {
    timestamp,
    folder: `prathi/${folder}`,
    upload_preset: undefined as undefined,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    folder: `prathi/${folder}`,
  };
}

export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" = "image"
): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error("Failed to delete from Cloudinary:", error);
  }
}

export function getOptimizedUrl(url: string, width?: number, height?: number): string {
  if (!url || !url.includes("cloudinary.com")) return url;
  const transforms = ["f_auto", "q_auto"];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  transforms.push("c_fill");
  return url.replace("/upload/", `/upload/${transforms.join(",")}/`);
}
