import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        control:
          "h-10 rounded-md border border-border bg-card px-4 text-sm text-card-foreground hover:border-primary hover:bg-accent",
        icon: "size-10 rounded-md border border-border bg-card text-card-foreground hover:border-primary hover:bg-accent",
        ghost: "h-10 rounded-md px-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground",
        default: "bg-primary text-primary-foreground hover:opacity-90",
        destructive: "bg-primary text-primary-foreground hover:opacity-90",
        outline: "border border-border bg-card text-card-foreground hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground hover:opacity-90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "size-10 p-0",
      },
    },
    defaultVariants: { variant: "control", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({ className, variant, size, asChild = false, ref, ...props }: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const Comp = asChild ? Slot : "button";
  return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, buttonVariants };