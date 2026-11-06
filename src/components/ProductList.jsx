import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

const ProductList = ({ title, products = [], limit, linkTo, icon }) => {
  const displayProducts = limit ? products.slice(0, limit) : products;

  if (displayProducts.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
        Mahsulotlar topilmadi
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '36px' }}>
      {title && (
        <div className="section-header">
          <h2 className="section-title">
            {icon}
            <span>{title}</span>
          </h2>
          {linkTo && (
            <Link to={linkTo} className="section-more-link">
              <span>Barchasini ko'rish</span>
              <ChevronRight size={18} />
            </Link>
          )}
        </div>
      )}

      <div className="product-grid">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;

