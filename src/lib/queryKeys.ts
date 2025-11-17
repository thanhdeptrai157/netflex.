export const queryKeys = {
    movie: {
        all: ['movie'] as const,
        detail: (slug: string) => [...queryKeys.movie.all, 'detail', slug] as const,
    }
}