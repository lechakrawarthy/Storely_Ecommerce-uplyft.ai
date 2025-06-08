import React, { memo, useCallback, useMemo } from 'react'

// Performance utilities and optimizations

/**
 * Debounced search hook for better performance
 */
export const useDebouncedValue = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

    return () => {
            clearTimeout(handler)
        }
  }, [value, delay])

        return debouncedValue
}

        /**
         * Intersection Observer hook for lazy loading
         */
        export const useIntersectionObserver = (
        options: IntersectionObserverInit = { }
) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false)
        const [element, setElement] = React.useState<Element | null>(null)

  React.useEffect(() => {
    if (!element) return

        const observer = new IntersectionObserver(
      ([entry]) => {
            setIsIntersecting(entry.isIntersecting)
        },
        {threshold: 0.1, rootMargin: '50px', ...options }
        )

        observer.observe(element)

    return () => {
            observer.disconnect()
        }
  }, [element, options])

        return {isIntersecting, setElement}
}

        /**
         * Memoized product card component for better list performance
         */
        interface Product {
            id: string
        title: string
        price: number
        originalPrice: number
        image: string
        category: string
        rating: number
        reviews: number
        inStock: boolean
}

        interface MemoizedProductCardProps {
            product: Product
  onAddToCart: (product: Product) => void
  onToggleWishlist: (id: string) => void
  onNavigate: (product: Product) => void
        isWishlisted: boolean
}

        export const MemoizedProductCard = memo<MemoizedProductCardProps>(({
            product,
            onAddToCart,
            onToggleWishlist,
            onNavigate,
            isWishlisted
        }) => {
  const handleAddToCart = useCallback((e: React.MouseEvent) => {
                e.stopPropagation()
    onAddToCart(product)
  }, [onAddToCart, product])

  const handleToggleWishlist = useCallback((e: React.MouseEvent) => {
                e.stopPropagation()
    onToggleWishlist(product.id)
  }, [onToggleWishlist, product.id])

  const handleNavigate = useCallback(() => {
                onNavigate(product)
            }, [onNavigate, product])

  const discountPercentage = useMemo(() => {
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
  }, [product.price, product.originalPrice])

  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat('en-IN', {
                style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
    }).format(product.price)
  }, [product.price])

            return (
            <div
                className="product-card cursor-pointer"
                onClick={handleNavigate}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleNavigate()}
            >
                {/* Product card content */}
                <div className="product-image-container">
                    <img
                        src={product.image}
                        alt={product.title}
                        loading="lazy"
                        className="product-image"
                    />
                    {discountPercentage > 0 && (
                        <span className="discount-badge">
                            {discountPercentage}% OFF
                        </span>
                    )}
                </div>

                <div className="product-info">
                    <h3 className="product-title">{product.title}</h3>
                    <div className="product-price">
                        <span className="current-price">{formattedPrice}</span>
                        {product.originalPrice > product.price && (
                            <span className="original-price">
                                ₹{product.originalPrice}
                            </span>
                        )}
                    </div>

                    <div className="product-actions">
                        <button
                            onClick={handleToggleWishlist}
                            className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                            ♡
                        </button>

                        {product.inStock && (
                            <button
                                onClick={handleAddToCart}
                                className="add-to-cart-btn"
                                aria-label={`Add ${product.title} to cart`}
                            >
                                Add to Cart
                            </button>
                        )}
                    </div>
                </div>
            </div>
            )
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  return (
            prevProps.product.id === nextProps.product.id &&
            prevProps.isWishlisted === nextProps.isWishlisted &&
            prevProps.product.inStock === nextProps.product.inStock
            )
})

            MemoizedProductCard.displayName = 'MemoizedProductCard'

            /**
             * Virtual list component for large datasets
             */
            interface VirtualListProps<T> {
                items: T[]
                itemHeight: number
                containerHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
                overscan?: number
}

                export function VirtualList<T>({
                    items,
                    itemHeight,
                    containerHeight,
                    renderItem,
                    overscan = 5
                }: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = React.useState(0)

                        const visibleStart = Math.floor(scrollTop / itemHeight)
                        const visibleEnd = Math.min(
                        visibleStart + Math.ceil(containerHeight / itemHeight),
                        items.length - 1
                        )

                        const paddingTop = Math.max(0, (visibleStart - overscan) * itemHeight)
                        const paddingBottom = Math.max(0, (items.length - visibleEnd - 1 - overscan) * itemHeight)

                        const visibleItems = items.slice(
                        Math.max(0, visibleStart - overscan),
                        Math.min(items.length, visibleEnd + 1 + overscan)
                        )

                        return (
                        <div
                            style={{ height: containerHeight, overflow: 'auto' }}
                            onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
                        >
                            <div style={{ paddingTop, paddingBottom }}>
                                {visibleItems.map((item, index) =>
                                    renderItem(item, Math.max(0, visibleStart - overscan) + index)
                                )}
                            </div>
                        </div>
                        )
}

