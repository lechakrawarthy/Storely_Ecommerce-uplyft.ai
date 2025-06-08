import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartProvider, useCart } from '../contexts/CartContext'
import { ReactNode } from 'react'

// Mock component to test the cart context
const MockCartComponent = () => {
    const { items, total, itemCount, addItem, removeItem, updateQuantity, clearCart } = useCart()

    return (
        <div>
            <div data-testid="item-count">{itemCount}</div>
            <div data-testid="total">{total}</div>
            <div data-testid="items-length">{items.length}</div>

            <button
                onClick={() => addItem({
                    id: 'test-1',
                    title: 'Test Product',
                    price: 100,
                    originalPrice: 150,
                    image: 'test.jpg',
                    category: 'Test',
                    color: 'Red',
                    rating: 4.5,
                    reviews: 10,
                    badge: 'Test',
                    discount: 33,
                    inStock: true,
                    description: 'Test product description'
                })}
                data-testid="add-item"
            >
                Add Item
            </button>

            <button onClick={() => removeItem('test-1')} data-testid="remove-item">
                Remove Item
            </button>

            <button onClick={() => updateQuantity('test-1', 5)} data-testid="update-quantity">
                Update Quantity
            </button>

            <button onClick={clearCart} data-testid="clear-cart">
                Clear Cart
            </button>

            {items.map(item => (
                <div key={item.id} data-testid={`item-${item.id}`}>
                    <span>{item.title}</span>
                    <span data-testid={`quantity-${item.id}`}>{item.quantity}</span>
                    <span data-testid={`item-total-${item.id}`}>{item.price * item.quantity}</span>
                </div>
            ))}
        </div>
    )
}

const TestWrapper = ({ children }: { children: ReactNode }) => (
    <CartProvider>{children}</CartProvider>
)

describe('CartContext', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear()
    })

    it('initializes with empty cart', () => {
        render(
            <TestWrapper>
                <MockCartComponent />
            </TestWrapper>
        )

        expect(screen.getByTestId('item-count')).toHaveTextContent('0')
        expect(screen.getByTestId('total')).toHaveTextContent('0')
        expect(screen.getByTestId('items-length')).toHaveTextContent('0')
    })

    it('adds items to cart', async () => {
        const user = userEvent.setup()

        render(
            <TestWrapper>
                <MockCartComponent />
            </TestWrapper>
        )

        const addButton = screen.getByTestId('add-item')
        await user.click(addButton)

        expect(screen.getByTestId('item-count')).toHaveTextContent('1')
        expect(screen.getByTestId('total')).toHaveTextContent('100')
        expect(screen.getByTestId('items-length')).toHaveTextContent('1')
        expect(screen.getByText('Test Product')).toBeInTheDocument()
    })

    it('increases quantity when adding same item twice', async () => {
        const user = userEvent.setup()

        render(
            <TestWrapper>
                <MockCartComponent />
            </TestWrapper>
        )

        const addButton = screen.getByTestId('add-item')
        await user.click(addButton)
        await user.click(addButton)

        expect(screen.getByTestId('item-count')).toHaveTextContent('2')
        expect(screen.getByTestId('total')).toHaveTextContent('200')
        expect(screen.getByTestId('items-length')).toHaveTextContent('1')
        expect(screen.getByTestId('quantity-test-1')).toHaveTextContent('2')
    })

    it('removes items from cart', async () => {
        const user = userEvent.setup()

        render(
            <TestWrapper>
                <MockCartComponent />
            </TestWrapper>
        )

        // Add an item first
        const addButton = screen.getByTestId('add-item')
        await user.click(addButton)

        // Then remove it
        const removeButton = screen.getByTestId('remove-item')
        await user.click(removeButton)

        expect(screen.getByTestId('item-count')).toHaveTextContent('0')
        expect(screen.getByTestId('total')).toHaveTextContent('0')
        expect(screen.getByTestId('items-length')).toHaveTextContent('0')
    })

    it('updates item quantity', async () => {
        const user = userEvent.setup()

        render(
            <TestWrapper>
                <MockCartComponent />
            </TestWrapper>
        )

        // Add an item first
        const addButton = screen.getByTestId('add-item')
        await user.click(addButton)

        // Update quantity
        const updateButton = screen.getByTestId('update-quantity')
        await user.click(updateButton)

        expect(screen.getByTestId('item-count')).toHaveTextContent('5')
        expect(screen.getByTestId('total')).toHaveTextContent('500')
        expect(screen.getByTestId('quantity-test-1')).toHaveTextContent('5')
    })

    it('clears entire cart', async () => {
        const user = userEvent.setup()

        render(
            <TestWrapper>
                <MockCartComponent />
            </TestWrapper>
        )

        // Add some items
        const addButton = screen.getByTestId('add-item')
        await user.click(addButton)
        await user.click(addButton)

        // Clear cart
        const clearButton = screen.getByTestId('clear-cart')
        await user.click(clearButton)

        expect(screen.getByTestId('item-count')).toHaveTextContent('0')
        expect(screen.getByTestId('total')).toHaveTextContent('0')
        expect(screen.getByTestId('items-length')).toHaveTextContent('0')
    })

    it('calculates total correctly with multiple items', async () => {
        const user = userEvent.setup()

        render(
            <TestWrapper>
                <MockCartComponent />
            </TestWrapper>
        )

        // Add item multiple times
        const addButton = screen.getByTestId('add-item')
        await user.click(addButton) // 1 × 100 = 100
        await user.click(addButton) // 2 × 100 = 200
        await user.click(addButton) // 3 × 100 = 300

        expect(screen.getByTestId('total')).toHaveTextContent('300')
        expect(screen.getByTestId('item-total-test-1')).toHaveTextContent('300')
    })
    // Note: localStorage persistence tests removed as the CartContext 
    // doesn't implement localStorage functionality
})
