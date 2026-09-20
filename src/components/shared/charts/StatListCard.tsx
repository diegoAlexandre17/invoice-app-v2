import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatListItem {
  /** Stable key. Falls back to the label when omitted. */
  id?: string;
  /** Icon rendered inside the avatar fallback. */
  icon: LucideIcon;
  /** Text shown next to the avatar. */
  label: string;
  /** Value shown on the right side of the row. */
  value: ReactNode;
  /** Extra classes for this row container. Merged after `rowClassName`. */
  className?: string;
  /** Extra classes for the Avatar wrapper. */
  avatarClassName?: string;
  /** Extra classes for the AvatarFallback (colors live here). */
  avatarFallbackClassName?: string;
  /** Extra classes for the icon. */
  iconClassName?: string;
  /** Extra classes for the label. */
  labelClassName?: string;
  /** Extra classes for the value. */
  valueClassName?: string;
}

interface StatListCardProps {
  /** Rows to render. */
  items: StatListItem[];
  /** Card title. Omit to hide the header. */
  title?: ReactNode;
  /** Extra classes for the Card. */
  className?: string;
  /** Extra classes for the CardHeader. */
  headerClassName?: string;
  /** Extra classes for the CardTitle. */
  titleClassName?: string;
  /** Extra classes for the CardContent. */
  contentClassName?: string;
  /** Extra classes applied to every row. */
  rowClassName?: string;
}

const StatListCard = ({
  items,
  title,
  className,
  headerClassName,
  titleClassName,
  contentClassName,
  rowClassName,
}: StatListCardProps) => (
  <Card className={cn("gap-2", className)}>
    {title && (
      <CardHeader className={headerClassName}>
        <CardTitle className={titleClassName}>{title}</CardTitle>
      </CardHeader>
    )}
    <CardContent
      className={cn("flex h-full flex-col justify-between", contentClassName)}
    >
      {items.map(({ icon: Icon, ...item }) => (
        <div
          key={item.id ?? item.label}
          className={cn(
            "flex items-center justify-between gap-0.5",
            rowClassName,
            item.className,
          )}
        >
          <div className="flex items-center gap-2">
            <Avatar className={cn("size-8 after:border-0", item.avatarClassName)}>
              <AvatarFallback className={item.avatarFallbackClassName}>
                <Icon className={cn("size-5", item.iconClassName)} />
              </AvatarFallback>
            </Avatar>
            <span className={cn("text-sm font-semibold", item.labelClassName)}>
              {item.label}
            </span>
          </div>
          <CardTitle className={cn("font-semibold", item.valueClassName)}>
            {item.value}
          </CardTitle>
        </div>
      ))}
    </CardContent>
  </Card>
);

export default StatListCard;
