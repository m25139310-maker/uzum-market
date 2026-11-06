import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, CreditCard, Truck, ShieldCheck, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { formatPrice } from '../data/products';
import { useNavigate } from 'react-router-dom';

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const { addToCart, cartItems } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);
  const [selectedImg, setSelectedImg] = useState(product?.image);
  const navigate = useNavigate();

  if (!isOpen || !product) return null;

  const isItemInCart = cartItems.some(item => item.id === product.id);
  const isItemFavorite = isFavorite(product.id);
  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleViewFullPage = () => {
    onClose();
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-window" 
        style={{ maxWidth: '780px', padding: '24px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
          {/* Left Gallery */}
          <div>
            <div style={{ 
              width: '100%', 
              height: '320px', 
              borderRadius: '12px', 
              overflow: 'hidden', 
              background: '#f8f8f8', 
              position: 'relative',
              marginBottom: '10px'
            }}>
              <img 
                src={selectedImg || product.image} 
                alt={product.name} 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
              {product.discount > 0 && (
                <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                  <span className="discount-badge">-{product.discount}%</span>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImg(img)}
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: (selectedImg || product.image) === img ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      cursor: 'pointer'
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Details */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
              {product.categoryName}
            </span>

            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '6px 0 10px 0', lineHeight: 1.3 }}>
              {product.name}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', marginBottom: '14px' }}>
              <div className="rating-pill">
                <Star size={14} fill="#F59E0B" color="#F59E0B" />
                <span>{product.rating}</span>
              </div>
              <span style={{ color: 'var(--text-muted)' }}>({product.reviewsCount} baholar)</span>
              <span style={{ color: '#107c41', fontWeight: 600 }}>{product.soldCount}</span>
            </div>

            <div style={{ background: 'var(--bg-gray)', padding: '12px 16px', borderRadius: '10px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)' }}>
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && (
                  <span style={{ fontSize: '13px', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </div>
              {product.monthlyPrice && (
                <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700, marginTop: '4px' }}>
                  Uzum Nasiya: oyiga {formatPrice(product.monthlyPrice)} dan
                </div>
              )}
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px', maxHeight: '60px', overflow: 'hidden' }}>
              {product.description}
            </p>

            {/* Quantity Stepper */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Miqdori:</span>
              <div className="qty-stepper">
                <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus size={14} />
                </button>
                <span className="qty-value">{quantity}</span>
                <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
              <button
                className="checkout-btn"
                onClick={handleAddToCart}
                style={{ flex: 1, padding: '12px' }}
              >
                <ShoppingBag size={18} />
                <span>{isItemInCart ? "Yana qo'shish" : "Savatchaga qo'shish"}</span>
              </button>

              <button
                className={`fav-large-btn ${isItemFavorite ? 'active' : ''}`}
                onClick={() => toggleFavorite(product)}
                style={{ width: '48px', height: '48px' }}
              >
                <Heart size={20} fill={isItemFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>

            <button
              onClick={handleViewFullPage}
              style={{
                fontSize: '12px',
                color: 'var(--primary)',
                fontWeight: 600,
                textAlign: 'center',
                marginTop: '12px',
                textDecoration: 'underline'
              }}
            >
              Batafsil ma'lumot sahifasiga o'tish →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;

