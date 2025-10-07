"use client";

import { Upload } from "lucide-react";
import React, { useState, useCallback } from "react";

interface FilePickerProps {
  title: string;
  accept: string[];
  multiple?: boolean;
  disabled?: boolean;
  onChange: (files: FileList | null) => void;
}

const FilePicker: React.FC<FilePickerProps> = ({
  title,
  multiple,
  disabled,
  accept,
  onChange,
}) => {
  const inputId = `file-input-${title.replace(/\s+/g, "-").toLowerCase()}`;
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      setDragOver(false);
      const files = e.dataTransfer.files;

      if (files && files.length > 0) {
        const acceptedSet = new Set(accept);

        const validFiles = Array.from(files).filter((file) =>
          acceptedSet.has(file.type)
        );

        if (validFiles.length > 0) {
          setSelectedFile(validFiles[0].name);
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(validFiles[0]);
          onChange(dataTransfer.files);
        } else {
          alert("File type not accepted.");
        }
      }
    },
    [accept, onChange]
  );

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      setSelectedFile(files[0].name);
    } else {
      setSelectedFile(null);
    }
    onChange(files);
  };

  return (
    <div
      className={`w-full bg-white p-[40px] rounded-[4px] ${
        disabled && "select-none opacity-70"
      }`}
    >
      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex flex-col gap-4 justify-center items-center text-sm font-medium text-gray-700 mb-1 border-2 ${
          dragOver ? "border-blue-500 bg-blue-50" : "border-none"
        } p-6 rounded-lg  transition-colors`}
      >
        <Upload className="text-gray-500" />
        <h2 className="text-[20px]">{title}</h2>

        <div className="text-[#a8a8a8] text-xs flex items-center gap-1 font-[500]">
          {accept.map((type, idx) => {
            const mimeToExt: Record<string, string> = {
              "image/png": "png",
              "image/jpeg": "jpeg",
              "text/plain": "txt",
              "application/pdf": "pdf",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                "docx",
            };
            const ext = mimeToExt[type] || type.split("/")[1] || "unknown";
            return (
              <p key={idx}>
                {ext}
                {idx !== accept.length - 1 && ","}
              </p>
            );
          })}
        </div>

        {selectedFile && (
          <p className="text-[#a8a8a8]text-xs font-medium mt-2">
            Selected File: <span className="font-semibold">{selectedFile}</span>
          </p>
        )}
      </label>

      <input
        id={inputId}
        type="file"
        accept={accept.join(",")}
        hidden
        multiple={multiple}
        onChange={(e) => handleFileChange(e.target.files)}
        disabled={disabled}
      />
    </div>
  );
};

export default FilePicker;
