import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from "react-hot-toast";
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/appSlice';
import { BASE_URL } from '../utils/constant';
import { UploadCloud, Image as ImageIcon, CheckCircle2, X } from 'lucide-react';

const PhotoUpload = ({ currentPhotoUrl }) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const inputRef = useRef(null);
    const dispatch = useDispatch();

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file (JPEG, PNG, etc.)');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be less than 5MB');
            return;
        }

        setSelectedFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => setPreviewUrl(e.target.result);
        reader.readAsDataURL(file);
    };

    const removeSelected = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        const toastId = toast.loading('Uploading photo...');

        const formData = new FormData();
        formData.append('photo', selectedFile);

        try {
            const res = await axios.post(`${BASE_URL}/profile/upload-photo`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Update Redux store with new user data
            dispatch(addUser(res.data));

            toast.success('Profile photo updated successfully!', { id: toastId });
            removeSelected(); // Clear selection after successful upload

        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || 'Failed to upload photo', { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    const displayUrl = previewUrl || currentPhotoUrl;

    return (
        <div className="w-full">
            <h3 className="text-lg font-medium text-white mb-4">Profile Photo</h3>

            <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Current/Preview Avatar */}
                <div className="shrink-0 flex flex-col items-center gap-3">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-500/30 bg-gray-800 shrink-0 relative group">
                        {displayUrl ? (
                            <img
                                src={displayUrl}
                                alt="Profile Preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                                <ImageIcon size={32} />
                            </div>
                        )}

                        {isUploading && (
                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center backdrop-blur-sm">
                                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mb-2" />
                                <span className="text-xs font-medium text-white">Uploading...</span>
                            </div>
                        )}
                    </div>

                    {selectedFile && !isUploading && (
                        <button
                            onClick={handleUpload}
                            className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full text-sm font-medium shadow-lg hover:shadow-pink-500/25 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <CheckCircle2 size={16} /> Save Photo
                        </button>
                    )}
                </div>

                {/* Upload Area */}
                <div className="flex-1 w-full">
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                        id="photo-upload"
                        disabled={isUploading}
                    />

                    <label
                        htmlFor="photo-upload"
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`
              flex flex-col items-center justify-center w-full h-40 
              border-2 border-dashed rounded-2xl cursor-pointer 
              transition-all duration-200 
              ${dragActive ? 'border-pink-500 bg-pink-500/10 scale-[1.02]' : 'border-gray-600 hover:border-pink-400/50 hover:bg-white/5'}
              ${isUploading ? 'opacity-50 pointer-events-none' : ''}
              ${selectedFile ? 'border-green-500/50 bg-green-500/5' : ''}
            `}
                    >
                        {selectedFile ? (
                            <div className="flex flex-col items-center text-center p-4">
                                <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-2">
                                    <CheckCircle2 size={20} />
                                </div>
                                <p className="text-sm font-medium text-green-400 mb-1 truncate max-w-[200px]">
                                    {selectedFile.name}
                                </p>
                                <button
                                    onClick={(e) => { e.preventDefault(); removeSelected(); }}
                                    className="text-xs text-gray-400 hover:text-white flex items-center gap-1 mt-1"
                                >
                                    <X size={12} /> Remove and pick another
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-center p-4">
                                <div className="w-12 h-12 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center mb-3 group-hover:bg-gray-700 transition-colors">
                                    <UploadCloud size={24} />
                                </div>
                                <p className="text-sm font-medium text-gray-200 mb-1">
                                    Click to upload <span className="text-gray-400 font-normal">or drag and drop</span>
                                </p>
                                <p className="text-xs text-gray-500">
                                    SVG, PNG, JPG or GIF (max. 5MB)
                                </p>
                            </div>
                        )}
                    </label>
                </div>
            </div>
        </div>
    );
};

export default PhotoUpload;
