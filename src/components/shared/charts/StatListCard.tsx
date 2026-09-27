import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatListItem {
  /** Clave estable. Si no se pasa, se usa el label. */
  id?: string;
  /** Ícono que se renderiza dentro del fallback del avatar. */
  icon: LucideIcon;
  /** Texto que se muestra al lado del avatar. */
  label: string;
  /** Valor que se muestra a la derecha de la fila. */
  value: ReactNode;
  /** Clases extra para esta fila puntual. Se mergean después de `rowClassName`. */
  className?: string;
  /** Clases extra para el Avatar. */
  avatarClassName?: string;
  /** Clases extra para el AvatarFallback (acá viven los colores). */
  avatarFallbackClassName?: string;
  /** Clases extra para el ícono. */
  iconClassName?: string;
  /** Clases extra para el label. */
  labelClassName?: string;
  /** Clases extra para el valor. */
  valueClassName?: string;
}

interface StatListCardProps {
  /** Filas a renderizar. */
  items: StatListItem[];
  /** Título de la card. Omitilo para ocultar el header. */
  title?: ReactNode;
  /** Clases extra para la Card. */
  className?: string;
  /** Clases extra para el CardHeader. */
  headerClassName?: string;
  /** Clases extra para el CardTitle. */
  titleClassName?: string;
  /** Clases extra para el CardContent. */
  contentClassName?: string;
  /** Clases extra que se aplican a TODAS las filas. */
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
