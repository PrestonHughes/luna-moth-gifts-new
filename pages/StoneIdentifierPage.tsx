import React, { useState, useEffect } from 'react';
import { User, Product, GeminiSuggestion, Page } from '../types';
import { getVisualSearchesToday, logVisualSearch } from '../services/firestoreService';
import { identifyCrystalFromImage } from '../services/geminiService';
import { UploadIcon } from '../components/icons/UploadIcon';
import { CrystalBallIcon } from '../components/icons/CrystalBallIcon';
import { UserIcon } from '../components/icons/UserIcon';

interface StoneIdentifierPageProps {
  user: User | null;
  products: Product[];
  onProductClick: (product: Product) => void;
  onLoginClick: () => void;
  navigateTo: (page: Page, context?: { category: string }) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const StoneIdentifierPage: React.FC<StoneIdentifierPageProps> = ({ user, products, onProductClick, onLoginClick, navigateTo }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [searchesRemaining, setSearchesRemaining] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [suggestion, setSuggestion] = useState<GeminiSuggestion | null>(null);

    useEffect(() => {
        const fetchSearchCount = async () => {
            if (user && user.role !== 'admin') {
                const count = await getVisualSearchesToday(user.uid);
                setSearchesRemaining(Math.max(0, 5 - count));
            } else if (user?.role === 'admin') {
                setSearchesRemaining(Infinity); // Admin has unlimited searches
            } else {
                setSearchesRemaining(null);
            }
        };

        fetchSearchCount();
    }, [user]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSuggestion(null);
            setError(null);
            setImageFile(file);
            setImagePreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        if (!imageFile || !user) return;

        setIsLoading(true);
        setError(null);
        setSuggestion(null);

        try {
            const base64DataUrl = await fileToBase64(imageFile);
            const base64String = base64DataUrl.split(',')[1];
            
            const result = await identifyCrystalFromImage(base64String, products);
            setSuggestion(result);

            // Log the search if the user is not an admin, regardless of the result.
            if (user.role !== 'admin') {
                await logVisualSearch(user.uid);
                setSearchesRemaining(prev => (prev !== null ? Math.max(0, prev - 1) : 0));
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleViewProduct = (productId: string) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            onProductClick(product);
        }
    };

    const handleSeeSimilar = (category: string) => {
        navigateTo('inventory', { category });
    };

    const renderContent = () => {
        if (!user) {
            return (
                <div className="text-center bg-white p-12 rounded-lg shadow-md border border-slate-200">
                    <UserIcon className="w-16 h-16 mx-auto text-brand-light-purple mb-4" />
                    <h2 className="font-serif text-3xl font-bold text-brand-deep-purple mb-2">Feature Locked</h2>
                    <p className="text-slate-600 mb-6">Please log in or create an account to use the Stone Identifier.</p>
                    <button
                        onClick={onLoginClick}
                        className="bg-brand-purple text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Login / Sign Up
                    </button>
                </div>
            );
        }

        const canSearch = (searchesRemaining !== null && searchesRemaining > 0) || user.role === 'admin';

        return (
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-slate-200">
                <div className="text-center mb-6">
                    <p className="font-semibold text-slate-700">
                        {user.role === 'admin' 
                            ? 'Admin Access: Unlimited searches available.'
                            : `You have ${searchesRemaining} searches remaining today.`}
                    </p>
                    {searchesRemaining === 0 && user.role !== 'admin' &&
                        <p className="text-sm text-slate-500">Please check back tomorrow for more.</p>
                    }
                </div>

                <div className="flex flex-col items-center gap-6">
                    <label htmlFor="image-upload" className="w-full max-w-lg cursor-pointer">
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-brand-purple hover:bg-slate-50 transition-colors">
                            <UploadIcon className="w-12 h-12 mx-auto text-slate-400 mb-2" />
                            <p className="font-semibold text-slate-700">
                                {imageFile ? `Selected: ${imageFile.name}` : "Click to upload or drag & drop an image"}
                            </p>
                            <p className="text-sm text-slate-500">PNG, JPG, or WEBP</p>
                        </div>
                        <input id="image-upload" type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleImageChange} disabled={!canSearch || isLoading} />
                    </label>

                    {imagePreviewUrl && (
                        <div className="w-full max-w-sm">
                            <img src={imagePreviewUrl} alt="Selected crystal" className="rounded-lg shadow-sm object-contain max-h-64 mx-auto" />
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={!imageFile || isLoading || !canSearch}
                        className="bg-brand-light-purple text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-xs"
                    >
                        {isLoading ? 'Identifying...' : 'Identify My Crystal'}
                    </button>
                </div>

                <div className="mt-8 flex items-center justify-center min-h-[120px]">
                    {isLoading && (
                         <div className="flex flex-col items-center gap-2 text-slate-500 animate-fade-in">
                            <CrystalBallIcon className="w-16 h-16 text-brand-light-purple" />
                            <p className="animate-pulse-subtle">The Oracle is gazing into the image...</p>
                        </div>
                    )}
                    {error && <p className="text-red-500 text-center animate-fade-in">{error}</p>}
                    {suggestion && (
                        <div className="bg-brand-lavender/20 p-6 rounded-lg w-full text-center border border-brand-lavender animate-fade-in">
                            <h3 className="font-serif text-3xl font-bold text-brand-purple mb-2">{suggestion.crystalName}</h3>
                            <p className="text-slate-700 text-lg">{suggestion.description}</p>
                            {suggestion.productId ? (
                                <button
                                    onClick={() => handleViewProduct(suggestion.productId!)}
                                    className="mt-4 bg-brand-purple text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-deep-purple transition-colors duration-300"
                                >
                                    View Product in Store
                                </button>
                            ) : suggestion.category ? (
                                <button
                                    onClick={() => handleSeeSimilar(suggestion.category!)}
                                    className="mt-4 bg-brand-purple text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-deep-purple transition-colors duration-300"
                                >
                                    See Similar Products
                                </button>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <h1 className="font-serif text-5xl font-bold text-center text-brand-deep-purple mb-4">
                Stone Identifier
            </h1>
            <p className="text-lg text-slate-600 text-center mb-10 max-w-2xl mx-auto">
                Have a crystal you can't identify? Upload a photo and let our AI-powered tool reveal its secrets.
            </p>
            {renderContent()}
        </div>
    );
};

export default StoneIdentifierPage;