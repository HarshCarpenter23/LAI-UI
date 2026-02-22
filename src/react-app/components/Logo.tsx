import { Scale, Wind } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 20, text: "text-lg" },
    md: { icon: 28, text: "text-2xl" },
    lg: { icon: 40, text: "text-4xl" },
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-indigo-600 shadow-lg">
          <Scale
            size={sizes[size].icon}
            className="text-white"
            strokeWidth={2.5}
          />
          <Wind
            size={sizes[size].icon * 0.5}
            className="absolute -top-1 -right-1 text-primary"
          />
        </div>
      </div>
      {showText && (
        <span className={`font-bold tracking-tight ${sizes[size].text}`}>
          <span className="text-gradient">LAI</span>
        </span>
      )}
    </div>
  );
}
