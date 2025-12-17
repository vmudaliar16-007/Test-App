export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,") for API usage if needed,
        // but typically we keep it for rendering.
        // For Gemini API, we often strip the prefix.
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const stripBase64Prefix = (base64: string): string => {
  return base64.replace(/^data:image\/[a-z]+;base64,/, "");
};

export const getMimeTypeFromBase64 = (base64: string): string => {
  const match = base64.match(/^data:(image\/[a-z]+);base64,/);
  return match ? match[1] : 'image/jpeg';
};
