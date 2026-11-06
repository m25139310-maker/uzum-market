import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, TrendingUp, Sparkles } from 'lucide-react';
import { products, formatPrice } from '../data/products';

const POPULAR_SEARCHES = [
  "iPhone 15 Pro",
  "Krossovka Nike",
  "MacBook Air",
  "Samsung 65 Televizor",
  "Artel Konditsioner",
  "Dyson Changyutgich",
  "Baccarat Rouge",
  "Havo namlagich"
];

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const filteredProducts = query.trim().length > 1
    ? products.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.categoryName.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 7)
    : [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      navigate(`/catalog?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectProduct = (id) => {
    setIsOpen(false);
    navigate(`/product/${id}`);
  };

  const handleQuickTagClick = (tag) => {
    setQuery(tag);
    setIsOpen(false);
    navigate(`/catalog?q=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="search-container" ref={searchRef}>
      <form className="search-bar-form" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="Mahsulotlar va turkumlarni izlash..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {query && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => setQuery('')}
          >
            <X size={18} />
          </button>
        )}
        <button type="submit" className="search-submit-btn">
          <Search size={18} />
          <span className="search-btn-text">Qidirish</span>
        </button>
      </form>

      {isOpen && (
        <div className="search-suggestions">
          {query.trim().length > 1 ? (
            filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
                <div
                  key={item.id}
                  className="suggestion-item"
                  onClick={() => handleSelectProduct(item.id)}
                >
                  <div className="suggestion-left">
                    <img src={item.image} alt={item.name} className="suggestion-thumb" />
                    <div className="suggestion-info">
                      <span className="suggestion-name">{item.name}</span>
                      <span className="suggestion-category">{item.categoryName}</span>
                    </div>
                  </div>
                  <span className="suggestion-price">{formatPrice(item.price)}</span>
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                "{query}" bo'yicha mahsulot topilmadi
              </div>
            )
          ) : (
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '12px' }}>
                <TrendingUp size={15} color="var(--primary)" />
                <span>Ommabop qidiruvlar:</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {POPULAR_SEARCHES.map((tag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickTagClick(tag)}
                    style={{
                      background: 'var(--bg-gray)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '20px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      color: 'var(--text-main)',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Search size={12} color="var(--text-light)" />
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
