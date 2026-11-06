import React, { useState } from 'react';
import { Flame, Sparkles, Tag, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const Discounts = () => {
  const [selectedDiscountFilter, setSelectedDiscountFilter] = useState('all');

  const discountedProducts = products.filter(p => p.discount && p.discount > 0);

  const filteredProducts = discountedProducts.filter(p => {
    if (selectedDiscountFilter === '70') return p.discount >= 70;
    if (selectedDiscountFilter === '50') return p.discount >= 50 && p.discount < 70;
    if (selectedDiscountFilter === '40') return p.discount >= 40 && p.discount < 50;
    if (selectedDiscountFilter === '30') return p.discount >= 30 && p.discount < 40;
    if (selectedDiscountFilter === '20') return p.discount >= 20 && p.discount < 30;
    return true;
  }).sort((a, b) => (b.discount || 0) - (a.discount || 0));

  return (
    <div className="container" style={{ padding: '24px 16px 60px 16px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #FF4500 0%, #7000FF 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '36px',
        color: '#fff',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>
            <Flame size={16} /> MAXSUS AKSIYALAR
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
            Katta chegirmalar festivali — 70% gacha!
          </h1>
          <p style={{ fontSize: '15px', opacity: 0.9, maxWidth: '600px' }}>
            Eng yaxshi narxlar, ommabop texnika, urfdagi kiyimlar va kundalik tovarlar barchasi bitta joyda.
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '16px 24px', borderRadius: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '36px', fontWeight: 800 }}>{discountedProducts.length}+</div>
          <div style={{ fontSize: '12px', fontWeight: 600 }}>Chegirmadagi tovarlar</div>
        </div>
      </div>

      {/* Filter Chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>
          Chegirma foizi:
        </span>
        <button
          className={`sort-chip ${selectedDiscountFilter === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedDiscountFilter('all')}
        >
          Barchasi ({discountedProducts.length})
        </button>
        <button
          className={`sort-chip ${selectedDiscountFilter === '70' ? 'active' : ''}`}
          onClick={() => setSelectedDiscountFilter('70')}
        >
          -70% gacha
        </button>
        <button
          className={`sort-chip ${selectedDiscountFilter === '50' ? 'active' : ''}`}
          onClick={() => setSelectedDiscountFilter('50')}
        >
          -50%
        </button>
        <button
          className={`sort-chip ${selectedDiscountFilter === '40' ? 'active' : ''}`}
          onClick={() => setSelectedDiscountFilter('40')}
        >
          -40%
        </button>
        <button
          className={`sort-chip ${selectedDiscountFilter === '30' ? 'active' : ''}`}
          onClick={() => setSelectedDiscountFilter('30')}
        >
          -30%
        </button>
        <button
          className={`sort-chip ${selectedDiscountFilter === '20' ? 'active' : ''}`}
          onClick={() => setSelectedDiscountFilter('20')}
        >
          -20%
        </button>
      </div>

      {/* Grid */}
      <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))' }}>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Discounts;

