import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { formatSize } from "../lib/utils"

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null
        onFileSelect?.(file)
    }, [onFileSelect])

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        acceptedFiles
    } = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf'] },
        maxSize: 20 * 1024 * 1024
    })

    const file = acceptedFiles[0]

    return (
        <div className="w-full gradient-border">
            <div
                {...getRootProps()}
                className={`
          rounded-2xl
          bg-white
          p-6
          cursor-pointer
          transition-all
          border border-dashed
          ${isDragActive
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'}
        `}
            >
                <input {...getInputProps()} />

                {/* FILE SELECTED */}
                {file ? (
                    <div
                        className="uploader-selected-file"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-4 min-w-0">
                            <img
                                src="/images/pdf.png"
                                alt="pdf"
                                className="w-10 h-10 shrink-0"
                            />

                            <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">
                                    {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatSize(file.size)}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="p-2 rounded-full hover:bg-gray-200 transition"
                            onClick={(e) => {
                                e.stopPropagation()
                                onFileSelect?.(null)
                            }}
                        >
                            <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    /* EMPTY STATE */
                    <div className="flex flex-col items-center text-center gap-2">
                        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-purple-50">
                            <img src="/icons/info.svg" alt="upload" className="w-7 h-7" />
                        </div>

                        <p className="text-sm text-gray-700">
                            <span className="font-semibold text-purple-600">
                                Click to upload
                            </span>{' '}
                            or drag and drop
                        </p>

                        <p className="text-xs text-gray-500">
                            PDF only • Max 20 MB
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FileUploader
