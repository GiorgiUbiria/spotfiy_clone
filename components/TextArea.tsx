import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  className,
  disabled,
  ...props
}, ref) => {
  return (
    <textarea
      className={twMerge(`
        flex
        w-full
        rounded-md
        bg-gray-600
        border
        border-transparent
        px-3
        pt-3
        pb-14
        text-sm
        file:border-0
        file:bg-transparent
        file:text-sm
        file:font-medium
        placeholder:text-neutral-400
        disabled:cursor-not-allowed
        disabled:opacity-50
        focus:outline-none
      `, className)}
      disabled={disabled}
      ref={ref}
      {...props}
    />
  );
});

TextArea.displayName = "TextArea";

export default TextArea;
