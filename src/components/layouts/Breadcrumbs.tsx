import { Fragment } from "react";
import { Link, useMatches } from "react-router";
import { useTranslation } from "react-i18next";
import type { CrumbHandle } from "@/router/types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const hasCrumb = (handle: unknown): handle is CrumbHandle =>
  typeof handle === "object" &&
  handle !== null &&
  typeof (handle as CrumbHandle).crumb === "string";

const Breadcrumbs = () => {
  const { t } = useTranslation();
  const matches = useMatches();

  // Solo las rutas activas que declararon handle.crumb.
  const crumbs = matches
    .filter((match) => hasCrumb(match.handle))
    .map((match) => ({
      pathname: match.pathname,
      label: t((match.handle as CrumbHandle).crumb),
    }));

  if (crumbs.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <Fragment key={crumb.pathname}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={crumb.pathname}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
