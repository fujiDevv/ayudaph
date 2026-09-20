import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

interface Crumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];
  icon?: ReactNode;
  children?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  crumbs = [],
  icon,
  children,
}: PageHeaderProps) {
  return (
    <section className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-8 md:py-10">
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center flex-wrap gap-1 text-xs text-gray-500">
            <li>
              <Link href="/" className="hover:text-primary-600">
                Home
              </Link>
            </li>
            {crumbs.map((crumb) => (
              <li key={crumb.label} className="flex items-center gap-1">
                <ChevronRightIcon className="h-3 w-3 text-gray-400" />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-primary-600">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-700 font-medium">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex items-start gap-3">
          {icon && (
            <span className="p-2.5 rounded-lg bg-primary-50 text-primary-600 shrink-0">
              {icon}
            </span>
          )}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-gray-600 max-w-3xl">{subtitle}</p>
            )}
          </div>
        </div>

        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
