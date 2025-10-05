
import React, { useState, useMemo, useEffect } from 'react';
import ProductGrid from '../components/ProductGrid';
import type { Product } from '../types';
import { SearchIcon } from '../components/icons/SearchIcon';

interface InventoryPageProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

const INITIAL_LOAD_COUNT = 16;
const LOAD_MORE_COUNT = 16;

const getMinPrice = (product: Product) => {
    if (!product.variants || product.variants.length === 0) return Infinity;
    return Math.min(...product.variants.map(v => v.price));
};

const InventoryPage: React.FC<InventoryPageProps> = ({ products, onProductClick }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD_COUNT);

  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category)))], [products]);

  const displayedProducts = useMemo(() => {
    let filtered = products;

    if (activeCategory !== 'All') {
      filtered = products.filter(p => p.category === activeCategory);
    }

    if (searchQuery.trim() !== '') {
        const lowercasedQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(lowercasedQuery) ||
            p.description.toLowerCase().includes(lowercasedQuery)
        );
    }

    switch (sortOption) {
      case 'price-asc':
        return [...filtered].sort((a, b) => getMinPrice(a) - getMinPrice(b));
      case 'price-desc':
        return [...filtered].sort((a, b) => getMinPrice(b) - getMinPrice(a));
      case 'name-asc':
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return [...filtered].sort((a, b) => b.name.localeCompare(a.name));
      default:
        return filtered;
    }
  }, [products, activeCategory, sortOption, searchQuery]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(INITIAL_LOAD_COUNT);
  }, [activeCategory, sortOption, searchQuery]);

  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + LOAD_MORE_COUNT);
  };

  const productsToShow = displayedProducts.slice(0, visibleCount);

  return (
    <div className="animate-fade-in">
      <h1 className="font-serif text-5xl font-bold text-center text-brand-deep-purple mb-12">
        Our Collection
      </h1>
      
      {/* Filters and Sorting Controls */}
      <div className="mb-10 flex flex-col xl:flex-row justify-between items-center gap-6 p-4 bg-white/50 rounded-lg border border-slate-200 xl:sticky xl:top-24 z-40 backdrop-blur-sm">
        {/* Category Filters */}
        <div className="w-full xl:w-auto">
          <h2 className="text-sm font-bold text-slate-600 uppercase mb-2 text-center xl:text-left">Filter by Category</h2>
          <div className="flex flex-wrap justify-center xl:justify-start gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full border text-sm font-semibold transition-colors duration-200 ${
                  activeCategory === category
                    ? 'bg-brand-purple text-white border-brand-purple'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-brand-purple'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Search and Sort container */}
        <div className="flex flex-col sm:flex-row flex-wrap sm:items-end sm:justify-end gap-4 w-full xl:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-auto">
                <label htmlFor="search-input" className="block text-sm font-bold text-slate-600 uppercase mb-2 text-center xl:text-left">Search</label>
                <div className="relative">
                    <input
                        id="search-input"
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search collection..."
                        className="bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-light-purple w-full sm:w-64"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
            </div>
            
            {/* Sort Dropdown */}
            <div className="flex-shrink-0 w-full sm:w-auto">
              <label htmlFor="sort-select" className="block text-sm font-bold text-slate-600 uppercase mb-2 text-center xl:text-left">Sort by</label>
              <select
                id="sort-select"
                value={sortOption}
                onChange={e => setSortOption(e.target.value as SortOption)}
                className="bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-light-purple w-full sm:w-64"
              >
                <option value="default">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
              </select>
            </div>
        </div>
      </div>
      
      <ProductGrid products={productsToShow} onProductClick={onProductClick} />

      {displayedProducts.length === 0 && (
          <div className="text-center py-16">
              <h3 className="font-serif text-2xl font-bold text-brand-deep-purple">No Products Found</h3>
              <p className="text-slate-600 mt-2">Try adjusting your search or filters.</p>
          </div>
      )}

      {visibleCount < displayedProducts.length && (
        <div className="text-center mt-12">
            <button
                onClick={handleLoadMore}
                className="bg-brand-light-purple text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity duration-300"
                aria-label="Load more products"
            >
                Load More
            </button>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
