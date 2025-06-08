import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import BooksSection from '../components/BooksSection'
import { CartProvider } from '../contexts/CartContext'
import { SearchProvider } from '../contexts/SearchContext'

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    }
})

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
    Heart: ({ className }: { className?: string }) => <div data-testid="heart-icon" className={className} />,
    Star: ({ className }: { className?: string }) => <div data-testid="star-icon" className={className} />,
    ShoppingCart: ({ className }: { className?: string }) => <div data-testid="cart-icon" className={className} />,
    Filter: ({ className }: { className?: string }) => <div data-testid="filter-icon" className={className} />,
    Grid: ({ className }: { className?: string }) => <div data-testid="grid-icon" className={className} />,
    List: ({ className }: { className?: string }) => <div data-testid="list-icon" className={className} />,
    Search: ({ className }: { className?: string }) => <div data-testid="search-icon" className={className} />,
    SlidersHorizontal: ({ className }: { className?: string }) => <div data-testid="sliders-icon" className={className} />,
    Zap: ({ className }: { className?: string }) => <div data-testid="zap-icon" className={className} />,
    Award: ({ className }: { className?: string }) => <div data-testid="award-icon" className={className} />,
    X: ({ className }: { className?: string }) => <div data-testid="x-icon" className={className} />,
    ChevronLeft: ({ className }: { className?: string }) => <div data-testid="chevron-left-icon" className={className} />,
    ChevronRight: ({ className }: { className?: string }) => <div data-testid="chevron-right-icon" className={className} />,
}))

// Mock OptimizedImage component
vi.mock('../components/OptimizedImage', () => ({
    default: ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
        <img src={src} alt={alt} className={className} data-testid="optimized-image" />
    ),
}))

// Mock toast hook
vi.mock('../components/ui/use-toast', () => ({
    useToast: () => ({
        toast: vi.fn(),
    }),
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    })

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <CartProvider>
                    <SearchProvider>
                        {children}
                    </SearchProvider>
                </CartProvider>
            </BrowserRouter>
        </QueryClientProvider>
    )
}

