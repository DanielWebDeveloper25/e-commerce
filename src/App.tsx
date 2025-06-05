import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Star, Plus, Minus, Trash2, Menu, User, CheckCircle } from 'lucide-react';

// Types
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

// Sample data
const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    rating: 4.5,
    reviews: 1204,
    category: "Electronics",
    description: "Premium wireless headphones with noise cancellation and 30-hour battery life."
  },
  {
    id: 2,
    name: "Smart Watch Series 8",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
    rating: 4.8,
    reviews: 892,
    category: "Electronics",
    description: "Advanced fitness tracking, heart rate monitoring, and smartphone integration."
  },
  {
    id: 3,
    name: "Laptop Backpack",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
    rating: 4.3,
    reviews: 567,
    category: "Accessories",
    description: "Durable laptop backpack with multiple compartments and USB charging port."
  },
  {
    id: 4,
    name: "Coffee Maker Pro",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop",
    rating: 4.6,
    reviews: 234,
    category: "Home",
    description: "Programmable coffee maker with built-in grinder and thermal carafe."
  },
  {
    id: 5,
    name: "Fitness Resistance Bands",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
    rating: 4.4,
    reviews: 1456,
    category: "Sports",
    description: "Set of 5 resistance bands with different resistance levels for full-body workout."
  },
  {
    id: 6,
    name: "Wireless Phone Charger",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=300&fit=crop",
    rating: 4.2,
    reviews: 789,
    category: "Electronics",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices."
  },
  {
    id: 7,
    name: "Gaming Mechanical Keyboard",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop",
    rating: 4.7,
    reviews: 543,
    category: "Electronics",
    description: "RGB mechanical gaming keyboard with blue switches and customizable lighting."
  },
  {
    id: 8,
    name: "Yoga Mat Premium",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop",
    rating: 4.5,
    reviews: 892,
    category: "Sports",
    description: "Non-slip premium yoga mat with alignment lines and carrying strap."
  }
];

const categories = ["All", "Electronics", "Accessories", "Home", "Sports"];

