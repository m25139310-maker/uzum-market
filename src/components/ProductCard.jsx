import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Check, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { formatPrice } from '../data/products';
import QuickViewModal from './QuickViewModal';

const ProductCard = ({ product }) => {
  const { cartItems, addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const navigate = useNavigate();

  const isItemInCart = cartItems.some(item => item.id === product.id);
  const isItemFavorite = isFavorite(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  const handleOpenQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <div 
        className="product-card"
        onClick={() => navigate(`/product/${product.id}`)}
        style={{ cursor: 'pointer' }}
      >
        <div className="product-card-top">
          <img 
            src={product.image} 
            alt={product.name} 
            className="product-card-img"
            loading="lazy"
          />

          {/* Badges */}
          <div className="card-badges">
            {product.discount > 0 && (
              <span className="discount-badge">-{product.discount}%</span>
            )}
            {product.isSuperDiscount && (
              <span className="super-badge">Aksiya</span>
            )}
            <span className="delivery-chip">1 kunda</span>
          </div>

          {/* Action buttons (Fav & Quick View) */}
          <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 2 }}>
            <button
              className={`fav-btn ${isItemFavorite ? 'active' : ''}`}
              style={{ position: 'static' }}
              onClick={handleToggleFavorite}
              aria-label="Sevimlilarga qo'shish"
            >
              <Heart size={18} fill={isItemFavorite ? 'currentColor' : 'none'} />
            </button>

            <button
              className="fav-btn"
              style={{ position: 'static' }}
              onClick={handleOpenQuickView}
              title="Tezkor ko'rish"
            >
              <Eye size={17} />
            </button>
          </div>
        </div>

        <div className="product-card-body">
          <h3 className="product-title" title={product.name}>
            {product.name}
          </h3>

          <div className="product-meta">
            <div className="rating-pill">
              <Star size={13} fill="#F59E0B" color="#F59E0B" />
              <span>{product.rating}</span>
            </div>
            <span className="orders-count">({product.reviewsCount} baho)</span>
            <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#107c41', fontWeight: 600 }}>
              {product.soldCount}
            </span>
          </div>

          {product.monthlyPrice && (
            <div className="installment-tag">
              {formatPrice(product.monthlyPrice).replace("so'm", '')} so'm/oy
            </div>
          )}

          <div className="price-block">
            <div className="price-details">
              {product.oldPrice && (
                <span className="old-price">{formatPrice(product.oldPrice)}</span>
              )}
              <span className="current-price">{formatPrice(product.price)}</span>
            </div>

            <button
              className={`card-cart-btn ${isItemInCart ? 'in-cart' : ''}`}
              onClick={handleAddToCart}
              title={isItemInCart ? "Savatchada mavjud" : "Savatchaga qo'shish"}
            >
              {isItemInCart ? <Check size={18} /> : <ShoppingBag size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
};

export default ProductCard;
