"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Icon from "./icon";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Modal({ open, onOpenChange, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [open]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Custom Blue Gradient Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 bg-brand-blue-900/20 backdrop-blur-md bg-gradient-to-br from-brand-blue-500/10 to-transparent"
            onClick={() => onOpenChange(false)}
            aria-hidden="true"
          />

          {/* Modal Content Wrapper */}
          <div className="relative z-50 w-full max-w-lg">
            {children}
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export const ModalContent = React.forwardRef<
  HTMLDivElement,
  import("framer-motion").HTMLMotionProps<"div"> & { onClose?: () => void; children?: React.ReactNode }
>(({ className, children, onClose, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0, scale: 0.96, y: 16 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.96, y: 16 }}
    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
    className={cn(
      "relative flex w-full flex-col overflow-hidden rounded-2xl bg-white border-[0.5px] border-border-default shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)]",
      className
    )}
    {...props}
  >
    {onClose && (
      <button
        onClick={onClose}
        className="absolute right-5 top-5 rounded-full p-1.5 cursor-pointer text-srm-danger-500 transition-colors hover:bg-srm-danger-50 hover:text-srm-danger-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-srm-danger-500"
      >
        <Icon name="x" size={18} stroke={2.5} />
      </button>
    )}
    {children}
  </motion.div>
));
ModalContent.displayName = "ModalContent";

export const ModalHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 p-6 pb-4", className)} {...props} />
);
ModalHeader.displayName = "ModalHeader";

export const ModalTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={cn("text-xl font-semibold tracking-tight text-fg-1", className)} {...props} />
);
ModalTitle.displayName = "ModalTitle";

export const ModalDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-fg-3", className)} {...props} />
);
ModalDescription.displayName = "ModalDescription";

export const ModalFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center justify-end gap-3 border-t border-border-subtle bg-surface-alt/30 p-6", className)} {...props} />
);
ModalFooter.displayName = "ModalFooter";
