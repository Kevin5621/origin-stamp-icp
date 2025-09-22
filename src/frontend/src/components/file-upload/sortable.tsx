"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from "@/components/ui/sortable";
import { CloudUpload, GripVertical, TriangleAlert, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: "uploading" | "completed" | "error";
  error?: string;
}

interface ImageUploadProps {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  className?: string;
  onImagesChange?: (images: ImageFile[]) => void;
}

export default function SortableImageUpload({
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept = "image/*",
  className,
  onImagesChange,
}: ImageUploadProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!file.type.startsWith("image/")) {
        return "File must be an image";
      }
      if (file.size > maxSize) {
        return `File size must be less than ${(maxSize / 1024 / 1024).toFixed(1)}MB`;
      }
      if (images.length >= maxFiles) {
        return `Maximum ${maxFiles} files allowed`;
      }
      return null;
    },
    [maxSize, maxFiles, images.length],
  );

  const simulateUpload = useCallback((imageFile: ImageFile) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        setImages((prev) =>
          prev.map((img) =>
            img.id === imageFile.id
              ? { ...img, progress: 100, status: "completed" as const }
              : img,
          ),
        );
      } else {
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageFile.id ? { ...img, progress } : img,
          ),
        );
      }
    }, 100);
  }, []);

  const addImages = useCallback(
    (files: FileList | File[]) => {
      const newImages: ImageFile[] = [];
      const newErrors: string[] = [];

      Array.from(files).forEach((file) => {
        const error = validateFile(file);
        if (error) {
          newErrors.push(`${file.name}: ${error}`);
          return;
        }

        const imageFile: ImageFile = {
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
          status: "uploading",
        };

        newImages.push(imageFile);
      });

      if (newErrors.length > 0) {
        setErrors((prev) => [...prev, ...newErrors]);
      }

      if (newImages.length > 0) {
        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);
        onImagesChange?.(updatedImages);

        // Simulate upload progress
        newImages.forEach((imageFile) => {
          simulateUpload(imageFile);
        });
      }
    },
    [images, onImagesChange, simulateUpload, validateFile],
  );

  const removeImage = useCallback(
    (id: string) => {
      const updatedImages = images.filter((img) => img.id !== id);

      // Revoke URL for removed image
      const removedImage = images.find((img) => img.id === id);
      if (removedImage) {
        URL.revokeObjectURL(removedImage.preview);
      }

      setImages(updatedImages);
      onImagesChange?.(updatedImages);
    },
    [images, onImagesChange],
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        addImages(files);
      }
    },
    [addImages],
  );

  const openFileDialog = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = accept;
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        addImages(target.files);
      }
    };
    input.click();
  }, [accept, addImages]);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleReorder = useCallback(
    (newOrder: string[]) => {
      const reorderedImages = newOrder
        .map((id) => images.find((img) => img.id === id))
        .filter((img): img is ImageFile => img !== undefined);

      setImages(reorderedImages);
      onImagesChange?.(reorderedImages);
    },
    [images, onImagesChange],
  );

  // Clean up URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [images]);

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Upload Area */}
      <Card
        className={cn(
          "border-dashed shadow-none transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <CardContent className="py-8 text-center">
          <div className="border-border mx-auto mb-4 flex size-16 items-center justify-center rounded-full border">
            <CloudUpload className="size-8" />
          </div>
          <h3 className="text-foreground mb-2 text-lg font-semibold">
            Upload Your Photos
          </h3>
          <p className="text-muted-foreground mb-4 text-sm">
            Choose images or drag & drop them here (max {maxFiles} files,{" "}
            {formatBytes(maxSize)} each)
          </p>
          <Button onClick={openFileDialog} variant="outline">
            Choose Files
          </Button>
        </CardContent>
      </Card>

      {/* Sortable Images Grid */}
      {images.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-foreground text-sm font-medium">
              Selected Photos ({images.length}/{maxFiles})
            </h4>
            <p className="text-muted-foreground text-xs">
              Drag to reorder upload priority
            </p>
          </div>

          <Sortable
            value={images.map((img) => img.id)}
            onValueChange={handleReorder}
            getItemValue={(id) => id}
            strategy="grid"
            className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
          >
            {images.map((image, index) => (
              <SortableItem key={image.id} value={image.id}>
                <div className="bg-muted group relative overflow-hidden rounded-lg border">
                  <div className="relative aspect-square">
                    <Image
                      src={image.preview}
                      alt={image.file.name}
                      fill
                      className="object-contain"
                    />

                    {/* Upload order badge */}
                    <div className="bg-primary text-primary-foreground absolute left-2 top-2 flex size-6 items-center justify-center rounded-full text-xs font-bold">
                      {index + 1}
                    </div>

                    {/* Drag handle */}
                    <SortableItemHandle className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="size-6"
                      >
                        <GripVertical className="size-3" />
                      </Button>
                    </SortableItemHandle>

                    {/* Remove button */}
                    <Button
                      onClick={() => removeImage(image.id)}
                      variant="destructive"
                      size="icon"
                      className="absolute bottom-2 right-2 size-6 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <XIcon className="size-3" />
                    </Button>

                    {/* Progress overlay for uploading files */}
                    {image.status === "uploading" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="text-center text-white">
                          <p className="mb-1 text-xs">Uploading...</p>
                          <Progress value={image.progress} className="w-16" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* File info */}
                  <div className="p-2">
                    <p className="text-foreground truncate text-xs font-medium">
                      {image.file.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {formatBytes(image.file.size)}
                    </p>
                  </div>
                </div>
              </SortableItem>
            ))}
          </Sortable>
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertIcon>
            <TriangleAlert className="size-4" />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>Upload errors</AlertTitle>
            <AlertDescription>
              {errors.map((error) => (
                <p key={error} className="text-sm">
                  {error}
                </p>
              ))}
            </AlertDescription>
          </AlertContent>
        </Alert>
      )}
    </div>
  );
}
