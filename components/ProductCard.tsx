
import React from 'react';
import type { Product, ProductVariant } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const getPriceDisplay = (variants: ProductVariant[]): string => {
  if (!variants || variants.length === 0) {
    return '';
  }
  if (variants.length === 1) {
    return `$${variants[0].price.toFixed(2)}`;
  }

  const prices = variants.map(v => v.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <button
      id={`product-${product.id}`}
      onClick={() => onClick(product)}
      className="flex flex-col w-full bg-white rounded-lg overflow-hidden shadow-lg group border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-light-purple focus:ring-opacity-50 transition-shadow duration-300 hover:shadow-xl"
      aria-label={`View details for ${product.name}`}
    >
      <div className="w-full aspect-square overflow-hidden">
        <img
          src={product.imageUrls[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
      </div>

      <div className="p-3 text-left">
        <h3 className="font-serif text-lg font-bold text-brand-deep-purple truncate">{product.name}</h3>
        <p className="font-semibold text-brand-purple">{getPriceDisplay(product.variants)}</p>
      </div>
    </button>
  );
};

export default ProductCard;