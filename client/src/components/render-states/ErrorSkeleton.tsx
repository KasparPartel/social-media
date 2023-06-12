interface ErrorSkeletonProps {
    message?: string
}

export function ErrorSkeleton({ message }: ErrorSkeletonProps) {
    return (
        <section>
            <p>Something went wrong. Try again later!</p>
            {message && <p>Error: {message}</p>}
        </section>
    )
}
