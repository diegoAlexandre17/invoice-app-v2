import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ReactNode, MouseEvent } from "react";

interface ActionTableProps {
  className?: string;
  id?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  icon: ReactNode;
  tooltipText: string;
}

export function ActionTable({
  className,
  onClick,
  id,
  icon,
  tooltipText,
  disabled = false,
  loading = false,
}: ActionTableProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={className}
          id={id}
          variant="link"
          disabled={disabled || loading}
          onClick={onClick}
        >
          {loading ? (
            <div className="flex items-center justify-center w-4 h-4">
              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin opacity-70" />
            </div>
          ) : (
            icon
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
}
