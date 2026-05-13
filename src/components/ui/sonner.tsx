"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group font-sans"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-fg-1 group-[.toaster]:border-border-default group-[.toaster]:shadow-lg !rounded-2xl border-[0.5px]",
          title: "group-[.toast]:font-medium text-[14px]",
          description: "group-[.toast]:text-fg-3 text-[13px]",
          actionButton: "group-[.toast]:bg-brand-blue-500 group-[.toast]:text-white !rounded-full px-4 py-2",
          cancelButton: "group-[.toast]:bg-surface-alt group-[.toast]:text-fg-2 !rounded-full px-4 py-2",
          error: "group-[.toaster]:!bg-srm-danger-50 group-[.toaster]:!border-srm-danger-200 group-[.toaster]:!text-srm-danger-700",
          success: "group-[.toaster]:!bg-srm-success-50 group-[.toaster]:!border-srm-success-200 group-[.toaster]:!text-srm-success-700",
          warning: "group-[.toaster]:!bg-srm-warning-50 group-[.toaster]:!border-srm-warning-200 group-[.toaster]:!text-srm-warning-700",
          info: "group-[.toaster]:!bg-brand-blue-50 group-[.toaster]:!border-brand-blue-200 group-[.toaster]:!text-brand-blue-700",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
