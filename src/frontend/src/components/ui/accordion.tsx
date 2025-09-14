"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  children: React.ReactNode;
  className?: string;
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

interface AccordionProps {
  type?: "single" | "multiple";
  collapsible?: boolean;
  children: React.ReactNode;
  className?: string;
}

const AccordionContext = React.createContext<{
  openItems: Set<string>;
  toggleItem: (value: string) => void;
}>({
  openItems: new Set(),
  toggleItem: () => {},
});

const Accordion: React.FC<AccordionProps> = ({
  type = "single",
  collapsible = true,
  children,
  className,
}) => {
  const [openItems, setOpenItems] = React.useState<Set<string>>(new Set());

  const toggleItem = React.useCallback(
    (value: string) => {
      setOpenItems((prev) => {
        const newSet = new Set(prev);
        if (type === "single") {
          if (newSet.has(value)) {
            return collapsible ? new Set() : newSet;
          } else {
            return new Set([value]);
          }
        } else {
          if (newSet.has(value)) {
            newSet.delete(value);
          } else {
            newSet.add(value);
          }
          return newSet;
        }
      });
    },
    [type, collapsible],
  );

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={cn("space-y-2", className)}>{children}</div>
    </AccordionContext.Provider>
  );
};

const AccordionItem: React.FC<AccordionItemProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("border-border rounded-lg border", className)}>
      {children}
    </div>
  );
};

const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
  children,
  className,
  onClick,
}) => {
  const { openItems, toggleItem } = React.useContext(AccordionContext);
  const isOpen = openItems.has(children?.toString() || "");

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      toggleItem(children?.toString() || "");
    }
  };

  return (
    <button
      className={cn(
        "hover:bg-muted/50 flex w-full items-center justify-between px-4 py-3 text-left transition-colors",
        className,
      )}
      onClick={handleClick}
    >
      <span className="font-medium">{children}</span>
      <ChevronDown
        className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
      />
    </button>
  );
};

const AccordionContent: React.FC<AccordionContentProps> = ({
  children,
  className,
}) => {
  const { openItems } = React.useContext(AccordionContext);
  const isOpen = openItems.has(children?.toString() || "");

  if (!isOpen) return null;

  return <div className={cn("px-4 pb-4", className)}>{children}</div>;
};

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
