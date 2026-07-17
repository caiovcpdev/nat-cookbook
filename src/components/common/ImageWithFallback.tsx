import { ImageOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ImageWithFallback({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  const [error, setError] = useState(false);
  if (!src || error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-warm text-muted-foreground",
          className,
        )}
        aria-label={alt}
      >
        <ImageOff className="h-8 w-8 opacity-40" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
