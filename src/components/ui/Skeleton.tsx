/**
 * Shimmer placeholder for loading states. Compose several to mirror the shape of
 * the content being loaded, so the layout doesn't jump when data arrives.
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`skeleton ${className}`} />;
}

/** A multi-line text placeholder. */
export function SkeletonText({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        // Last line is shorter, like real prose.
        <Skeleton
          key={i}
          className={`h-3.5 ${i === lines - 1 ? "w-2/3" : "w-full"}`}
        />
      ))}
    </div>
  );
}
