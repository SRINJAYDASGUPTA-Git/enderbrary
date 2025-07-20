'use client';

import { useState, useEffect, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface Props {
    onChange: (file: File | null) => void;
    previewUrl?: string;
}

export default function ImageUpload({ onChange, previewUrl }: Props) {
    const [preview, setPreview] = useState<string | null>(previewUrl || null);
    const dropRef = useRef<HTMLDivElement>(null);

    const handleFile = (file: File | null) => {
        if (!file) return;
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        onChange(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    const handlePaste = (e: ClipboardEvent) => {
        const file = e.clipboardData?.files?.[0];
        if (file) handleFile(file);
    };

    useEffect(() => {
        const ref = dropRef.current;
        if (!ref) return;

        ref.addEventListener('paste', handlePaste);
        return () => ref.removeEventListener('paste', handlePaste);
    }, []);

    return (
        <div
            ref={dropRef}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-purple-300 bg-purple-50 text-purple-600 rounded-lg cursor-pointer hover:bg-purple-100 transition"
            onClick={() => document.getElementById('hidden-file')?.click()}
        >
            <UploadCloud className="w-6 h-6 mb-2" />
            <p className="text-sm text-center">Click or drop/paste image here</p>
            <input
                id="hidden-file"
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                }}
            />

            {preview && (
                <div className="relative mt-4 w-32 h-32 rounded-md overflow-hidden border border-purple-300">
                    <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-cover"
                        sizes="128px"
                    />
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setPreview(null);
                            onChange(null);
                        }}
                        className="absolute top-1 right-1 bg-black/60 rounded-full p-1 text-white"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
