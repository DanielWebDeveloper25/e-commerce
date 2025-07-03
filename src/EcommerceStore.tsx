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

export default function EcommerceStore() {
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
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    return () => {
      document.body.classList.remove('modal-open');
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
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-60"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-gray-800 z-70 transition-transform duration-300 transform ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto`}>
        <div className="p-5 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-orange-400">ShopZone</h2>
          <button 
            onClick={() => setShowMobileMenu(false)}
            className="text-white text-2xl hover:text-gray-300"
          >
            &times;
          </button>
        </div>
        
        {/* Account Section */}
        <div className="p-5">
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3 text-lg">Account</h3>
            {isLoggedIn ? (
              <div className="space-y-2">
                <div className="text-orange-400 py-2 font-semibold">
                  Welcome, {userName}!
                </div>
                <button 
                  onClick={handleLogout}
                  className="block text-gray-300 hover:text-orange-400 text-left w-full py-2"
                >
                  Sign Out
                </button>
                <a href="#" className="block text-gray-300 hover:text-orange-400 py-2">
                  Your Orders
                </a>
                <a href="#" className="block text-gray-300 hover:text-orange-400 py-2">
                  Your Wishlist
                </a>
              </div>
            ) : (
              <div className="space-y-2">
                <button 
                  onClick={() => {
                    setShowAuthModal(true);
                    setShowMobileMenu(false);
                    setAuthMode('login');
                  }}
                  className="block text-gray-300 hover:text-orange-400 text-left w-full py-2"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => {
                    setShowAuthModal(true);
                    setShowMobileMenu(false);
                    setAuthMode('signup');
                  }}
                  className="block text-gray-300 hover:text-orange-400 text-left w-full py-2"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3 text-lg">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowMobileMenu(false);
                  }}
                  className={`block w-full text-left py-3 px-3 rounded-lg transition-colors ${
                    selectedCategory === category 
                      ? 'bg-orange-500 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3 text-lg">Help & Settings</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-300 hover:text-orange-400 py-2">
                Customer Service
              </a>
              <a href="#" className="block text-gray-300 hover:text-orange-400 py-2">
                Returns & Exchanges
              </a>
              <a href="#" className="block text-gray-300 hover:text-orange-400 py-2">
                Settings
              </a>
            </div>
          </div>
          
          {/* Cart Summary in Mobile Menu */}
          <div className="p-4 bg-gray-700 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <span className="text-white font-semibold">Cart</span>
              <span className="text-orange-400 font-bold">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-300">Total:</span>
              <span className="text-white font-bold text-lg">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => {
                setShowCart(true);
                setShowMobileMenu(false);
              }}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              View Cart
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </h3>
              <button 
                onClick={() => setShowAuthModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleAuthSubmit}>
              {authMode === 'signup' && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-medium">Full Name</label>
                  <input
                    type="text"
                    required
                    value={authForm.name}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="John Doe"
                  />
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Email</label>
                <input
                  type="email"
                  required
                  value={authForm.email}
                  onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="you@example.com"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">Password</label>
                <input
                  type="password"
                  required
                  value={authForm.password}
                  onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="••••••••"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md font-semibold mb-4 transition-colors"
              >
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
            
            <p className="text-center text-gray-600">
              {authMode === 'login' 
                ? "Don't have an account? " 
                : "Already have an account? "}
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="text-orange-500 hover:underline font-medium"
              >
                {authMode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {orderPlaced ? (
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Order Placed Successfully!</h3>
                <p className="text-gray-600 mb-4">
                  Your order has been successfully placed and is being processed.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-600 mb-2">Order Details:</p>
                  <p className="font-semibold">Order ID: #{Math.floor(Math.random() * 1000000)}</p>
                  <p className="font-semibold">Total: ${total.toFixed(2)}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    You will receive a confirmation email shortly.
                  </p>
                </div>
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
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md font-semibold transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Checkout</h3>
                  <button 
                    onClick={() => setShowCheckout(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleCheckoutSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-medium">Full Name</label>
                    <input
                      type="text"
                      required
                      value={checkoutForm.fullName}
                      onChange={(e) => setCheckoutForm(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-medium">Address</label>
                    <input
                      type="text"
                      required
                      value={checkoutForm.address}
                      onChange={(e) => setCheckoutForm(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="123 Main St"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">City</label>
                      <input
                        type="text"
                        required
                        value={checkoutForm.city}
                        onChange={(e) => setCheckoutForm(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">ZIP Code</label>
                      <input
                        type="text"
                        required
                        value={checkoutForm.zipCode}
                        onChange={(e) => setCheckoutForm(prev => ({ ...prev, zipCode: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder="10001"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-medium">Card Number</label>
                    <input
                      type="text"
                      required
                      value={checkoutForm.cardNumber}
                      onChange={(e) => setCheckoutForm(prev => ({ ...prev, cardNumber: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="4242 4242 4242 4242"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">Expiry Date</label>
                      <input
                        type="text"
                        required
                        value={checkoutForm.expiryDate}
                        onChange={(e) => setCheckoutForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">CVV</label>
                      <input
                        type="text"
                        required
                        value={checkoutForm.cvv}
                        onChange={(e) => setCheckoutForm(prev => ({ ...prev, cvv: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder="123"
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">Total: ${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => setShowCheckout(false)}
                        className="text-gray-600 hover:text-gray-800 px-4 py-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md font-semibold transition-colors"
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
      <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo & Menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowMobileMenu(true)}
                className="p-2 md:hidden hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-orange-400">ShopZone</h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>

            {/* User & Cart */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="hidden md:flex items-center space-x-2">
                  <span className="text-orange-400 font-medium">Welcome, {userName}</span>
                  <User 
                    className="w-6 h-6 cursor-pointer hover:text-orange-400 transition-colors" 
                    onClick={handleLogout}
                    title="Sign Out"
                  />
                </div>
              ) : (
                <User 
                  className="w-6 h-6 cursor-pointer hover:text-orange-400 transition-colors hidden md:block" 
                  onClick={() => {
                    setShowAuthModal(true);
                    setAuthMode('login');
                  }}
                  title="Sign In"
                />
              )}
              <button
                onClick={() => setShowCart(!showCart)}
                className="relative p-2 hover:text-orange-400 transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="mt-3 flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    {renderStars(product.rating)}
                    <span className="text-sm text-gray-500">({product.reviews})</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Cart Sidebar */}
        {showCart && (
          <div className="w-80 bg-white rounded-lg shadow-md p-6 h-fit sticky top-24">
            <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
            
            {cart.length === 0 ? (
              <p className="text-gray-500">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center space-x-3 border-b pb-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                        <p className="text-green-600 font-semibold">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 hover:bg-red-100 text-red-500 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-lg">Total: ${total.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setShowCart(false);
                      setShowCheckout(true);
                    }}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md font-semibold transition-colors"
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
