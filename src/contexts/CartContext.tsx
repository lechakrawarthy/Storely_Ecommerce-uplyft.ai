import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { Product } from '../components/BooksSection';

export interface CartItem extends Product {
    quantity: number;
    addedAt: Date;
}

interface CartState {
    items: CartItem[];
    total: number;
    itemCount: number;
    isOpen: boolean;
}

type CartAction =
    | { type: 'ADD_ITEM'; payload: Product }
    | { type: 'REMOVE_ITEM'; payload: string }
    | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
    | { type: 'CLEAR_CART' }
    | { type: 'TOGGLE_CART' }
    | { type: 'SET_CART_OPEN'; payload: boolean };

const initialState: CartState = {
    items: [],
    total: 0,
    itemCount: 0,
    isOpen: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            let newItems: CartItem[];

            if (existingItem) {
                newItems = state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                newItems = [...state.items, { ...action.payload, quantity: 1, addedAt: new Date() }];
            }

            const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

            return { ...state, items: newItems, total, itemCount };
        }

        case 'REMOVE_ITEM': {
            const newItems = state.items.filter(item => item.id !== action.payload);
            const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

            return { ...state, items: newItems, total, itemCount };
        }

        case 'UPDATE_QUANTITY': {
            const newItems = state.items.map(item =>
                item.id === action.payload.id
                    ? { ...item, quantity: Math.max(0, action.payload.quantity) }
                    : item
            ).filter(item => item.quantity > 0);

            const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

            return { ...state, items: newItems, total, itemCount };
        }

        case 'CLEAR_CART':
            return { ...state, items: [], total: 0, itemCount: 0 };

        case 'TOGGLE_CART':
            return { ...state, isOpen: !state.isOpen };

        case 'SET_CART_OPEN':
            return { ...state, isOpen: action.payload };

        default:
            return state;
    }
}

interface CartContextType extends CartState {
    addItem: (product: Product) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    setCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    const cartActions = {
        addItem: (product: Product) => {
            dispatch({ type: 'ADD_ITEM', payload: product });
            // Auto-open cart briefly when item is added
            dispatch({ type: 'SET_CART_OPEN', payload: true });
            setTimeout(() => dispatch({ type: 'SET_CART_OPEN', payload: false }), 2000);
        },
        removeItem: (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id }),
        updateQuantity: (id: string, quantity: number) =>
            dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } }),
        clearCart: () => dispatch({ type: 'CLEAR_CART' }),
        toggleCart: () => dispatch({ type: 'TOGGLE_CART' }),
        setCartOpen: (open: boolean) => dispatch({ type: 'SET_CART_OPEN', payload: open }),
    };

    return (
        <CartContext.Provider value={{ ...state, ...cartActions }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
