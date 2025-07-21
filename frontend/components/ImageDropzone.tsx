'use client';

import { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

export default function ImageDropzone({
                                          onFileAccepted,
                                          previewUrl,
                                      }: {
    onFileAccepted: (file: File) => void;
    previewUrl?: string;
}) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            onFileAccepted(acceptedFiles[0]);
        }
    }, [onFileAccepted]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false,
        accept: {
            'image/*': [],
        },
    });

    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const item = e.clipboardData?.items[0];
            if (item?.type.startsWith('image')) {
                const file = item.getAsFile();
                if (file) onFileAccepted(file);
            }
        };
        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, [onFileAccepted]);

    return (
        <div
            {...getRootProps()}
            className="w-full border-2 border-dashed border-purple-300 p-4 rounded-lg text-center cursor-pointer bg-purple-50 hover:bg-purple-100 transition"
        >
            <input {...getInputProps()} />
            {previewUrl ? (
                <Image src={previewUrl} alt="Cover preview" width={200} height={300} className="mx-auto rounded-md max-h-90" />
            ) : (
                <p className="text-sm text-purple-700">Drag & drop an image, or paste it here</p>
            )}
        </div>
    );
}
