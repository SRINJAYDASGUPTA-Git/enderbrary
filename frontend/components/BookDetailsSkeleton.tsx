import { Skeleton } from "@/components/ui/skeleton";

export default function BookDetailsSkeleton() {
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
            {/* Header */}
            <div className="mb-8">
                <Skeleton className="h-8 w-2/3 mb-2" />
                <Skeleton className="h-5 w-32" />
            </div>

            {/* Content */}
            <div className="flex flex-col md:flex-row gap-10">
                {/* Cover Skeleton */}
                <div className="w-full md:w-1/3">
                    <Skeleton className="h-[450px] w-full rounded-xl" />
                </div>

                {/* Info Skeleton */}
                <div className="flex-1 space-y-6">
                    <div>
                        <Skeleton className="h-4 w-1/4 mb-1" />
                        <Skeleton className="h-5 w-2/3" />
                    </div>

                    <div>
                        <Skeleton className="h-4 w-1/4 mb-1" />
                        <Skeleton className="h-5 w-1/2" />
                    </div>

                    <div>
                        <Skeleton className="h-4 w-1/4 mb-1" />
                        <Skeleton className="h-20 w-full" />
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <Skeleton className="h-5 w-32" />
                    </div>

                    <div className="pt-4 flex gap-4">
                        <Skeleton className="h-10 w-32 rounded-md" />
                        <Skeleton className="h-10 w-32 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
}
