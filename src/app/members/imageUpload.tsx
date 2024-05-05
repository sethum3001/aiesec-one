import React, { useState, ChangeEvent, FormEvent, useRef } from "react";

const ImageUploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to handle file selection
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to handle form submission
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedFile) {
      // You can implement the logic to upload the selected file here
      console.log("Uploading file:", selectedFile);
    } else {
      console.log("No file selected.");
    }
  };

  // Function to open file input dialog
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={openFileDialog}
          style={{ cursor: "pointer" }}
        >
          Select Image
        </button>
        <div style={{ marginTop: "10px" }}>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          )}
        </div>
        <button type="submit" style={{ marginTop: "10px" }}>
          Upload Image
        </button>
      </form>
    </div>
  );
};

export default ImageUploader;
