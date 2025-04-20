import { cn } from "@/lib/utils";

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Heading({ children, className, level = 1 }: HeadingProps) {
  const baseStyles = "font-heading font-bold text-neutral-800";
  
  const sizeStyles = {
    1: "text-2xl md:text-3xl",
    2: "text-xl md:text-2xl",
    3: "text-lg md:text-xl",
    4: "text-base md:text-lg",
    5: "text-sm md:text-base",
    6: "text-xs md:text-sm",
  };

  const combinedStyles = cn(baseStyles, sizeStyles[level], className);

  switch (level) {
    case 1:
      return <h1 className={combinedStyles}>{children}</h1>;
    case 2:
      return <h2 className={combinedStyles}>{children}</h2>;
    case 3:
      return <h3 className={combinedStyles}>{children}</h3>;
    case 4:
      return <h4 className={combinedStyles}>{children}</h4>;
    case 5:
      return <h5 className={combinedStyles}>{children}</h5>;
    case 6:
      return <h6 className={combinedStyles}>{children}</h6>;
    default:
      return <h1 className={combinedStyles}>{children}</h1>;
  }
}
