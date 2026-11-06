import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, ShoppingBag, Star, Truck, ShieldCheck, 
  RotateCcw, Check, ChevronRight, Share2, Plus, Minus, CreditCard 
} from 'lucide-react';
import { products, formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import ProductList from '../components/ProductList';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const product = products.find(p => p.id === Number(id)) || products[0];
  const [selectedImg, setSelectedImg] = useState(product?.image);
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImg(product.image);
      setQuantity(1);
      window.scrollTo(0, 0);
    }
  }, [id, product]);

  if (!product) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>Mahsulot topilmadi</h2>
        <Link to="/catalog" className="checkout-btn" style={{ width: 'fit-content', margin: '20px auto' }}>
          Katalogga qaytish
        </Link>
      </div>
    );
  }

  const isItemInCart = cartItems.some(item => item.id === product.id);
  const isItemFavorite = isFavorite(product.id);

  const imagesList = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  // Similar products in same category
  const similarProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 5);

  return (
    <div className="container">
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', margin: '18px 0' }}>
        <Link to="/" style={{ color: 'var(--text-muted)' }}>Bosh sahifa</Link>
        <ChevronRight size={14} />
        <Link to="/catalog" style={{ color: 'var(--text-muted)' }}>Katalog</Link>
        <ChevronRight size={14} />
        <Link to={`/catalog?category=${product.category}`} style={{ color: 'var(--text-muted)' }}>
          {product.categoryName}
        </Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>
          {product.name.slice(0, 30)}...
        </span>
      </div>

      <div className="details-layout">
        {/* Gallery */}
        <div className="details-gallery">
          {imagesList.length > 1 && (
            <div className="gallery-thumbs">
              {imagesList.map((img, idx) => (
                <div
                  key={idx}
                  className={`thumb-item ${selectedImg === img ? 'active' : ''}`}
                  onClick={() => setSelectedImg(img)}
                >
                  <img src={img} alt={`${product.name} ${idx}`} />
                </div>
              ))}
            </div>
          )}

          <div className="gallery-main">
            <img src={selectedImg} alt={product.name} className="gallery-main-img" />
            {product.discount > 0 && (
              <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                <span className="discount-badge" style={{ fontSize: '14px', padding: '6px 12px' }}>
                  -{product.discount}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Product Details Info */}
        <div className="details-info">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="details-brand-tag">
              {product.features?.Brend || product.categoryName}
            </span>
            <button
              onClick={handleShare}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}
            >
              <Share2 size={16} />
              <span>{copied ? "Nusxalandi!" : "Ulashish"}</span>
            </button>
          </div>

          <h1 className="details-title">{product.name}</h1>

          <div className="details-rating-bar">
            <div className="rating-pill" style={{ fontSize: '14px' }}>
              <Star size={16} fill="#F59E0B" color="#F59E0B" />
              <span>{product.rating}</span>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>
              ({product.reviewsCount} ta sharh va baholar)
            </span>
            <span style={{ color: '#107c41', fontWeight: 600 }}>
              {product.soldCount}
            </span>
          </div>

          {/* Pricing Box */}
          <div className="details-price-box">
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span className="details-current-price">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <span className="details-old-price">{formatPrice(product.oldPrice)}</span>
              )}
            </div>

            {product.monthlyPrice && (
              <div className="details-installment-box">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={18} color="#7000FF" />
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>Uzum Nasiya:</span>
                </div>
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--primary)' }}>
                  oyiga {formatPrice(product.monthlyPrice)} dan 12 oyga
                </span>
              </div>
            )}
          </div>

          {/* Delivery & Guarantees */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '14px 0', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#107c41', fontWeight: 600 }}>
              <Truck size={18} />
              <span>1 kunda bepul yetkazib beriladi (Ertaga topshirish punktida)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
              <ShieldCheck size={18} />
              <span>100% original tovar, rasmiy kafolat bilan</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
              <RotateCcw size={18} />
              <span>10 kun ichida qulay va tezkor qaytarish kafolati</span>
            </div>
          </div>

          {/* Quantity Stepper */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '20px 0' }}>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Miqdori:</span>
            <div className="qty-stepper">
              <button
                className="qty-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus size={15} />
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                className="qty-btn"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus size={15} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="details-actions">
            <button
              className="add-to-cart-large-btn"
              onClick={() => addToCart(product, quantity)}
            >
              <ShoppingBag size={20} />
              <span>
                {isItemInCart ? "Yana savatchaga qo'shish" : "Savatchaga qo'shish"}
              </span>
            </button>

            <button
              className="checkout-btn"
              style={{ background: '#FF6900', boxShadow: 'none' }}
              onClick={handleBuyNow}
            >
              1 marta bosishda xarid qilish
            </button>

            <button
              className={`fav-large-btn ${isItemFavorite ? 'active' : ''}`}
              onClick={() => toggleFavorite(product)}
              title="Sevimlilarga qo'shish"
            >
              <Heart size={22} fill={isItemFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>

      {/* Description & Specs Tabs */}
      <div style={{
        background: '#fff',
        borderRadius: 'var(--radius-xl)',
        padding: '32px',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '40px'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>
          Mahsulot haqida ma'lumot
        </h3>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '24px' }}>
          {product.description}
        </p>

        {product.features && (
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
              Xususiyatlari
            </h4>
            <div className="details-features-table" style={{ maxWidth: '600px' }}>
              {Object.entries(product.features).map(([key, val]) => (
                <div key={key} className="feature-row">
                  <span className="feature-name">{key}</span>
                  <span className="feature-val">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <ProductList
          title="O'xshash mahsulotlar"
          products={similarProducts}
        />
      )}
    </div>
  );
};

export default ProductDetails;

