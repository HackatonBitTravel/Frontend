import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "muted";
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size = "md", variant = "primary", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-8 w-8",
      lg: "h-12 w-12",
    };

    const variantClasses = {
      primary: "text-primary",
      secondary: "text-secondary",
      muted: "text-muted-foreground",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "animate-spin rounded-full border-2 border-solid border-current border-r-transparent",
            sizeClasses[size],
            variantClasses[variant]
          )}
          role="status"
        >
          <span className="sr-only">Chargement...</span>
        </div>
      </div>
    );
  }
);

LoadingSpinner.displayName = "LoadingSpinner";

export { LoadingSpinner };