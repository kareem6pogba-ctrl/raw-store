export function SkeletonCard() {
  return (
    <div>
      <div className="skeleton aspect-[3.2/4] mb-4" />
      <div className="skeleton h-4 w-3/4 mb-2" />
      <div className="skeleton h-3.5 w-1/3" />
    </div>
  )
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonProductDetail() {
  return (
    <div className="max-w-[1320px] mx-auto px-8 pt-10 pb-24">
      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-16">
        <div className="skeleton aspect-[3.4/4]" />
        <div>
          <div className="skeleton h-4 w-24 mb-4" />
          <div className="skeleton h-10 w-3/4 mb-4" />
          <div className="skeleton h-5 w-28 mb-8" />
          <div className="skeleton h-3.5 w-full mb-2" />
          <div className="skeleton h-3.5 w-5/6 mb-8" />
          <div className="skeleton h-11 w-full" />
        </div>
      </div>
    </div>
  )
}
