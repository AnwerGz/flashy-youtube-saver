
import * as React from "react";
import { cn } from "@/lib/utils";

interface StepsProps {
  children: React.ReactNode;
  className?: string;
}

export const Steps = React.forwardRef<HTMLDivElement, StepsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("space-y-8", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Steps.displayName = "Steps";

interface StepProps {
  title: string;
  number: number;
  children: React.ReactNode;
  className?: string;
}

export const Step = React.forwardRef<HTMLDivElement, StepProps>(
  ({ className, children, title, number, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative pl-12", className)}
        {...props}
      >
        <div className="absolute left-0 flex h-9 w-9 items-center justify-center rounded-full border border-flash-200 bg-flash-100 text-flash-600 dark:border-flash-700 dark:bg-flash-800 dark:text-flash-300">
          <span className="font-medium">{number}</span>
        </div>
        <div>
          <h3 className="font-medium leading-none mb-3 text-flash-800 dark:text-flash-200">{title}</h3>
          <div className="text-flash-600 dark:text-flash-400">{children}</div>
        </div>
      </div>
    );
  }
);
Step.displayName = "Step";
