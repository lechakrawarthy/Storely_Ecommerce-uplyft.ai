import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../hooks/useAuth';
import { useIsMobile } from '../hooks/use-mobile';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import hapticFeedback from '../utils/hapticFeedback';
import MobileLoadingAnimations from '../components/MobileLoadingAnimations';
import {
    ShoppingBag,
    MapPin,
    CreditCard,
    User,
    Mail,
    Phone,
    Home,
    ChevronLeft,
    ChevronRight,
    Check,
    AlertCircle,
    Loader2
} from '../utils/icons';
import { Link } from 'react-router-dom';

interface ShippingAddress {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

interface PaymentInfo {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    nameOnCard: string;
}

const Checkout = () => {
    const { items, total, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    const [currentStep, setCurrentStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);

    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
    });

    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        nameOnCard: ''
    });

    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    // Redirect if cart is empty
    if (items.length === 0 && !orderComplete) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <div className="glass-card rounded-3xl p-8 text-center max-w-md">
                    <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6">Add some items to your cart before checkout</p>
                    <Link to="/">
                        <Button className="w-full">Continue Shopping</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const validateShipping = () => {
        const errors: Record<string, string> = {};

        if (!shippingAddress.fullName.trim()) errors.fullName = 'Full name is required';
        if (!shippingAddress.email.trim()) errors.email = 'Email is required';
        if (!/\S+@\S+\.\S+/.test(shippingAddress.email)) errors.email = 'Invalid email format';
        if (!shippingAddress.phone.trim()) errors.phone = 'Phone number is required';
        if (!shippingAddress.address.trim()) errors.address = 'Address is required';
        if (!shippingAddress.city.trim()) errors.city = 'City is required';
        if (!shippingAddress.state.trim()) errors.state = 'State is required';
        if (!shippingAddress.zipCode.trim()) errors.zipCode = 'ZIP code is required';

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validatePayment = () => {
        const errors: Record<string, string> = {};

        if (!paymentInfo.nameOnCard.trim()) errors.nameOnCard = 'Name on card is required';
        if (!paymentInfo.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
            errors.cardNumber = 'Invalid card number';
        }
        if (!paymentInfo.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
            errors.expiryDate = 'Invalid expiry date (MM/YY)';
        }
        if (!paymentInfo.cvv.match(/^\d{3,4}$/)) {
            errors.cvv = 'Invalid CVV';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    }; const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));

        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: '' }));
            if (isMobile) hapticFeedback.light();
        }
    }; const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Format card number
        if (name === 'cardNumber') {
            formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
        }

        // Format expiry date
        if (name === 'expiryDate') {
            formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
        }

        // Format CVV
        if (name === 'cvv') {
            formattedValue = value.replace(/\D/g, '').slice(0, 4);
        }

        setPaymentInfo(prev => ({ ...prev, [name]: formattedValue }));

        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: '' }));
            if (isMobile) hapticFeedback.light();
        }
    }; const nextStep = () => {
        if (currentStep === 1 && validateShipping()) {
            if (isMobile) hapticFeedback.success();
            setCurrentStep(2);
        } else if (currentStep === 2 && validatePayment()) {
            if (isMobile) hapticFeedback.success();
            setCurrentStep(3);
        } else {
            if (isMobile) hapticFeedback.error();
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            if (isMobile) hapticFeedback.light();
            setCurrentStep(currentStep - 1);
        }
    }; const placeOrder = async () => {
        setIsProcessing(true);
        if (isMobile) hapticFeedback.light();

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Clear cart and show success
            clearCart();
            setOrderComplete(true);
            setCurrentStep(4);
            if (isMobile) hapticFeedback.success();
        } catch (error) {
            if (isMobile) hapticFeedback.error();
            console.error('Order failed:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const steps = [
        { number: 1, title: 'Shipping', icon: MapPin },
        { number: 2, title: 'Payment', icon: CreditCard },
        { number: 3, title: 'Review', icon: Check },
        { number: 4, title: 'Complete', icon: Check }
    ];

    if (orderComplete) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <div className="glass-card rounded-3xl p-8 text-center max-w-md">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
                    <p className="text-gray-600 mb-6">Thank you for your purchase. You'll receive a confirmation email shortly.</p>
                    <Button onClick={() => navigate('/')} className="w-full mb-3">
                        Continue Shopping
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/orders')} className="w-full">
                        View My Orders
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link to="/" className="flex items-center text-gray-700 hover:text-gray-900">
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        Back to Shop
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
                    <div></div>
                </div>

                {/* Progress Steps */}
                <div className="glass-card rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = currentStep >= step.number;
                            const isCurrent = currentStep === step.number;

                            return (
                                <React.Fragment key={step.number}>                                    <div className="flex flex-col items-center">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${isActive
                                        ? 'bg-sage-600 border-sage-600 text-white'
                                        : 'border-gray-300 text-gray-400'
                                        }`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className={`text-sm mt-2 font-medium ${isCurrent
                                        ? 'text-sage-600'
                                        : isActive
                                            ? 'text-gray-800'
                                            : 'text-gray-400'
                                        }`}>
                                        {step.title}
                                    </span>
                                </div>                                    {index < steps.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.number ? 'bg-sage-600' : 'bg-gray-200'
                                        }`} />
                                )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="glass-card rounded-2xl p-6">
                            {/* Step 1: Shipping Information */}
                            {currentStep === 1 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                        <MapPin className="w-6 h-6 mr-2" />
                                        Shipping Information
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <Input
                                                    name="fullName"
                                                    value={shippingAddress.fullName}
                                                    onChange={handleShippingChange}
                                                    className={`pl-10 ${validationErrors.fullName ? 'border-red-300' : ''}`}
                                                    placeholder="Enter your full name"
                                                />
                                            </div>
                                            {validationErrors.fullName && (
                                                <p className="text-red-500 text-xs mt-1">{validationErrors.fullName}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <Input
                                                    name="email"
                                                    type="email"
                                                    value={shippingAddress.email}
                                                    onChange={handleShippingChange}
                                                    className={`pl-10 ${validationErrors.email ? 'border-red-300' : ''}`}
                                                    placeholder="Enter your email"
                                                />
                                            </div>
                                            {validationErrors.email && (
                                                <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <Input
                                                    name="phone"
                                                    type="tel"
                                                    value={shippingAddress.phone}
                                                    onChange={handleShippingChange}
                                                    className={`pl-10 ${validationErrors.phone ? 'border-red-300' : ''}`}
                                                    placeholder="Enter your phone number"
                                                />
                                            </div>
                                            {validationErrors.phone && (
                                                <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                            <Input
                                                name="country"
                                                value={shippingAddress.country}
                                                onChange={handleShippingChange}
                                                readOnly
                                                className="bg-gray-50"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                            <div className="relative">
                                                <Home className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                                                <Input
                                                    name="address"
                                                    value={shippingAddress.address}
                                                    onChange={handleShippingChange}
                                                    className={`pl-10 ${validationErrors.address ? 'border-red-300' : ''}`}
                                                    placeholder="Enter your full address"
                                                />
                                            </div>
                                            {validationErrors.address && (
                                                <p className="text-red-500 text-xs mt-1">{validationErrors.address}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                            <Input
                                                name="city"
                                                value={shippingAddress.city}
                                                onChange={handleShippingChange}
                                                className={validationErrors.city ? 'border-red-300' : ''}
                                                placeholder="Enter city"
                                            />
                                            {validationErrors.city && (
                                                <p className="text-red-500 text-xs mt-1">{validationErrors.city}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                            <Input
                                                name="state"
                                                value={shippingAddress.state}
                                                onChange={handleShippingChange}
                                                className={validationErrors.state ? 'border-red-300' : ''}
                                                placeholder="Enter state"
                                            />
                                            {validationErrors.state && (
                                                <p className="text-red-500 text-xs mt-1">{validationErrors.state}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                                            <Input
                                                name="zipCode"
                                                value={shippingAddress.zipCode}
                                                onChange={handleShippingChange}
                                                className={validationErrors.zipCode ? 'border-red-300' : ''}
                                                placeholder="Enter ZIP code"
                                            />
                                            {validationErrors.zipCode && (
                                                <p className="text-red-500 text-xs mt-1">{validationErrors.zipCode}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Payment Information */}
                            {currentStep === 2 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                        <CreditCard className="w-6 h-6 mr-2" />
                                        Payment Information
                                    </h2>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                                            <Input
                                                name="nameOnCard"
                                                value={paymentInfo.nameOnCard}
                                                onChange={handlePaymentChange}
                                                className={validationErrors.nameOnCard ? 'border-red-300' : ''}
                                                placeholder="Enter name as on card"
                                            />
                                            {validationErrors.nameOnCard && (
                                                <p className="text-red-500 text-xs mt-1">{validationErrors.nameOnCard}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                            <Input
                                                name="cardNumber"
                                                value={paymentInfo.cardNumber}
                                                onChange={handlePaymentChange}
                                                className={validationErrors.cardNumber ? 'border-red-300' : ''}
                                                placeholder="1234 5678 9012 3456"
                                                maxLength={19}
                                            />
                                            {validationErrors.cardNumber && (
                                                <p className="text-red-500 text-xs mt-1">{validationErrors.cardNumber}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                                <Input
                                                    name="expiryDate"
                                                    value={paymentInfo.expiryDate}
                                                    onChange={handlePaymentChange}
                                                    className={validationErrors.expiryDate ? 'border-red-300' : ''}
                                                    placeholder="MM/YY"
                                                    maxLength={5}
                                                />
                                                {validationErrors.expiryDate && (
                                                    <p className="text-red-500 text-xs mt-1">{validationErrors.expiryDate}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                                <Input
                                                    name="cvv"
                                                    value={paymentInfo.cvv}
                                                    onChange={handlePaymentChange}
                                                    className={validationErrors.cvv ? 'border-red-300' : ''}
                                                    placeholder="123"
                                                    maxLength={4}
                                                />
                                                {validationErrors.cvv && (
                                                    <p className="text-red-500 text-xs mt-1">{validationErrors.cvv}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Review Order */}
                            {currentStep === 3 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                        <Check className="w-6 h-6 mr-2" />
                                        Review Your Order
                                    </h2>

                                    <div className="space-y-6">
                                        {/* Shipping Details */}
                                        <div className="glass-subtle rounded-lg p-4">
                                            <h3 className="font-semibold text-gray-800 mb-3">Shipping Address</h3>
                                            <div className="text-sm text-gray-600">
                                                <p>{shippingAddress.fullName}</p>
                                                <p>{shippingAddress.address}</p>
                                                <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                                                <p>{shippingAddress.country}</p>
                                                <p>Phone: {shippingAddress.phone}</p>
                                                <p>Email: {shippingAddress.email}</p>
                                            </div>
                                        </div>

                                        {/* Payment Details */}
                                        <div className="glass-subtle rounded-lg p-4">
                                            <h3 className="font-semibold text-gray-800 mb-3">Payment Method</h3>
                                            <div className="text-sm text-gray-600">
                                                <p>Card ending in {paymentInfo.cardNumber.slice(-4)}</p>
                                                <p>{paymentInfo.nameOnCard}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-8">
                                <Button
                                    variant="outline"
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                    className="flex items-center"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Previous
                                </Button>

                                {currentStep < 3 ? (
                                    <Button onClick={nextStep} className="flex items-center">
                                        Next
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={placeOrder} disabled={isProcessing}
                                        className="flex items-center"
                                    >
                                        {isProcessing ? (
                                            <>
                                                {isMobile ? (
                                                    <MobileLoadingAnimations type="spinner" size="sm" className="mr-2" />
                                                ) : (
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                )}
                                                Processing...
                                            </>
                                        ) : (
                                            'Place Order'
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="glass-card rounded-2xl p-6 sticky top-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>
                            <div className="space-y-3 mb-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <span className="text-sm font-medium text-gray-800">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-gray-800">₹{total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="text-gray-800">Free</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="text-gray-800">₹{(total * 0.18).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                                    <span>Total</span>
                                    <span>₹{(total * 1.18).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
