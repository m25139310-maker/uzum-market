import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, RotateCcw, Search, ChevronRight, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, formatPrice } from '../data/products';
import { categories } from '../data/categories';

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('q') || '';
  const sortParam = searchParams.get('sort') || 'popular';

  // Local filter states
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [onlyDiscounted, setOnlyDiscounted] = useState(searchParams.get('discount') === 'true');
  const [selectedRating, setSelectedRating] = useState(0);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category filter
      if (categoryParam && item.category !== categoryParam) {
        return false;
      }

      // Search query filter
      if (searchParam) {
        const query = searchParam.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesCategory = item.categoryName.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesCategory && !matchesDesc) {
          return false;
        }
      }

      // Price filter
      if (minPrice && item.price < Number(minPrice)) {
        return false;
      }
      if (maxPrice && item.price > Number(maxPrice)) {
        return false;
      }

      // Discounted only filter
      if (onlyDiscounted && (!item.discount || item.discount === 0)) {
        return false;
      }

      // Rating filter
      if (selectedRating > 0 && item.rating < selectedRating) {
        return false;
      }

      return true;
    });
  }, [categoryParam, searchParam, minPrice, maxPrice, onlyDiscounted, selectedRating]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortParam) {
      case 'price_asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return list.sort((a, b) => b.price - a.price);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'discount':
        return list.sort((a, b) => (b.discount || 0) - (a.discount || 0));
      case 'popular':
      default:
        return list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }
  }, [filteredProducts, sortParam]);

  const handleCategorySelect = (slug) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug) {
      newParams.set('category', slug);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleSortChange = (newSort) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', newSort);
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setOnlyDiscounted(false);
    setSelectedRating(0);
    setSearchParams({});
  };

  const activeCategoryObject = categories.find(c => c.slug === categoryParam);

  const hasActiveFilters = categoryParam || searchParam || minPrice || maxPrice || onlyDiscounted || selectedRating > 0;

  return (
    <div className="container">
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', margin: '18px 0' }}>
        <Link to="/" style={{ color: 'var(--text-muted)' }}>Bosh sahifa</Link>
        <ChevronRight size={14} />
        <Link to="/catalog" style={{ color: categoryParam ? 'var(--text-muted)' : 'var(--text-main)', fontWeight: categoryParam ? 400 : 600 }}>
          Katalog
        </Link>
        {activeCategoryObject && (
          <>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>
              {activeCategoryObject.name}
            </span>
          </>
        )}
        {searchParam && (
          <>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>
              "{searchParam}" bo'yicha qidiruv
            </span>
          </>
        )}
      </div>

      <div className="catalog-page-layout">
        {/* Left Filter Sidebar */}
        <aside className="filter-sidebar">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SlidersHorizontal size={18} /> Filtrlar
            </h3>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                style={{ fontSize: '12px', color: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                title="Filtrlarni tozalash"
              >
                <RotateCcw size={12} /> Tozalash
              </button>
            )}
          </div>

          {/* Categories Filter */}
          <div className="filter-block">
            <h4 className="filter-title">Kategoriyalar</h4>
            <div className="filter-options-list">
              <label 
                className="filter-checkbox-label"
                style={{ fontWeight: !categoryParam ? 700 : 400, color: !categoryParam ? 'var(--primary)' : 'inherit' }}
                onClick={() => handleCategorySelect('')}
              >
                <span>Barcha toifalar</span>
                <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-light)' }}>
                  ({products.length})
                </span>
              </label>

              {categories.map((cat) => {
                const count = products.filter(p => p.category === cat.slug).length;
                return (
                  <label
                    key={cat.id}
                    className="filter-checkbox-label"
                    style={{ fontWeight: categoryParam === cat.slug ? 700 : 400, color: categoryParam === cat.slug ? 'var(--primary)' : 'inherit' }}
                    onClick={() => handleCategorySelect(cat.slug)}
                  >
                    <span>{cat.name}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-light)' }}>
                      ({count})
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-block">
            <h4 className="filter-title">Narx, so'm</h4>
            <div className="price-inputs-row">
              <input
                type="number"
                className="price-input"
                placeholder="Dan"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span style={{ color: 'var(--text-light)' }}>—</span>
              <input
                type="number"
                className="price-input"
                placeholder="Gacha"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Discounts Checkbox */}
          <div className="filter-block">
            <h4 className="filter-title">Aksiyalar</h4>
            <label className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={onlyDiscounted}
                onChange={(e) => setOnlyDiscounted(e.target.checked)}
              />
              <span>Faqat chegirmadagi tovarlar</span>
            </label>
          </div>

          {/* Rating Filter */}
          <div className="filter-block" style={{ borderBottom: 'none' }}>
            <h4 className="filter-title">Minimal reyting</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[4.8, 4.5, 4.0].map((r) => (
                <label key={r} className="filter-checkbox-label">
                  <input
                    type="radio"
                    name="rating"
                    checked={selectedRating === r}
                    onChange={() => setSelectedRating(r)}
                  />
                  <span>★ {r} va undan yuqori</span>
                </label>
              ))}
              {selectedRating > 0 && (
                <button
                  onClick={() => setSelectedRating(0)}
                  style={{ fontSize: '11px', color: 'var(--primary)', textAlign: 'left', marginTop: '4px' }}
                >
                  Reyting filtrini bekor qilish
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Right Product Grid & Sorting */}
        <main>
          {/* Top Sort & Count Bar */}
          <div className="catalog-sort-bar">
            <div>
              <span style={{ fontWeight: 800, fontSize: '16px' }}>
                {activeCategoryObject ? activeCategoryObject.name : 'Barcha tovarlar'}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '13px', marginLeft: '8px' }}>
                ({sortedProducts.length} ta tovar topildi)
              </span>
            </div>

            <div className="sort-chips-group">
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                Saralash:
              </span>
              <button
                className={`sort-chip ${sortParam === 'popular' ? 'active' : ''}`}
                onClick={() => handleSortChange('popular')}
              >
                Ommabop
              </button>
              <button
                className={`sort-chip ${sortParam === 'price_asc' ? 'active' : ''}`}
                onClick={() => handleSortChange('price_asc')}
              >
                Eng arzon
              </button>
              <button
                className={`sort-chip ${sortParam === 'price_desc' ? 'active' : ''}`}
                onClick={() => handleSortChange('price_desc')}
              >
                Eng qimmat
              </button>
              <button
                className={`sort-chip ${sortParam === 'rating' ? 'active' : ''}`}
                onClick={() => handleSortChange('rating')}
              >
                Reyting
              </button>
              <button
                className={`sort-chip ${sortParam === 'discount' ? 'active' : ''}`}
                onClick={() => handleSortChange('discount')}
              >
                Katta chegirma
              </button>
            </div>
          </div>

          {/* Active Filter Pills */}
          {hasActiveFilters && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Faol filtrlar:</span>
              {categoryParam && (
                <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  {activeCategoryObject?.name}
                  <X size={14} style={{ cursor: 'pointer' }} onClick={() => handleCategorySelect('')} />
                </span>
              )}
              {searchParam && (
                <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  "{searchParam}"
                  <X size={14} style={{ cursor: 'pointer' }} onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('q');
                    setSearchParams(newParams);
                  }} />
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  {minPrice ? `${minPrice} dan` : ''} {maxPrice ? `${maxPrice} gacha` : ''}
                  <X size={14} style={{ cursor: 'pointer' }} onClick={() => { setMinPrice(''); setMaxPrice(''); }} />
                </span>
              )}
              {onlyDiscounted && (
                <span style={{ background: '#FFF1F0', color: 'var(--accent-red)', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  Chegirmadagi tovarlar
                  <X size={14} style={{ cursor: 'pointer' }} onClick={() => setOnlyDiscounted(false)} />
                </span>
              )}
              {selectedRating > 0 && (
                <span style={{ background: '#FEF3C7', color: '#B45309', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  ★ {selectedRating}+
                  <X size={14} style={{ cursor: 'pointer' }} onClick={() => setSelectedRating(0)} />
                </span>
              )}
            </div>
          )}

          {/* Product Grid */}
          {sortedProducts.length > 0 ? (
            <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))' }}>
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div style={{
              background: '#fff',
              borderRadius: 'var(--radius-lg)',
              padding: '60px 20px',
              textAlign: 'center',
              border: '1px solid var(--border-light)'
            }}>
              <Search size={48} color="var(--text-light)" style={{ margin: '0 auto 16px auto' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                Afsuski, tovarlar topilmadi
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Filtrlarni o'zgartirib yoki boshqa so'z bilan qidirib ko'ring.
              </p>
              <button
                onClick={handleResetFilters}
                className="checkout-btn"
                style={{ width: 'fit-content', margin: '0 auto', padding: '10px 24px' }}
              >
                Barcha tovarlarni ko'rish
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Catalog;
