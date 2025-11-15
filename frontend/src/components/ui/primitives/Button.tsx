import { ButtonHTMLAttributes, ReactNode } from "react";
import classnames from "classnames";
import { icons, LucideProps } from "lucide-react";

export type ButtonIconsNames = keyof typeof icons;
export type ButtonIcons = {
  name: ButtonIconsNames;
} & LucideProps;

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "ghost"
  | "link";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Use outlined style instead of filled */
  outlined?: boolean;
  /** Full width button */
  fullWidth?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Icon to display before children */
  startIcon?: ReactNode | ButtonIcons;
  /** Icon to display after children */
  endIcon?: ReactNode | ButtonIcons;
  /** Children content */
  children?: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

const isLucideIcon = (icon: ReactNode | ButtonIcons): icon is ButtonIcons => {
  return icon !== null && typeof icon === "object" && "name" in icon;
};

const renderIcon = (icon: ReactNode | ButtonIcons): ReactNode => {
  if (isLucideIcon(icon)) {
    const { name, ...iconProps } = icon;
    const LucideIcon = icons[name];
    return <LucideIcon {...iconProps} />;
  }
  return icon;
};

const baseStyles =
  "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer leading-none";

const sizeStyles: Record<ButtonSize, string> = {
  xs: "px-2 py-1 text-xs gap-1",
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2 text-base gap-2",
  lg: "px-5 py-2.5 text-lg gap-2.5",
  xl: "px-6 py-3 text-xl gap-3",
};

const variantStyles: Record<
  ButtonVariant,
  { filled: string; outlined: string }
> = {
  primary: {
    filled:
      "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 dark:active:bg-blue-700",
    outlined:
      "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100 focus:ring-blue-500 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950 dark:active:bg-blue-900",
  },
  secondary: {
    filled:
      "bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800 focus:ring-gray-500 dark:bg-gray-500 dark:hover:bg-gray-600 dark:active:bg-gray-700",
    outlined:
      "border-2 border-gray-600 text-gray-600 hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-500 dark:border-gray-400 dark:text-gray-400 dark:hover:bg-gray-800 dark:active:bg-gray-700",
  },
  success: {
    filled:
      "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus:ring-green-500 dark:bg-green-500 dark:hover:bg-green-600 dark:active:bg-green-700",
    outlined:
      "border-2 border-green-600 text-green-600 hover:bg-green-50 active:bg-green-100 focus:ring-green-500 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-950 dark:active:bg-green-900",
  },
  danger: {
    filled:
      "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600 dark:active:bg-red-700",
    outlined:
      "border-2 border-red-600 text-red-600 hover:bg-red-50 active:bg-red-100 focus:ring-red-500 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-950 dark:active:bg-red-900",
  },
  warning: {
    filled:
      "bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700 focus:ring-yellow-400 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:active:bg-yellow-800",
    outlined:
      "border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 active:bg-yellow-100 focus:ring-yellow-400 dark:border-yellow-400 dark:text-yellow-400 dark:hover:bg-yellow-950 dark:active:bg-yellow-900",
  },
  info: {
    filled:
      "bg-cyan-600 text-white hover:bg-cyan-700 active:bg-cyan-800 focus:ring-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:active:bg-cyan-700",
    outlined:
      "border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50 active:bg-cyan-100 focus:ring-cyan-500 dark:border-cyan-400 dark:text-cyan-400 dark:hover:bg-cyan-950 dark:active:bg-cyan-900",
  },
  ghost: {
    filled:
      "bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-400 dark:text-gray-200 dark:hover:bg-gray-800 dark:active:bg-gray-700",
    outlined:
      "border-2 border-transparent text-gray-700 hover:border-gray-300 hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-400 dark:text-gray-200 dark:hover:border-gray-600 dark:hover:bg-gray-800 dark:active:bg-gray-700",
  },
  link: {
    filled:
      "bg-transparent text-blue-600 hover:text-blue-800 hover:underline active:text-blue-900 focus:ring-blue-500 dark:text-blue-400 dark:hover:text-blue-300",
    outlined:
      "bg-transparent text-blue-600 hover:text-blue-800 hover:underline active:text-blue-900 focus:ring-blue-500 dark:text-blue-400 dark:hover:text-blue-300",
  },
};

export default function Button({
  variant = "primary",
  size = "md",
  outlined = false,
  fullWidth = false,
  loading = false,
  startIcon,
  endIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const variantStyle = outlined
    ? variantStyles[variant].outlined
    : variantStyles[variant].filled;

  // Calculate padding balance: add extra padding to the side without an icon
  const hasStartIcon = !loading && startIcon;
  const hasEndIcon = !loading && endIcon;
  const hasChildren = !!children;

  const needsStartPadding = hasChildren && !hasStartIcon && hasEndIcon;
  const needsEndPadding = hasChildren && hasStartIcon && !hasEndIcon;

  return (
    <button
      className={classnames(
        baseStyles,
        sizeStyles[size],
        variantStyle,
        {
          "w-full": fullWidth,
          "cursor-wait": loading,
          "pl-[1.25em]": needsStartPadding,
          "pr-[1.25em]": needsEndPadding,
        },
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      <span className="inline-flex items-center gap-[inherit]">
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && startIcon && (
          <span className="inline-flex">{renderIcon(startIcon)}</span>
        )}
        {children && (
          <span className="leading-none translate-y-[-0.05em]">{children}</span>
        )}
        {!loading && endIcon && (
          <span className="inline-flex">{renderIcon(endIcon)}</span>
        )}
      </span>
    </button>
  );
}
