import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-white aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#8B5CF6] to-[#2563EB] text-white hover:opacity-90 shadow-sm",
        destructive:
          "bg-[#E11D48] text-white hover:bg-[#BE123C] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-[#E2E8F0] bg-white text-[#111827] hover:bg-[#F8FAFC] shadow-sm",
        secondary:
          "bg-[#F1F5F9] text-[#111827] hover:bg-[#E2E8F0]",
        ghost:
          "bg-transparent text-[#475569] hover:bg-[#F1F5F9] hover:text-[#111827]",
        link: "text-[#7C3AED] underline-offset-4 hover:underline",
        sidebar:
          "bg-transparent text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#111827] transition-none",
        sidebarOutline:
          "bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20 hover:bg-[#7C3AED]/15 transition-none",
        locked:
          "bg-[#F1F5F9] text-[#94A3B8] border border-[#E2E8F0]",
        completed:
          "bg-gradient-to-r from-[#8B5CF6] to-[#2563EB] text-white shadow-sm hover:opacity-90",
      },
      size: {
        default: "h-[48px] min-h-[48px] px-4 py-2 has-[>svg]:px-3",
        sm: "h-[40px] min-h-[40px] rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-[52px] min-h-[52px] rounded-md px-6 has-[>svg]:px-4",
        icon: "size-[48px] min-w-[48px]",
        "icon-sm": "size-[40px] min-w-[40px]",
        "icon-lg": "size-[52px] min-w-[52px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
