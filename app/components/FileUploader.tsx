import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {formatSize} from "~/lib/utils";

interface FileUploaderProps {
    onFileSelected?: (file: File | null) => void
}

const FileUploader = ({onFileSelected} : FileUploaderProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;
        setSelectedFile(file);
        onFileSelected?.(file);
    }, [onFileSelected]);

    const {getRootProps, getInputProps} = useDropzone({
        onDrop,
        multiple: false,
        accept: {"application/pdf": [".pdf"]},
        maxSize: 20 * 1024 * 1024
    });

    return (
       <div className="w-full gradient-border">
           <div {...getRootProps()}>
               <input {...getInputProps()} />
               <div className="space-y-4 cursor-pointer">
                   {
                       selectedFile ? (
                           <div className="uploader-selected-file" onClick={(e) => e.stopPropagation()}>
                               <img src="/images/pdf.png" alt="pdf" className="size-10"/>
                               <div className="flex items-center space-x-3">
                                   <div>
                                       <p className="text-sm text-gray-700 font-medium truncate max-w-xs">{selectedFile.name}</p>
                                       <p className="text-sm text-gray-700">{formatSize(selectedFile.size)}</p>
                                   </div>
                               </div>
                               <button
                                   type="button"
                                   className="p-2 cursor-pointer"
                                   onClick={() => {
                                       setSelectedFile(null);
                                       onFileSelected?.(null);
                                   }}
                               >
                                   <img src="/icons/cross.svg" alt="close" className="w-4 h-4"/>
                               </button>
                           </div>
                       ) : (
                           <div>
                               <div className="w-16 h16 mx-auto items-center justify-center flex mb-2">
                                   <img src="/icons/info.svg" alt="Upload icon" className="size-20"/>
                               </div>
                               <p className="text-lg text-gray-500">
                                   <span className="font-semibold">Click to upload</span> or drag and drop
                               </p>
                               <p className="text-lg text-gray-500">PDF ( Max 20 MB)</p>
                           </div>
                       )
                   }
               </div>
           </div>
       </div>
    )
};

export default FileUploader;