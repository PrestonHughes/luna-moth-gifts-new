
import React, { useEffect, useRef, useState } from 'react';
import type { Product, ProductVariant } from '../types';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, variant: ProductVariant) => void;
  products: Product[];
  onProductSelect: (product: Product) => void;
}

const getPriceDisplay = (variants: ProductVariant[]): string => {
    if (!variants || variants.length === 0) return '';
    if (variants.length === 1) return `$${variants[0].price.toFixed(2)}`;
    const prices = variants.map(v => v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
};

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart, products, onProductSelect }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
    const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
    const [activeImageUrl, setActiveImageUrl] = useState(product.imageUrls[0]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        
        modalRef.current?.focus();

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    useEffect(() => {
        // Reset variant and active image when product changes
        setSelectedVariant(product.variants[0]);
        setActiveImageUrl(product.imageUrls[0]);

        // Find recommended products
        // First, try to find products in the same category.
        let related = products
            .filter(p => p.category === product.category && p.id !== product.id);

        // If no products are found in the same category, fall back to featured products.
        if (related.length === 0) {
            related = products.filter(p => p.isFeatured && p.id !== product.id);
        }
        
        // Shuffle the results and take the first 4.
        const finalRecommendations = related
            .sort(() => 0.5 - Math.random()) // shuffle
            .slice(0, 4);
        
        setRecommendedProducts(finalRecommendations);

    }, [product, products]);

    return (
        <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in" 
            onClick={onClose}
            aria-modal="true"
            role="dialog"
            aria-labelledby="product-title"
        >
            <div 
                ref={modalRef}
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 h-auto max-h-[90vh] overflow-y-auto animate-slide-up" 
                onClick={(e) => e.stopPropagation()}
                tabIndex={-1}
            >
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <div className="aspect-square w-full bg-slate-100 rounded-lg mb-4 overflow-hidden">
                                <img 
                                    src={activeImageUrl} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                            <div className="flex gap-2">
                                {product.imageUrls.map((url, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImageUrl(url)}
                                        className={`w-20 h-20 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                                            activeImageUrl === url
                                            ? 'border-brand-purple'
                                            : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                        aria-label={`View image ${index + 1} of ${product.name}`}
                                    >
                                        <img src={url} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover"/>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex justify-between items-start">
                                 <h2 id="product-title" className="font-serif text-4xl font-bold text-brand-deep-purple mb-4">{product.name}</h2>
                                 <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-3xl leading-none -mt-2" aria-label="Close dialog">&times;</button>
                            </div>
                            <p className="text-slate-600 text-lg mb-6">{product.description}</p>
                            
                            {product.variants.length > 1 && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-bold text-slate-600 uppercase mb-2">Size</h3>
                                    <div className="flex gap-2">
                                        {product.variants.map(variant => (
                                            <button
                                                key={variant.size}
                                                onClick={() => setSelectedVariant(variant)}
                                                className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-colors duration-200 ${
                                                    selectedVariant.size === variant.size
                                                        ? 'bg-brand-purple text-white border-brand-purple'
                                                        : 'bg-white text-slate-700 border-slate-300 hover:border-brand-purple'
                                                }`}
                                            >
                                                {variant.size}
                                            </button>
                                        ))}
                                    </div>
                                    {selectedVariant.description && (
                                        <p className="text-sm text-slate-500 mt-3 animate-fade-in">
                                            {selectedVariant.description}
                                        </p>
                                    )}
                                </div>
                            )}
                            
                            <div className="flex-grow"></div>

                            <div className="flex justify-between items-center mt-4">
                                <span className="text-3xl font-bold text-brand-purple">${selectedVariant.price.toFixed(2)}</span>
                                <button 
                                    onClick={() => onAddToCart(product, selectedVariant)}
                                    className="bg-brand-light-purple text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-80 transition-colors duration-300"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* You Might Also Like Section */}
                {recommendedProducts.length > 0 && (
                    <div className="bg-slate-50 p-8 border-t border-slate-200">
                        <h3 className="font-serif text-2xl font-bold text-brand-deep-purple mb-4 text-center">You Might Also Like</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {recommendedProducts.map(recProduct => (
                                <button 
                                    key={recProduct.id} 
                                    onClick={() => onProductSelect(recProduct)}
                                    className="block w-full bg-white rounded-lg overflow-hidden shadow-md group relative border border-slate-200 hover:shadow-xl transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-brand-light-purple"
                                    aria-label={`View details for ${recProduct.name}`}
                                >
                                    <div className="aspect-square">
                                      <img 
                                        src={recProduct.imageUrls[0]} 
                                        alt={recProduct.name} 
                                        className="w-full h-full object-cover" 
                                      />
                                    </div>
                                    <div className="p-3 text-left">
                                      <h4 className="font-bold text-sm text-slate-800 truncate">{recProduct.name}</h4>
                                      <p className="text-sm font-semibold text-brand-purple">{getPriceDisplay(recProduct.variants)}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductModal;
