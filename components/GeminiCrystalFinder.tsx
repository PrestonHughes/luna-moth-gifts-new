import React, { useState } from 'react';
import { suggestCrystal } from '../services/geminiService';
import type { GeminiSuggestion, Product } from '../types';
import { SearchIcon } from './icons/SearchIcon';

interface GeminiCrystalFinderProps {
    products: Product[];
    onProductSelect: (product: Product) => void;
}

const GeminiCrystalFinder: React.FC<GeminiCrystalFinderProps> = ({ products, onProductSelect }) => {
    const [query, setQuery] = useState('');
    const [suggestion, setSuggestion] = useState<GeminiSuggestion | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setHasSearched(true);
        setIsLoading(true);
        setError(null);
        setSuggestion(null);

        try {
            const result = await suggestCrystal(query, products);
            setSuggestion(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewProduct = (productId: string) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const productElement = document.getElementById(`product-${productId}`);
        if (productElement) {
            productElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Add a temporary highlight effect
            productElement.classList.add('animate-pulse-subtle');
            setTimeout(() => {
                productElement.classList.remove('animate-pulse-subtle');
            }, 3000);
        }

        // Open the modal after a short delay to allow scroll to start
        setTimeout(() => {
            onProductSelect(product);
        }, 100);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-3xl mx-auto border border-slate-200 transition-all duration-300 ease-in-out">
            <form onSubmit={handleSearch}>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Describe a feeling, intention, or need..."
                        className="flex-grow bg-slate-100 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-light-purple transition-all"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="flex items-center justify-center gap-2 bg-brand-light-purple text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        <SearchIcon className="w-5 h-5" />
                        <span>{isLoading ? 'Consulting...' : 'Consult the Oracle'}</span>
                    </button>
                </div>
            </form>

            {hasSearched && (
                <div className="mt-6 flex items-center justify-center min-h-[120px] animate-fade-in">
                    {isLoading && (
                         <div className="flex flex-col items-center gap-2 text-slate-500 animate-pulse-subtle">
                            <div className="w-8 h-8 border-2 border-brand-light-purple border-t-transparent rounded-full animate-spin"></div>
                            <p>Consulting the oracle...</p>
                        </div>
                    )}
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {suggestion && (
                        <div className="bg-brand-lavender/20 p-6 rounded-lg w-full text-center border border-brand-lavender">
                            <h3 className="font-serif text-3xl font-bold text-brand-purple mb-2">{suggestion.crystalName}</h3>
                            <p className="text-slate-700 text-lg">{suggestion.description}</p>
                            {suggestion.productId && (
                                <button
                                    onClick={() => handleViewProduct(suggestion.productId!)}
                                    className="mt-4 bg-brand-purple text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-deep-purple transition-colors duration-300"
                                >
                                    View Product in Store
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GeminiCrystalFinder;