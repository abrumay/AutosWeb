import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:pointer-events-none disabled:opacity-60 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-tinta text-white hover:bg-tinta-suave",
        secondary: "bg-white text-tinta border-2 border-tinta hover:bg-arena",
        outline: "bg-white text-texto border-2 border-borde hover:border-tinta hover:bg-arena",
        whatsapp: "bg-whatsapp text-white hover:bg-whatsapp-oscuro",
        danger: "bg-error text-white hover:bg-red-900",
        ghost: "text-tinta hover:bg-arena",
      },
      size: {
        md: "min-h-12 px-5 text-base [&_svg]:size-5",
        lg: "min-h-14 px-7 text-lg [&_svg]:size-6",
        icon: "size-12 [&_svg]:size-6",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
