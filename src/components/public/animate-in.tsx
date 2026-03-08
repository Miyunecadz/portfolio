"use client"
import { cn } from "@/lib/utils"
import { useInView } from "@/hooks/use-in-view"

interface AnimateInProps {
  children: React.ReactNode
  className?: string
  delay?: string // Tailwind delay class e.g. "delay-100", "delay-200"
}

export function AnimateIn({ children, className, delay }: AnimateInProps) {
  const { ref, isVisible } = useInView()

  return (
    <div
      ref={ref}
      className={cn(
        isVisible
          ? cn(
              "animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-forwards",
              delay
            )
          : "opacity-0",
        className
      )}
    >
      {children}
    </div>
  )
}
