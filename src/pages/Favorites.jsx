import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const Favorites = () => {
  const { favorites, clearFavorites } = useFavorites();
  const { addToCart } = useCart();

  const handleAddAllToCart = () => {
    favorites.forEach(product => {
      addToCart(product, 1);
    });
  };

  if (favorites.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 16px', textAlign: 'center' }}>
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto'
        }}>
          <Heart size={44} />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '10px' }}>
          Sizga yoqqan mahsulotlar yo'q
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 24px auto' }}>
          Mahsulot kartochkasidagi yurakcha belgisini bosib, sevimli tovarlaringizni shu yerda saqlang.
        </p>
        <Link 
          to="/catalog" 
          className="checkout-btn" 
          style={{ width: 'fit-content', margin: '0 auto', padding: '14px 32px' }}
        >
          Katalogga o'tish
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '24px 16px 60px 16px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>
            Istaklar ro'yxati <span style={{ color: 'var(--text-muted)', fontSize: '16px', fontWeight: 500 }}>({favorites.length} ta mahsulot)</span>
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleAddAllToCart}
            className="checkout-btn"
            style={{ width: 'fit-content', padding: '10px 20px', fontSize: '13px' }}
          >
            <ShoppingBag size={16} />
            <span>Hammasini savatga qo'shish</span>
          </button>

          <button
            onClick={clearFavorites}
            style={{
              padding: '10px 16px',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--accent-red)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#fff'
            }}
          >
            <Trash2 size={16} />
            <span>Tozalash</span>
          </button>
        </div>
      </div>

      <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))' }}>
        {favorites.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;

