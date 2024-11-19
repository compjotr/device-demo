import { Spinner } from "./Spinner";

type ButtonProps = {
  variant?: "primary" | "danger";
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  "aria-label"?: string;
  "data-testid"?: string;
  children: React.ReactNode;
  className?: string;
};

const ButtonComponent = ({
  variant = "primary",
  onClick,
  disabled,
  isLoading,
  children,
  "aria-label": ariaLabel,
  "data-testid": testId,
  className,
}: ButtonProps) => {
  const baseClass =
    "p-2 mt-4 text-white rounded focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2";
  const variantClasses = {
    primary:
      "bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed",
    danger: "bg-red-500 hover:bg-red-600",
  };

  return (
    <button
      className={`${baseClass} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      aria-label={ariaLabel}
      data-testid={testId}
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  );
};

export default ButtonComponent;
