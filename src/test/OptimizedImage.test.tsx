import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import OptimizedImage from '../components/OptimizedImage'

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
})

Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: mockIntersectionObserver,
})

Object.defineProperty(global, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: mockIntersectionObserver,
})

describe('OptimizedImage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockIntersectionObserver.mockClear()
    })
    it('renders with loading state initially', () => {
        render(
            <OptimizedImage
                src="https://example.com/image.jpg"
                alt="Test image"
                className="test-class"
            />
        )

        // Should render the container with correct class
        const container = screen.getByRole('img', { name: 'Test image' }).parentElement
        expect(container).toHaveClass('test-class')

        // Should show the main image
        const image = screen.getByRole('img', { name: 'Test image' })
        expect(image).toBeInTheDocument()
    })

    it('applies custom className to container', () => {
        render(
            <OptimizedImage
                src="https://example.com/image.jpg"
                alt="Test image"
                className="custom-class"
            />
        )

        const container = screen.getByRole('img', { name: 'Test image' }).parentElement
        expect(container).toHaveClass('custom-class')
    })

    it('creates intersection observer for lazy loading', () => {
        render(
            <OptimizedImage
                src="https://example.com/image.jpg"
                alt="Test image"
            />
        )

        expect(mockIntersectionObserver).toHaveBeenCalledWith(
            expect.any(Function),
            { threshold: 0.1, rootMargin: '50px' }
        )
    })

    it('handles image load success', async () => {
        const onLoadMock = vi.fn()

        const mockObserver = {
            observe: vi.fn(),
            unobserve: vi.fn(),
            disconnect: vi.fn()
        }

        mockIntersectionObserver.mockImplementation((callback) => {
            // Simulate intersection immediately
            setTimeout(() => {
                callback([{ isIntersecting: true, target: document.createElement('div') }])
            }, 0)
            return mockObserver
        })

        render(
            <OptimizedImage
                src="https://example.com/image.jpg"
                alt="Test image"
                onLoad={onLoadMock}
            />
        )

        // Find the main image and simulate load event
        const mainImage = screen.getByRole('img', { name: 'Test image' })

        await waitFor(() => {
            fireEvent.load(mainImage)
        })

        expect(onLoadMock).toHaveBeenCalled()
    })

    it('handles image load error', async () => {
        const onErrorMock = vi.fn()

        render(
            <OptimizedImage
                src="invalid-url"
                alt="Test image"
                onError={onErrorMock}
            />
        )

        const mainImage = screen.getByRole('img', { name: 'Test image' })
        fireEvent.error(mainImage)

        expect(onErrorMock).toHaveBeenCalled()

        // Should show error state
        await waitFor(() => {
            expect(screen.getByText('Image not available')).toBeInTheDocument()
        })
    })

    it('uses custom placeholder when provided', () => {
        render(
            <OptimizedImage
                src="https://example.com/image.jpg"
                alt="Test image"
                placeholder="https://example.com/placeholder.jpg"
            />
        )

        const images = screen.getAllByRole('img')
        // The placeholder image should have the custom placeholder src
        expect(images[0]).toHaveAttribute('src', 'https://example.com/placeholder.jpg')
    })

    it('cleans up intersection observer on unmount', () => {
        const mockObserver = {
            observe: vi.fn(),
            unobserve: vi.fn(),
            disconnect: vi.fn()
        }

        mockIntersectionObserver.mockReturnValue(mockObserver)

        const { unmount } = render(
            <OptimizedImage
                src="https://example.com/image.jpg"
                alt="Test image"
            />
        )

        unmount()

        expect(mockObserver.disconnect).toHaveBeenCalled()
    })

    it('handles missing alt text gracefully', () => {
        render(
            <OptimizedImage
                src="https://example.com/image.jpg"
                alt=""
            />
        )

        // Should still render without issues - find by querying all img elements
        const allImages = document.querySelectorAll('img')
        expect(allImages.length).toBeGreaterThanOrEqual(1)

        // Check that the main image has the correct src
        const mainImage = Array.from(allImages).find(img =>
            img.getAttribute('src')?.includes('image.jpg') ||
            img.getAttribute('src')?.startsWith('data:image/svg')
        )
        expect(mainImage).toBeInTheDocument()
    })

    it('shows loading indicator when in view but not loaded', async () => {
        const mockObserver = {
            observe: vi.fn(),
            unobserve: vi.fn(),
            disconnect: vi.fn()
        }

        let intersectionCallback: any
        mockIntersectionObserver.mockImplementation((callback) => {
            intersectionCallback = callback
            return mockObserver
        })

        render(
            <OptimizedImage
                src="https://example.com/image.jpg"
                alt="Test image"
            />
        )

        // Simulate intersection
        if (intersectionCallback) {
            intersectionCallback([{ isIntersecting: true, target: document.createElement('div') }])
        }

        // Should show loading spinner when in view but not loaded
        await waitFor(() => {
            expect(document.querySelector('.animate-spin')).toBeInTheDocument()
        })
    })

    it('handles different image formats correctly', () => {
        const formats = ['jpg', 'png', 'webp', 'svg']

        formats.forEach(format => {
            const { unmount } = render(
                <OptimizedImage
                    src={`https://example.com/image.${format}`}
                    alt={`Test ${format} image`}
                />
            )

            const mainImage = screen.getByRole('img', { name: `Test ${format} image` })
            expect(mainImage).toBeInTheDocument()

            unmount()
        })
    })
})
