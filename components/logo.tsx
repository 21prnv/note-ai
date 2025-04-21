import { Pencil } from "lucide-react"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="rounded-lg bg-primary p-2 text-primary-foreground">
        <Pencil className="h-6 w-6" />
      </div>
    </div>
  )
}
