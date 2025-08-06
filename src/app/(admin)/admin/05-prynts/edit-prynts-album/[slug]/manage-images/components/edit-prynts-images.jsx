"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addImagesToPryntAction, removeImagesFromPryntAction } from "@/app/(admin)/action";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, AlertCircle, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export default function EditPryntImages({ prynt, initialImages }) {
  const router = useRouter();
  const [existingImages, setExistingImages] = useState(initialImages);
  const [newFiles, setNewFiles] = useState([]);
  const [selectedImageIds, setSelectedImageIds] = useState(new Set());
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      newFiles.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [newFiles]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const mappedFiles = files.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }));
      setNewFiles(prev => [...prev, ...mappedFiles]);
    }
  };

  const handleRemoveNewFile = (fileToRemove) => {
    setNewFiles(newFiles.filter(file => file !== fileToRemove));
    URL.revokeObjectURL(fileToRemove.preview);
  };

  const toggleImageSelection = (imageId) => {
    setSelectedImageIds(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(imageId)) {
        newSelection.delete(imageId);
      } else {
        newSelection.add(imageId);
      }
      return newSelection;
    });
  };

  const handleBatchDelete = async () => {
    const idsToDelete = Array.from(selectedImageIds);
    if (idsToDelete.length === 0) return;

    // Optimistically remove from UI
    setExistingImages(current => current.filter(img => !idsToDelete.includes(img.id)));
    setSelectedImageIds(new Set());
    setError(null);

    const result = await removeImagesFromPryntAction(idsToDelete, prynt.id, prynt.album_id);
    
    if (!result.success) {
      setError(result.message);
      router.refresh(); 
    }
  };
  
  const handleSaveUploads = async () => {
    if (newFiles.length === 0) return;
    
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData();
    newFiles.forEach(file => formData.append("images", file));
    
    const result = await addImagesToPryntAction(prynt.id, prynt.album_id, formData);

    if (result.success) {
      setNewFiles([]);
      router.refresh();
    } else {
      setError(result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
            <div>
                <h2 className="text-xl font-bold mb-1">Manage Images</h2>
                <p className="text-muted-foreground">Album: <span className="font-semibold text-foreground">{prynt.title}</span></p>
            </div>
            <div className="flex gap-2">
                {selectedImageIds.size > 0 && (
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete ({selectedImageIds.size})
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete {selectedImageIds.size} image(s). This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleBatchDelete}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
                {newFiles.length > 0 && (
                    <Button onClick={handleSaveUploads} disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : `Save ${newFiles.length} New Image(s)`}
                    </Button>
                )}
            </div>
        </div>

        {error && (
            <div className="flex items-center gap-2 text-sm text-destructive mb-4">
                <AlertCircle className="h-4 w-4" />
                <p>{error}</p>
            </div>
        )}

        <div className="flex-1 overflow-y-auto rounded-lg border p-4 min-h-[400px]">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept="image/*" />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-muted-foreground/20 hover:border-primary transition-colors text-muted-foreground"
                >
                    <UploadCloud className="h-6 w-6" />
                    <span className="text-xs">Add Images</span>
                </button>

                {newFiles.map((file, index) => (
                    <div key={`new-${index}`} className="relative aspect-square group border-2 border-primary rounded-md">
                        <Image src={file.preview} alt={file.name} fill className="object-cover rounded-sm p-1" />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 rounded-full z-10"
                            onClick={() => handleRemoveNewFile(file)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                
                {existingImages.map((image) => (
                    <div
                        key={image.id}
                        className={cn(
                            "relative aspect-square group cursor-pointer rounded-md overflow-hidden",
                            selectedImageIds.has(image.id) && "ring-2 ring-destructive ring-offset-2"
                        )}
                        onClick={() => toggleImageSelection(image.id)}
                    >
                        <Image src={image.publicUrl} alt={image.title} fill className="object-cover" />
                        <div className={cn(
                            "absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity",
                            selectedImageIds.has(image.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        )}>
                            <CheckCircle className="h-8 w-8 text-white" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}

// You might need this icon in your project if it's not already there
function CheckCircle(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}