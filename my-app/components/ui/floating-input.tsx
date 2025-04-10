"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { User, Lock } from "lucide-react";

interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: "user" | "lock";
}

export function FloatingInput({ label, icon, ...props }: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    props.onChange?.(e);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          {...props}
          className={cn(
            "w-full h-12 px-10 bg-transparent border-b-2 border-white/50 text-white placeholder-transparent focus:outline-none focus:border-white transition-all duration-200",
            props.className
          )}
          placeholder={label}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          onChange={handleChange}
        />
        <label
          className={cn(
            "absolute left-10 transition-all duration-200 text-white/80",
            isFocused || hasValue ? "-top-6 text-sm" : "top-3"
          )}
        >
          {label}
        </label>
        <div className="absolute left-0 top-3 text-white/80">
          {icon === "user" ? <User size={20} /> : <Lock size={20} />}
        </div>
      </div>
    </div>
  );
}