export default function App() {
  const [products] = useState<Product[]>(sampleProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCart, setShowCart] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  // Checkout form state
  const [checkoutForm, setCheckoutForm] = useState({
    fullName: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  // Auth form state
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Handle body scroll locking for modals
  useEffect(() => {
    const shouldLockScroll = showMobileMenu || showCheckout || showAuthModal;
    if (shouldLockScroll) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu, showCheckout, showAuthModal]);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Add to cart
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Update quantity
  const updateQuantity = (id: number, change: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  // Remove from cart
  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // Calculate total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Handle auth form submission
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'login') {
      setIsLoggedIn(true);
      setUserName(authForm.email.split('@')[0]);
    } else {
      setIsLoggedIn(true);
      setUserName(authForm.name);
    }
    setShowAuthModal(false);
    setAuthForm({ name: '', email: '', password: '' });
  };

  // Handle checkout form submission
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderPlaced(true);
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setShowMobileMenu(false);
  };

  // Render stars
  const renderStars = (rating: number) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            color={star <= rating ? '#FCD34D' : '#D1D5DB'}
            fill={star <= rating ? '#FCD34D' : 'none'}
          />
        ))}
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 60
          }}
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: showMobileMenu ? 0 : '-320px',
        width: '320px',
        height: '100vh',
        backgroundColor: '#1F2937',
        zIndex: 70,
        transition: 'left 0.3s ease-in-out',
        padding: '20px',
        overflowY: 'auto'
      }}>
        <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: '#FB923C', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
            ShopZone
          </h2>
          <button 
            onClick={() => setShowMobileMenu(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '24px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Account Section */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: '0 0 10px 0' }}>
            Account
          </h3>
          {isLoggedIn ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ color: '#FB923C', padding: '8px 0', fontWeight: '600' }}>
                Welcome, {userName}!
              </div>
              <button 
                onClick={handleLogout}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#D1D5DB', 
                  textAlign: 'left', 
                  padding: '8px 0', 
                  cursor: 'pointer' 
                }}
              >
                Sign Out
              </button>
              <a href="#" style={{ color: '#D1D5DB', textDecoration: 'none', padding: '8px 0' }}>
                Your Orders
              </a>
              <a href="#" style={{ color: '#D1D5DB', textDecoration: 'none', padding: '8px 0' }}>
                Your Wishlist
              </a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                onClick={() => {
                  setShowAuthModal(true);
                  setShowMobileMenu(false);
                  setAuthMode('login');
                }}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#D1D5DB', 
                  textAlign: 'left', 
                  padding: '8px 0', 
                  cursor: 'pointer' 
                }}
              >
                Sign In
              </button>
              <button 
                onClick={() => {
                  setShowAuthModal(true);
                  setShowMobileMenu(false);
                  setAuthMode('signup');
                }}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#D1D5DB', 
                  textAlign: 'left', 
                  padding: '8px 0', 
                  cursor: 'pointer' 
                }}
              >
                Create Account
              </button>
            </div>
          )}
        </div>

        {/* Categories Section */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: '0 0 10px 0' }}>
            Shop by Department
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setShowMobileMenu(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: selectedCategory === category ? '#FB923C' : '#D1D5DB',
                  textAlign: 'left',
                  padding: '8px 0',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: '0 0 10px 0' }}>
            Help & Settings
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a href="#" style={{ color: '#D1D5DB', textDecoration: 'none', padding: '8px 0' }}>
              Customer Service
            </a>
            <a href="#" style={{ color: '#D1D5DB', textDecoration: 'none', padding: '8px 0' }}>
              Returns & Exchanges
            </a>
            <a href="#" style={{ color: '#D1D5DB', textDecoration: 'none', padding: '8px 0' }}>
              Settings
            </a>
          </div>
        </div>

        {/* Mobile Cart Summary */}
        <div style={{
          padding: '16px',
          backgroundColor: '#374151',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: 'white', fontWeight: '600' }}>Cart</span>
            <span style={{ color: '#FB923C', fontWeight: 'bold' }}>
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#D1D5DB' }}>Total:</span>
            <span style={{ color: 'white', fontWeight: 'bold' }}>${total.toFixed(2)}</span>
          </div>
          <button
            onClick={() => {
              setShowCart(true);
              setShowMobileMenu(false);
            }}
            style={{
              width: '100%',
              backgroundColor: '#FB923C',
              color: 'white',
              padding: '8px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            View Cart
          </button>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            width: '100%',
            maxWidth: '400px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </h3>
              <button 
                onClick={() => setShowAuthModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6B7280'
                }}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAuthSubmit}>
              {authMode === 'signup' && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', color: '#374151', marginBottom: '8px', fontWeight: '500' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={authForm.name}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, name: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                    placeholder="John Doe"
                  />
                </div>
              )}
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#374151', marginBottom: '8px', fontWeight: '500' }}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={authForm.email}
                  onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="you@example.com"
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#374151', marginBottom: '8px', fontWeight: '500' }}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={authForm.password}
                  onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="••••••••"
                />
              </div>
              
              <button 
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#FB923C',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontWeight: '500',
                  cursor: 'pointer',
                  marginBottom: '16px'
                }}
              >
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
            
            <p style={{ textAlign: 'center', color: '#6B7280', margin: 0 }}>
              {authMode === 'login' 
                ? "Don't have an account? " 
                : "Already have an account? "}
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FB923C',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {authMode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {orderPlaced ? (
              <div style={{ textAlign: 'center' }}>
                <CheckCircle size={64} style={{ color: '#10B981', margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Order Placed!</h3>
                <p style={{ color: '#6B7280', marginBottom: '16px' }}>
                  Your order has been successfully placed. Order ID: #{Math.floor(Math.random() * 1000000)}
                </p>
                <p style={{ color: '#6B7280', marginBottom: '20px' }}>
                  Total: ${total.toFixed(2)}
                </p>
                <button
                  onClick={() => {
                    setShowCheckout(false);
                    setOrderPlaced(false);
                    setCart([]);
                    setCheckoutForm({
                      fullName: '',
                      address: '',
                      city: '',
                      zipCode: '',
                      cardNumber: '',
                      expiryDate: '',
                      cvv: ''
                    });
                  }}
                  style={{
                    backgroundColor: '#FB923C',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    border: 'none',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Checkout</h3>
                  <button 
                    onClick={() => setShowCheckout(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '24px',
                      cursor: 'pointer',
                      color: '#6B7280'
                    }}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCheckoutSubmit}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', color: '#374151', marginBottom: '8px', fontWeight: '500' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={checkoutForm.fullName}
                      onChange={(e) => setCheckoutForm(prev => ({ ...prev, fullName: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px'
                      }}
                      placeholder="John Doe"
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', color: '#374151', marginBottom: '8px', fontWeight: '500' }}>
                      Address
                    </label>
                    <input
                      type="text"
                      required
                      value={checkoutForm.address}
                      onChange={(e) => setCheckoutForm(prev => ({ ...prev, address: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px'
                      }}
                      placeholder="123 Main St"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', color: '#374151', marginBottom: '8px', fontWeight: '500' }}>
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={checkoutForm.city}
                        onChange={(e) => setCheckoutForm(prev => ({ ...prev, city: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px'
                        }}
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: '#374151', marginBottom: '8px', fontWeight: '500' }}>
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        required
                        value={checkoutForm.zipCode}
                        onChange={(e) => setCheckoutForm(prev => ({ ...prev, zipCode: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px'
                        }}
                        placeholder="10001"
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', color: '#374151', marginBottom: '8px', fontWeight: '500' }}>
                      Card Number
                    </label>
                    <input
                      type="text"
                      required
                      value={checkoutForm.cardNumber}
                      onChange={(e) => setCheckoutForm(prev => ({ ...prev, cardNumber: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px'
                      }}
                      placeholder="4242 4242 4242 4242"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', color: '#374151', marginBottom: '8px', fontWeight: '500' }}>
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        required
                        value={checkoutForm.expiryDate}
                        onChange={(e) => setCheckoutForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px'
                        }}
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: '#374151', marginBottom: '8px', fontWeight: '500' }}>
                        CVV
                      </label>
                      <input
                        type="text"
                        required
                        value={checkoutForm.cvv}
                        onChange={(e) => setCheckoutForm(prev => ({ ...prev, cvv: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px'
                        }}
                        placeholder="123"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setShowCheckout(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#6B7280',
                        padding: '12px 16px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
                        Total: ${total.toFixed(2)}
                      </span>
                      <button
                        type="submit"
                        style={{
                          backgroundColor: '#FB923C',
                          color: 'white',
                          padding: '12px 24px',
                          borderRadius: '6px',
                          border: 'none',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        Place Order
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <header style={{ 
        backgroundColor: '#1F2937', 
        color: 'white', 
        position: 'sticky', 
        top: 0, 
        zIndex: 50,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Logo & Menu */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={() => setShowMobileMenu(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <Menu size={24} />
              </button>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#FB923C', margin: 0 }}>ShopZone</h1>
            </div>

            {/* Search Bar */}
            <div style={{ flex: 1, maxWidth: '512px', margin: '0 16px' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 40px',
                    borderRadius: '6px',
                    border: 'none',
                    color: '#1F2937',
                    outline: 'none'
                  }}
                />
                <Search size={20} style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: '#9CA3AF' 
                }} />
              </div>
            </div>

            {/* User & Cart */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {isLoggedIn ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#FB923C', fontWeight: '500' }}>
                    {userName}
                  </span>
                  <User 
                    size={24} 
                    style={{ cursor: 'pointer', color: '#FB923C' }}
                    onClick={handleLogout}
                  />
                </div>
              ) : (
                <User 
                  size={24} 
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setShowAuthModal(true);
                    setAuthMode('login');
                  }}
                />
              )}
              <button
                onClick={() => setShowCart(!showCart)}
                style={{ 
                  position: 'relative', 
                  padding: '8px', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  color: 'white'
                }}
              >
                <ShoppingCart size={24} />
                {itemCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: '#FB923C',
                    color: 'white',
                    fontSize: '12px',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Categories - Desktop Only */}
          <div style={{ 
            marginTop: '12px', 
            display: 'flex', 
            gap: '16px', 
            overflowX: 'auto', 
            paddingBottom: '8px' 
          }}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  whiteSpace: 'nowrap',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: selectedCategory === category ? '#FB923C' : '#374151',
                  color: 'white'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px', display: 'flex', gap: '24px' }}>
        {/* Main Content */}
        <div style={{ flex: 1 }}>
          {/* Products Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '24px' 
          }}>
            {filteredProducts.map(product => (
              <div key={product.id} style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                transition: 'box-shadow 0.2s'
              }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '192px', objectFit: 'cover' }}
                />
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontWeight: '600', fontSize: '18px', margin: '0 0 8px 0', lineHeight: '1.4' }}>
                    {product.name}
                  </h3>
                  <p style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                    {product.description}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    {renderStars(product.rating)}
                    <span style={{ fontSize: '14px', color: '#6B7280' }}>({product.reviews})</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>
                      ${product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      style={{
                        backgroundColor: '#FB923C',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: '500'
                      }}
                    >
                      <Plus size={16} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div style={{ textAlign: 'center', paddingTop: '48px', paddingBottom: '48px' }}>
              <p style={{ color: '#6B7280', fontSize: '18px' }}>No products found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Cart Sidebar */}
        {showCart && (
          <div style={{
            width: '320px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '24px',
            height: 'fit-content',
            position: 'sticky',
            top: '96px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 16px 0' }}>Shopping Cart</h2>
            
            {cart.length === 0 ? (
              <p style={{ color: '#6B7280' }}>Your cart is empty</p>
            ) : (
              <>
                <div style={{ marginBottom: '24px' }}>
                  {cart.map(item => (
                    <div key={item.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      borderBottom: '1px solid #E5E7EB',
                      paddingBottom: '12px',
                      marginBottom: '12px'
                    }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontWeight: '500', fontSize: '14px', margin: '0 0 4px 0', lineHeight: '1.3' }}>
                          {item.name}
                        </h4>
                        <p style={{ color: '#059669', fontWeight: '600', margin: 0 }}>${item.price.toFixed(2)}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          style={{
                            padding: '4px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '4px'
                          }}
                        >
                          <Minus size={16} />
                        </button>
                        <span style={{ width: '32px', textAlign: 'center' }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          style={{
                            padding: '4px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '4px'
                          }}
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            padding: '4px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#EF4444',
                            borderRadius: '4px'
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Total: ${total.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setShowCart(false);
                      setShowCheckout(true);
                    }}
                    style={{
                      width: '100%',
                      backgroundColor: '#FB923C',
                      color: 'white',
                      padding: '12px',
                      borderRadius: '6px',
                      border: 'none',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}