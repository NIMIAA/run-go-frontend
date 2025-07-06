"use client";
import { useState, useRef } from "react";
import { CameraIcon, XMarkIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { uploadProfileImage } from "@/app/utils/api";
import Notification from "@/app/components/ui/Notification";
import ProfileAvatar from "./ProfileAvatar";
import { User } from "@/app/utils/auth";

interface ProfileImageUploadProps {
    currentImageUrl?: string;
    onImageUpload: (imageUrl: string) => void;
    onImageRemove: () => void;
    userId: string;
    user: User | null;
}

export default function ProfileImageUpload({
    currentImageUrl,
    onImageUpload,
    onImageRemove,
    userId,
    user
}: ProfileImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<{
        type: 'success' | 'error';
        message: string;
        isVisible: boolean;
    }>({
        type: 'success',
        message: '',
        isVisible: false
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): boolean => {
        // Check file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setError('Please select a valid image file (JPG, PNG, GIF, WebP)');
            return false;
        }

        // Check file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            setError('Image file must be smaller than 5MB');
            return false;
        }

        setError(null);
        return true;
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!validateFile(file)) {
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        const file = fileInputRef.current?.files?.[0];
        if (!file) {
            setError('Please select a file to upload');
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const response = await uploadProfileImage(file);
            if (response.success && response.data?.imageUrl) {
                const fullImageUrl = `http://localhost:5000${response.data.imageUrl}`;
                onImageUpload(fullImageUrl);
                setPreviewUrl(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                setNotification({
                    type: 'success',
                    message: 'Profile image uploaded successfully!',
                    isVisible: true
                });
            } else {
                setNotification({
                    type: 'error',
                    message: 'Upload failed. Please try again.',
                    isVisible: true
                });
            }
        } catch (error: any) {
            setNotification({
                type: 'error',
                message: error.message || 'Upload failed. Please try again.',
                isVisible: true
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setPreviewUrl(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onImageRemove();
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');

        const file = e.dataTransfer.files[0];
        if (file && fileInputRef.current) {
            fileInputRef.current.files = e.dataTransfer.files;
            handleFileSelect({ target: { files: e.dataTransfer.files } } as any);
        }
    };

    return (
        <div className="space-y-4">
            {/* Current Profile Image */}
            <div className="relative inline-block">
                <ProfileAvatar
                    user={user}
                    profileImageUrl={currentImageUrl}
                    size="xl"
                />

                {/* Camera Icon */}
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                    <CameraIcon className="h-4 w-4 text-gray-600" />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </label>

                {/* Remove Button */}
                {currentImageUrl && (
                    <button
                        onClick={handleRemoveImage}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                        title="Remove photo"
                    >
                        <XMarkIcon className="h-3 w-3" />
                    </button>
                )}
            </div>

            {/* Upload Area */}
            {previewUrl && (
                <div className="space-y-4">
                    {/* Preview */}
                    <div className="text-center">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
                        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-lg">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Upload Button */}
                    <div className="flex gap-2 justify-center">
                        <button
                            onClick={handleUpload}
                            disabled={isUploading}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {isUploading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <ArrowUpTrayIcon className="h-4 w-4" />
                                    Upload Image
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setPreviewUrl(null);
                                setError(null);
                                if (fileInputRef.current) {
                                    fileInputRef.current.value = '';
                                }
                            }}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Drag and Drop Area */}
            {!previewUrl && (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <ArrowUpTrayIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                        Click to select or drag and drop an image here
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        JPG, PNG, GIF, WebP up to 5MB
                    </p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Notification */}
            <Notification
                type={notification.type}
                message={notification.message}
                isVisible={notification.isVisible}
                onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
            />
        </div>
    );
} 