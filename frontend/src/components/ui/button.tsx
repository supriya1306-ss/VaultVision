import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const buttonVariants = {
  default: "bg-primary text-white hover:bg-primary/90 shadow-[0_4px_15px_rgba(var(--primary),0.3)]",
  destructive: "bg-red-500 text-slate-50 hover:bg-red-500/90 shadow-sm",
  outline: "border border-white/10 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-100/80",
  ghost: "hover:bg-white/5 text-slate-400 hover:text-white",
  link: "text-slate-900 underline-offset-4 hover:underline dark:text-slate-50",
}

const sizeVariants = {
  default: "h-11 px-6 font-semibold",
  sm: "h-9 rounded-md px-3",
  lg: "h-14 rounded-xl px-10 text-lg font-bold",
  icon: "h-10 w-10 rounded-full",
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: keyof typeof buttonVariants
  size?: keyof typeof sizeVariants
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : motion.button
    
    // Default animation props for the motion component
    const motionProps = asChild ? {} : {
      whileHover: { y: -2, scale: 1.02 },
      whileTap: { scale: 0.96 },
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
          buttonVariants[variant],
          sizeVariants[size],
          className
        )}
        ref={ref}
        {...motionProps as any}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

