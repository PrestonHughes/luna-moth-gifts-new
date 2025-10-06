

import React, { useState, useMemo, useEffect } from 'react';
import type { User, Page, Product, CartItem, ProductVariant, Order } from './types';
import type firebase from 'firebase/compat/app';
import { products } from './constants';
import { onAuthStateChangedListener, signOutUser } from './services/firebaseService';
import { getUserProfile, createUserProfile, getCart, updateCart, updateUserProfile } from './services/firestoreService';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import ProductModal from './components/ProductModal';
import CartPanel from './components/CartPanel';
import MobileMenu from './components/MobileMenu';
import GeminiCrystalFinder from './components/GeminiCrystalFinder';
import ProductGrid from './components/ProductGrid';
import { ToastProvider } from './components/ToastProvider';
import { useToast } from './hooks/useToast';


// Pages
import InventoryPage from './pages/InventoryPage';
import AccountPage from './pages/AccountPage';

// A simple debounce hook to delay function execution
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}


const AppContent: React.FC = () => {
    // State management
    const [firebaseUser, setFirebaseUser] = useState<firebase.User | null>(null);
    const [appUser, setAppUser] = useState<User | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartPanelOpen, setIsCartPanelOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCartLoaded, setIsCartLoaded] = useState(false);
    const { addToast } = useToast();

    const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    // Mock Order Data for demonstration
    const mockOrders: Order[] = [
        {
            id: 'LMG-84321',
            date: '2023-10-26',
            total: 75.00,
            items: [
                { productId: '2', name: 'Rose Quartz', size: 'Standard', quantity: 1, price: 25.00, imageUrl: 'https://source.unsplash.com/400x400/?rose,quartz&sig=101' },
                { productId: '5', name: 'Citrine Geode', size: 'Standard', quantity: 1, price: 50.00, imageUrl: 'https://source.unsplash.com/400x400/?citrine,geode&sig=102' }
            ]
        },
        {
            id: 'LMG-84119',
            date: '2023-08-15',
            total: 53.00,
            items: [
                { productId: '6', name: 'Selenite Wand', size: 'Standard', quantity: 1, price: 18.00, imageUrl: 'https://source.unsplash.com/400x400/?selenite,wand&sig=103' },
                { productId: '7', name: 'Labradorite Palm Stone', size: 'Medium', quantity: 1, price: 35.00, imageUrl: 'https://source.unsplash.com/400x400/?labradorite&sig=104' }
            ]
        }
    ];
    
    // Effect 1: Listen for Firebase auth state changes and update the raw firebaseUser state.
    // This is the single source of truth for authentication status.
    useEffect(() => {
        console.log('[Auth Effect] Setting up auth state listener');
        const unsubscribe = onAuthStateChangedListener((user) => {
            console.log('[Auth Effect] Auth state changed:', user ? `User logged in: ${user.email}` : 'User logged out');
            setFirebaseUser(user);
        });
        // Cleanup subscription on component unmount
        return unsubscribe;
    }, []);

    // Effect 2: React to changes in the firebaseUser state.
    // When a user logs in or out, this effect manages fetching/creating their profile
    // and loading their cart data from Firestore.
    useEffect(() => {
        console.log('[User Effect] firebaseUser changed:', firebaseUser ? `UID: ${firebaseUser.uid}` : 'null');
        const manageUserAndCart = async () => {
            try {
                if (firebaseUser) {
                    console.log('[User Effect] Fetching user profile for:', firebaseUser.uid);
                    let userProfile = await getUserProfile(firebaseUser.uid);

                    // If profile doesn't exist, create it (first-time sign-up)
                    if (!userProfile) {
                        console.log('[User Effect] No profile found, creating new profile');
                        userProfile = await createUserProfile({ uid: firebaseUser.uid, email: firebaseUser.email! });
                    }
                    
                    const finalUser: User = {
                        ...userProfile,
                        orders: (userProfile.orders && userProfile.orders.length > 0) ? userProfile.orders : mockOrders,
                    };
                    console.log('[User Effect] Setting appUser:', finalUser);
                    setAppUser(finalUser);

                    // Fetch the user's cart from Firestore
                    const remoteCart = await getCart(firebaseUser.uid);
                    setCartItems(remoteCart);
                    setIsCartLoaded(true);

                } else {
                    console.log('[User Effect] Clearing user state');
                    setAppUser(null);
                    setCartItems([]); // Clear cart on logout
                    setIsCartLoaded(false); // Reset cart loaded status
                }
            } catch (error) {
                console.error("Error managing user data:", error);
                // Ensure app is usable even if data fetch fails
                setAppUser(null);
                setCartItems([]);
                setIsCartLoaded(false);
            } finally {
                setIsLoadingUser(false);
            }
        };

        manageUserAndCart();
    }, [firebaseUser]);


    // Debounce cart updates to Firestore
    const debouncedCartItems = useDebounce(cartItems, 500);

    // Effect to save cart to Firestore when it changes
    useEffect(() => {
        if (appUser && isCartLoaded) {
            updateCart(appUser.uid, debouncedCartItems);
        }
    }, [debouncedCartItems, appUser, isCartLoaded]);


    // Handlers
    const navigateTo = (page: Page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };
    
    const handleLoginSuccess = () => {
        console.log('[Login] Login success callback triggered');
        // The onAuthStateChangedListener will automatically update firebaseUser
        // when Firebase authentication completes, which then triggers the user profile fetch.
        setIsAuthModalOpen(false); // Close the modal on success
    };

    const handleLogout = async () => {
        await signOutUser();
        setCurrentPage('home'); // Redirect to home on logout
    };
    
    const handleUpdateUser = async (updatedInfo: Partial<User>) => {
        if (appUser) {
            await updateUserProfile(appUser.uid, updatedInfo);
            setAppUser({ ...appUser, ...updatedInfo });
        }
    };

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
    };

    const handleAddToCart = (productToAdd: Product, variant: ProductVariant) => {
        setCartItems(prevItems => {
            const cartId = `${productToAdd.id}-${variant.size}`;
            const existingItem = prevItems.find(item => item.cartId === cartId);

            if (existingItem) {
                return prevItems.map(item =>
                    item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevItems, { ...productToAdd, quantity: 1, selectedVariant: variant, cartId }];
        });
        setSelectedProduct(null); // Close modal after adding
        addToast(`${productToAdd.name} added to cart`); // Show toast notification
    };
    
    const handleUpdateCartQuantity = (cartId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            handleRemoveFromCart(cartId);
        } else {
            setCartItems(items => items.map(item => item.cartId === cartId ? { ...item, quantity: newQuantity } : item));
        }
    };

    const handleRemoveFromCart = (cartId: string) => {
        setCartItems(items => items.filter(item => item.cartId !== cartId));
    };
    
    const featuredProducts = useMemo(() => {
        return products
            .filter(p => p.isFeatured)
            .sort(() => 0.5 - Math.random())
            .slice(0, 8);
    }, []);

    const HomePage = () => (
      <div className="space-y-16 md:space-y-24">
        {/* Hero & Crystal Finder Section */}
        <section className="relative text-center animate-fade-in rounded-2xl overflow-hidden py-16 px-4">
            <div className="absolute inset-0 bg-gradient-to-b from-brand-lavender/30 to-transparent -z-10"></div>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-brand-deep-purple mb-4">
              Find Your Perfect Stone
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10">
              Not sure what you're looking for? Let our AI-powered Crystal Oracle guide you.
              <br/>
              Share a feeling or intention, and we'll find the treasure to help manifest it.
            </p>
            <GeminiCrystalFinder products={products} onProductSelect={handleProductClick} />
        </section>

        {/* Featured Products */}
        <section className="animate-slide-up">
            <h2 className="font-serif text-4xl font-bold text-center text-brand-deep-purple mb-8">
              Featured Products
            </h2>
            <ProductGrid products={featuredProducts} onProductClick={handleProductClick} />
            <div className="text-center mt-12">
                <button
                    onClick={() => navigateTo('inventory')}
                    className="bg-brand-light-purple text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity duration-300"
                    aria-label="View the full collection of products"
                >
                    View Full Collection
                </button>
            </div>
        </section>
      </div>
    );
    
    // Render logic
    const renderPage = () => {
        switch (currentPage) {
            case 'inventory':
                return <InventoryPage products={products} onProductClick={handleProductClick} />;
            case 'account':
                return <AccountPage user={appUser} onLogoutClick={handleLogout} onUpdateUser={handleUpdateUser} />;
            case 'home':
            default:
                return <HomePage />;
        }
    };

    return (
        <div className="font-sans antialiased">
            {/* The main content of the page that will be blurred */}
            <div className={`transition-all duration-300 ${isMobileMenuOpen ? 'blur-sm scale-[.98] pointer-events-none' : ''}`}>
                <Header
                    user={appUser}
                    isLoadingUser={isLoadingUser}
                    onLoginClick={() => setIsAuthModalOpen(true)}
                    onLogoutClick={handleLogout}
                    navigateTo={navigateTo}
                    onCartClick={() => setIsCartPanelOpen(true)}
                    cartItemCount={cartItemCount}
                    isMenuOpen={isMobileMenuOpen}
                    onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    currentPage={currentPage}
                />

                <main className="container mx-auto px-4 py-8 md:py-16">
                    {renderPage()}
                </main>

                <Footer />
            </div>

            {/* Modals and Panels that appear over the blurred content */}
            {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={handleLoginSuccess} />}
            {selectedProduct && 
                <ProductModal 
                    product={selectedProduct} 
                    onClose={() => setSelectedProduct(null)} 
                    onAddToCart={handleAddToCart} 
                    products={products}
                    onProductSelect={setSelectedProduct}
                />
            }
            <CartPanel 
                isOpen={isCartPanelOpen}
                onClose={() => setIsCartPanelOpen(false)}
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateCartQuantity}
                onRemoveItem={handleRemoveFromCart}
                onCheckout={() => {
                    // This will be implemented later. For now, it navigates home.
                    setIsCartPanelOpen(false);
                    navigateTo('home');
                    addToast("Checkout is not yet implemented.");
                }}
            />
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                user={appUser}
                onLoginClick={() => setIsAuthModalOpen(true)}
                onLogoutClick={handleLogout}
                navigateTo={navigateTo}
                onCartClick={() => setIsCartPanelOpen(true)}
                cartItemCount={cartItemCount}
                currentPage={currentPage}
            />
        </div>
    );
};

const App: React.FC = () => (
    <ToastProvider>
        <AppContent />
    </ToastProvider>
);

export default App;