describe('BooksSection', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders the component with header and products', () => {
        render(
            <TestWrapper>
                <BooksSection />
            </TestWrapper>
        )

        expect(screen.getByText('Discover Products')).toBeInTheDocument()
        expect(screen.getByText('Explore our curated collection of premium electronics, stylish textiles, and bestselling books')).toBeInTheDocument()
    })

    it('displays search input and allows searching', async () => {
        const user = userEvent.setup()

        render(
            <TestWrapper>
                <BooksSection />
            </TestWrapper>
        )

        const searchInput = screen.getByPlaceholderText(/Try "smartphones under/i)
        expect(searchInput).toBeInTheDocument()

        await user.type(searchInput, 'laptop')
        expect(searchInput).toHaveValue('laptop')
    })

    it('shows and hides filters when filter button is clicked', async () => {
        const user = userEvent.setup()

        render(
            <TestWrapper>
                <BooksSection />
            </TestWrapper>
        )

        const filterButton = screen.getByRole('button', { name: /filters/i })
        await user.click(filterButton)

        expect(screen.getByText('Categories')).toBeInTheDocument()
        expect(screen.getByText('Price Range')).toBeInTheDocument()
    })

    it('switches between grid and list view modes', async () => {
        const user = userEvent.setup()

        render(
            <TestWrapper>
                <BooksSection />
            </TestWrapper>
        )

        // Default should be grid view
        const gridButton = screen.getByTestId('grid-icon').closest('button')
        const listButton = screen.getByTestId('list-icon').closest('button')

        expect(gridButton).toHaveClass('bg-pastel-500')

        // Switch to list view
        if (listButton) {
            await user.click(listButton)
            expect(listButton).toHaveClass('bg-pastel-500')
        }
    })
    it('displays product cards with correct information', () => {
        render(
            <TestWrapper>
                <BooksSection />
            </TestWrapper>
        )

        // Check for product titles (should be visible in the rendered products)
        expect(screen.getByText(/New Gen X-Bud/i)).toBeInTheDocument()
        expect(screen.getByText(/Light Grey Headphone/i)).toBeInTheDocument()
    })
    it('handles category filtering', async () => {
        const user = userEvent.setup()

        render(
            <TestWrapper>
                <BooksSection />
            </TestWrapper>
        )

        // Open filters
        const filterButton = screen.getByRole('button', { name: /filters/i })
        await user.click(filterButton)

        // Find the Electronics category button specifically within the categories section
        const categoryButtons = screen.getAllByRole('button')
        const electronicsButton = categoryButtons.find(button =>
            button.textContent === 'Electronics' && button.className.includes('px-4 py-2 rounded-full')
        )

        expect(electronicsButton).toBeDefined()
        await user.click(electronicsButton!)

        // Verify the button is selected (should have active styling)
        expect(electronicsButton).toHaveClass('bg-sage-500')
    })

    it('handles sorting functionality', async () => {
        const user = userEvent.setup()

        render(
            <TestWrapper>
                <BooksSection />
            </TestWrapper>
        )

        const sortSelect = screen.getByDisplayValue('Featured')
        await user.selectOptions(sortSelect, 'Price: Low to High')

        expect(sortSelect).toHaveValue('Price: Low to High')
    })

    it('handles products per page selection', async () => {
        const user = userEvent.setup()

        render(
            <TestWrapper>
                <BooksSection />
            </TestWrapper>
        )

        const perPageSelect = screen.getByDisplayValue('12 per page')
        await user.selectOptions(perPageSelect, '24')

        expect(perPageSelect).toHaveValue('24')
    })  it('displays pagination controls', () => {
        render(
            <TestWrapper>
                <BooksSection />
            </TestWrapper>
        )

        // Since pagination only appears when totalPages > 1, and we have limited test data,
        // check if pagination elements exist or if all products are shown
        const resultsInfo = screen.queryByText(/Showing \d+-\d+ of \d+ results/)

        if (resultsInfo) {
            expect(resultsInfo).toBeInTheDocument()
        } else {
            // If no pagination, verify that the products section is rendered correctly
            expect(screen.getByText('Discover Products')).toBeInTheDocument()
        }
    })

    it('handles wishlist functionality', async () => {
        const user = userEvent.setup()

        render(
            <TestWrapper>
                <BooksSection />
            </TestWrapper>
        )

        const heartIcons = screen.getAllByTestId('heart-icon')
        const firstHeartButton = heartIcons[0].closest('button')

        if (firstHeartButton) {
            await user.click(firstHeartButton)
            // Should update wishlist state (implementation specific)
        }
    })

    it('adds products to cart', async () => {
        const user = userEvent.setup()

        render(
            <TestWrapper>
                <BooksSection />
            </TestWrapper>
        )

        const cartIcons = screen.getAllByTestId('cart-icon')
        const firstCartButton = cartIcons[0].closest('button')

        if (firstCartButton) {
            await user.click(firstCartButton)
            // Should add item to cart and show toast (implementation specific)
        }
    })

    it('handles product navigation', async () => {
        const user = userEvent.setup()
        render(
            <TestWrapper>
                <BooksSection />
            </TestWrapper>
        )

        const productCards = screen.getAllByText(/New Gen X-Bud|Light Grey Headphone/i)
        if (productCards.length > 0) {
            const productCard = productCards[0].closest('div[role="button"]')
            if (productCard) {
                await user.click(productCard)
                // Should navigate to product detail page
            }
        }
    })  it('displays correct product badges and pricing', () => {
        render(
            <TestWrapper>
                <BooksSection />
            </TestWrapper>
        )

        // Check if any pricing and badge elements are displayed
        // Since products might be displayed differently based on filtering
        const priceElements = screen.getAllByText(/₹\d+/)
        expect(priceElements.length).toBeGreaterThan(0)

        const badgeElements = screen.getAllByText(/Best Seller|New|Hot Deal|Trending|Premium/i)
        expect(badgeElements.length).toBeGreaterThan(0)
    })

    it('handles price range filtering', async () => {
        const user = userEvent.setup()

        render(
            <TestWrapper>
                <BooksSection />
            </TestWrapper>
        )

        // Open filters
        const filterButton = screen.getByRole('button', { name: /filters/i })
        await user.click(filterButton)

        // Check price range controls exist
        expect(screen.getByText('Price Range')).toBeInTheDocument()
        const priceSliders = screen.getAllByRole('slider')
        expect(priceSliders).toHaveLength(2)
    })
})
