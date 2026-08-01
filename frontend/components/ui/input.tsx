import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface BaseFieldProps {
  label?: string;
  error?: string;
  hint?: string;
}

const fieldClasses = (error?: string) =>
  cn(
    "w-full rounded-xl border bg-transparent px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 dark:text-white",
    error
      ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20"
      : "border-slate-300 focus:border-brand-500 focus:ring-brand-500/20 dark:border-slate-700 dark:focus:border-brand-400"
  );

export const FieldWrapper = ({ label, error, hint, children }: BaseFieldProps & { children: React.ReactNode }) => (
  <div className="space-y-1.5">
    {label && (
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</label>
    )}
    {children}
    {error ? (
      <p className="text-xs text-red-500">{error}</p>
    ) : hint ? (
      <p className="text-xs text-slate-400">{hint}</p>
    ) : null}
  </div>
);

export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, BaseFieldProps {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, ...props }, ref) => (
    <FieldWrapper label={label} error={error} hint={hint}>
      <input ref={ref} className={cn(fieldClasses(error), className)} {...props} />
    </FieldWrapper>
  )
);
Input.displayName = "Input";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, BaseFieldProps {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, ...props }, ref) => (
    <FieldWrapper label={label} error={error} hint={hint}>
      <textarea ref={ref} className={cn(fieldClasses(error), "min-h-[100px]", className)} {...props} />
    </FieldWrapper>
  )
);
Textarea.displayName = "Textarea";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, BaseFieldProps {
  options?: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, className, options = [], children, ...props }, ref) => (
    <FieldWrapper label={label} error={error} hint={hint}>
      <select ref={ref} className={cn(fieldClasses(error), "cursor-pointer appearance-none pr-8", className)} {...props}>
        {options.length > 0
          ? options.map((option) => (
              <option key={option.value} value={option.value} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                {option.label}
              </option>
            ))
          : children}
      </select>
    </FieldWrapper>
  )
);
Select.displayName = "Select";

export const Checkbox = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { label?: string }
>(({ label, className, ...props }, ref) => (
  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
    <input
      ref={ref}
      type="checkbox"
      className={cn("h-4 w-4 cursor-pointer rounded border-slate-300 accent-brand-600", className)}
      {...props}
    />
    {label}
  </label>
));
Checkbox.displayName = "Checkbox";
