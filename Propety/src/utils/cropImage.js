export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

export async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  // Set canvas dimensions
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // 1. Draw the blurred background
  ctx.save();
  ctx.filter = 'blur(40px) brightness(0.7)';
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  ctx.restore();

  // 2. Draw the cropped image onto the canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Return the cropped image as a Blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Canvas is empty');
        return reject(new Error('Canvas is empty'));
      }
      blob.name = 'cropped.jpeg';
      resolve(blob);
    }, 'image/jpeg', 0.9); // Adjust quality if needed
  });
}