/**
 * Performance monitoring hook
 */
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = React.useState<{
    renderTime: number
                        memoryUsage?: number
  }>({renderTime: 0 })

  React.useEffect(() => {
    const startTime = performance.now()

    const updateMetrics = () => {
      const endTime = performance.now()
                        const renderTime = endTime - startTime

                        const newMetrics: typeof metrics = {renderTime}

      // Check if memory API is available
                        if ('memory' in performance) {
        const memoryInfo = (performance as any).memory
                        newMetrics.memoryUsage = memoryInfo.usedJSHeapSize
      }

                        setMetrics(newMetrics)
    }

                        // Use requestIdleCallback if available, otherwise setTimeout
                        if ('requestIdleCallback' in window) {
                            requestIdleCallback(updateMetrics)
                        } else {
                            setTimeout(updateMetrics, 0)
                        }
  }, [])

                        return metrics
}

                        /**
                         * Image lazy loading with placeholder
                         */
                        interface LazyImageProps {
                            src: string
                        alt: string
                        className?: string
                        placeholder?: string
  onLoad?: () => void
  onError?: () => void
}

                        export const LazyImage = memo<LazyImageProps>(({
                            src,
                            alt,
                            className = '',
                            placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="%23f3f4f6" viewBox="0 0 100 100"%3E%3Crect width="100" height="100"/%3E%3C/svg%3E',
                            onLoad,
                            onError
                        }) => {
  const [isLoaded, setIsLoaded] = React.useState(false)
                            const [hasError, setHasError] = React.useState(false)
                            const {isIntersecting, setElement} = useIntersectionObserver()

  const handleLoad = useCallback(() => {
                                setIsLoaded(true)
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
                                setHasError(true)
    onError?.()
  }, [onError])

                            return (
                            <div ref={setElement as any} className={`lazy-image-container ${className}`}>
                                {isIntersecting && !hasError && (
                                    <img
                                        src={isLoaded ? src : placeholder}
                                        alt={alt}
                                        className={`lazy-image ${isLoaded ? 'loaded' : 'loading'}`}
                                        onLoad={handleLoad}
                                        onError={handleError}
                                        loading="lazy"
                                    />
                                )}
                                {!isIntersecting && (
                                    <div className="lazy-image-placeholder" />
                                )}
                            </div>
                            )
})

                            LazyImage.displayName = 'LazyImage'

                            /**
                             * Debounced search input component
                             */
                            interface DebouncedSearchProps {
                                onSearch: (query: string) => void
                            placeholder?: string
                            delay?: number
                            className?: string
}

                            export const DebouncedSearch = memo<DebouncedSearchProps>(({
                                onSearch,
                                placeholder = 'Search...',
                                delay = 300,
                                className = ''
                            }) => {
  const [value, setValue] = React.useState('')
                                const debouncedValue = useDebouncedValue(value, delay)

  React.useEffect(() => {
                                    onSearch(debouncedValue)
                                }, [debouncedValue, onSearch])

                                const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                                    setValue(e.target.value)
                                }, [])

                                    return (
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={handleChange}
                                        placeholder={placeholder}
                                        className={`debounced-search ${className}`}
                                    />
                                    )
})

                                    DebouncedSearch.displayName = 'DebouncedSearch'
