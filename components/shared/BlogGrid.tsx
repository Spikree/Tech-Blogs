import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import type { Blog } from "@/types/blog";

export function PageHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
      {description && <p className="mt-1.5 text-muted-foreground">{description}</p>}
    </div>
  );
}

export function PageContainer({ children, narrow = false }: { children: ReactNode; narrow?: boolean }) {
  return (
    <div className={`mx-auto w-full px-4 py-8 sm:px-6 sm:py-10 ${narrow ? "max-w-3xl" : "max-w-6xl"}`}>
      {children}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed px-6 py-16 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-secondary">
        <Icon className="size-5 text-muted-foreground" />
      </span>
      <h2 className="mt-4 font-semibold">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

function CardSkeleton() {
  return (
    <Card className="flex flex-col p-5 shadow-none">
      <div className="flex items-center gap-3">
        <Skeleton className="size-9 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <Skeleton className="mt-5 h-5 w-4/5" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-2/3" />
      </div>
      <div className="mt-6 flex gap-3">
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-6 w-12" />
      </div>
    </Card>
  );
}

type GridProps = {
  blogs: Blog[] | null;
  error?: boolean;
  onRetry?: () => void;
  empty: ReactNode;
  children: (blog: Blog) => ReactNode;
};

export function BlogGrid({ blogs, error, onRetry, empty, children }: GridProps) {
  if (error) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-dashed px-6 py-16 text-center">
        <h2 className="font-semibold">Couldn’t load blogs</h2>
        <p className="mt-1 text-sm text-muted-foreground">Check your connection, then try again.</p>
        {onRetry && (
          <Button variant="outline" className="mt-5" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    );
  }

  if (blogs && blogs.length === 0) return <>{empty}</>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-busy={!blogs}>
      {blogs ? blogs.map((blog) => <div key={blog._id}>{children(blog)}</div>) : Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)}
    </div>
  );
}
