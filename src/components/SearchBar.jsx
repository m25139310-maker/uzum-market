import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { products, formatPrice } from '../data/products';

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

      {isOpen && filteredProducts.length > 0 && (
        <div className="search-suggestions">
          {filteredProducts.map((item) => (
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
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

