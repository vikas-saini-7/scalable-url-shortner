"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

const Toast = React.forwardRef(({ className, variant, onClose, title, description, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border border-default bg-bg-card p-6 pr-8 shadow-lg transition-all",
                variant === "destructive" && "border-red-500/50 text-red-400",
                className
            )}
            {...props}
        >
            <div className="grid gap-1">
                {title && <div className="text-sm font-semibold">{title}</div>}
                {description && (
                    <div className="text-sm opacity-90">{description}</div>
                )}
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute right-2 top-2 rounded-md p-1 text-text-muted opacity-0 transition-opacity hover:text-text-primary group-hover:opacity-100"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    )
})
Toast.displayName = "Toast"

export { Toast }
