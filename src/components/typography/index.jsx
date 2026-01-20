import { cn } from "@/lib/utils";

const typographyVariants = {
  h1: "text-4xl font-bold leading-tight",
  h2: "text-3xl font-semibold leading-snug",
  h3: "text-2xl font-semibold leading-normal",
  h4: "text-xl font-medium leading-relaxed",
  h5: "text-lg font-medium leading-loose",
  h6: "text-base font-medium leading-loose",
  p: "text-base leading-relaxed",
  blockquote: "border-l-4 pl-4 italic text-lg text-gray-600 leading-snug",
  default: "text-sm leading-tight",
  small: "text-xs leading-tight",
  lead: "text-lg text-gray-700 leading-loose",
  muted: "text-sm text-gray-400 leading-tight",
};

const Typography = ({ variant = "default", className, children, ...props }) => {
  return (
    <p className={cn(typographyVariants[variant], className)} {...props}>
      {children}
    </p>
  );
};

export default Typography;
