import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Heart, ShoppingBag, User, 
  MapPin, Clock, HelpCircle, ChevronRight, Sparkles, Flame, Grid
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { categories } from '../data/categories';
import { products, formatPrice } from '../data/products';
import SearchBar from './SearchBar';

const Header = () => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [activeCatalogCat, setActiveCatalogCat] = useState(categories[0].slug);
  const { cartCount, subtotal } = useCart();
  const { favoritesCount } = useFavorites();
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const activeCategoryData = categories.find(c => c.slug === activeCatalogCat) || categories[0];
  const activeCategoryProducts = products.filter(p => p.category === activeCatalogCat).slice(0, 6);

  const handleCategoryClick = (slug) => {
    setIsCatalogOpen(false);
    navigate(`/catalog?category=${slug}`);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="top-bar-left">
            <div className="top-bar-item">
              <MapPin size={14} color="#7000FF" />
              <span>Shahar: <span className="city-highlight">Toshkent</span></span>
            </div>
            <Link to="/catalog" className="top-bar-item">
              Topshirish punktlari
            </Link>
            <div className="top-bar-item delivery-notice">
              <Clock size={14} />
              <span>Buyurtmangizni 1 kunda bepul yetkazib beramiz!</span>
            </div>
          </div>
          <div className="top-bar-right">
            <Link to="/orders" className="top-bar-item">
              Buyurtmalarim
            </Link>
            <div className="top-bar-item">
              <HelpCircle size={14} />
              <span>Savol-javoblar</span>
            </div>
            <div className="top-bar-item" style={{ fontWeight: 600 }}>
              🇺🇿 O'zbekcha
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="main-header">
        <div className="container header-row">
          {/* Uzum Logo */}
          <Link to="/" className="brand-logo" onClick={() => setIsCatalogOpen(false)}>
            <div className="brand-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="8" r="3" fill="white" />
                <circle cx="16" cy="8" r="3" fill="white" />
                <circle cx="12" cy="14" r="3" fill="white" />
                <circle cx="8" cy="18" r="2.5" fill="white" />
                <circle cx="16" cy="18" r="2.5" fill="white" />
                <path d="M12 2v3" stroke="white" strokeWidth="2.5" />
              </svg>
            </div>
            <div className="brand-text">
              <span className="brand-title">uzum market</span>
            </div>
          </Link>

          {/* Catalog Button */}
          <button
            className={`catalog-btn ${isCatalogOpen ? 'active' : ''}`}
            onClick={() => setIsCatalogOpen(!isCatalogOpen)}
          >
            {isCatalogOpen ? <X size={20} /> : <Grid size={20} />}
            <span>Katalog</span>
          </button>

          {/* Search Bar */}
          <SearchBar />

          {/* Header Actions */}
          <div className="header-actions">
            <button 
              className="header-action-btn"
              onClick={() => {
                if (user) {
                  navigate('/profile');
                } else {
                  openAuthModal();
                }
              }}
            >
              <User size={22} />
              <span className="header-action-label">
                {user ? user.firstName : 'Kirish'}
              </span>
            </button>

            <Link to="/favorites" className="header-action-btn">
              <Heart size={22} />
              {favoritesCount > 0 && (
                <span className="badge-count">{favoritesCount}</span>
              )}
              <span className="header-action-label">Saralangan</span>
            </Link>

            <Link to="/cart" className="header-action-btn cart-btn-header">
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="badge-count">{cartCount}</span>
              )}
              <span className="header-action-label">Savatcha</span>
            </Link>
          </div>
        </div>

        {/* Categories Sub Navigation Bar */}
        <div className="sub-nav">
          <div className="container">
            <ul className="sub-nav-list">
              <li>
                <Link to="/discounts" className="sub-nav-item">
                  <span className="badge-sale-chip">
                    <Flame size={14} /> Super chegirmalar
                  </span>
                </Link>
              </li>
              {categories.slice(0, 10).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/catalog?category=${cat.slug}`} className="sub-nav-item">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <button 
                  onClick={() => setIsCatalogOpen(true)}
                  className="sub-nav-item"
                  style={{ color: 'var(--primary)', fontWeight: 600 }}
                >
                  Yana...
                </button>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Catalog Mega Menu Overlay */}
      {isCatalogOpen && (
        <div className="catalog-menu-overlay" onClick={() => setIsCatalogOpen(false)}>
          <div className="catalog-menu-content" onClick={(e) => e.stopPropagation()}>
            <div className="container">
              <div className="catalog-grid">
                {/* Left Categories List */}
                <div className="catalog-categories-list">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className={`catalog-cat-item ${activeCatalogCat === cat.slug ? 'active' : ''}`}
                      onMouseEnter={() => setActiveCatalogCat(cat.slug)}
                      onClick={() => handleCategoryClick(cat.slug)}
                    >
                      <div className="catalog-cat-left">
                        <Sparkles size={16} />
                        <span>{cat.name}</span>
                      </div>
                      <ChevronRight size={16} />
                    </div>
                  ))}
                </div>

                {/* Right Category Preview Grid */}
                <div className="catalog-preview">
                  <div className="catalog-preview-title">
                    <span>{activeCategoryData.name} bo'yicha mahsulotlar</span>
                    <button
                      className="section-more-link"
                      onClick={() => handleCategoryClick(activeCategoryData.slug)}
                    >
                      Barchasini ko'rish ({products.filter(p => p.category === activeCategoryData.slug).length})
                    </button>
                  </div>

                  <div className="catalog-preview-grid">
                    {activeCategoryProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="catalog-preview-card"
                        onClick={() => {
                          setIsCatalogOpen(false);
                          navigate(`/product/${prod.id}`);
                        }}
                      >
                        <img src={prod.image} alt={prod.name} className="catalog-preview-img" />
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                            {prod.name.slice(0, 36)}...
                          </div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>
                            {formatPrice(prod.price)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

