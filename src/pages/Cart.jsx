import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Trash2, ArrowRight, Tag, 
  Truck, ShieldCheck, CheckCircle2, X 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { formatPrice } from '../data/products';

const Cart = () => {
  const {
    cartItems,
    clearCart,
    cartCount,
    subtotal,
    originalTotal,
    baseSavings,
    appliedPromo,
    applyPromo,
    removePromo,
    promoDiscountAmount,
    totalDiscount,
    finalTotal,
    deliveryFee,
    freeDeliveryThreshold
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState(null);
  const navigate = useNavigate();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromo(promoInput);
    setPromoMessage(res);
  };

  const handleQuickPromo = (code) => {
    setPromoInput(code);
    const res = applyPromo(code);
    setPromoMessage(res);
  };

  const neededForFreeDelivery = Math.max(0, freeDeliveryThreshold - finalTotal);
  const deliveryProgressPercent = Math.min(100, Math.round((finalTotal / freeDeliveryThreshold) * 100));

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 16px', textAlign: 'center' }}>
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto'
        }}>
          <ShoppingBag size={48} />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '10px' }}>
          Savatchangiz hozircha bo'sh
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 24px auto' }}>
          Bosh sahifadagi to'plamlar yoki qidiruv orqali o'zingizga yoqqan mahsulotlarni tanlang.
        </p>
        <Link 
          to="/catalog" 
          className="checkout-btn" 
          style={{ width: 'fit-content', margin: '0 auto', padding: '14px 32px' }}
        >
          Xarid qilishni boshlash
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="cart-layout">
        {/* Left Column: Cart Items */}
        <div className="cart-items-container">
          <div className="cart-header">
            <h1 className="cart-title">
              Savatcha <span style={{ color: 'var(--text-muted)', fontSize: '16px', fontWeight: 500 }}>({cartCount} ta mahsulot)</span>
            </h1>
            <button className="clear-cart-btn" onClick={clearCart}>
              <Trash2 size={16} />
              <span>Savatchani tozalash</span>
            </button>
          </div>

          {/* Free delivery progress */}
          <div className="delivery-progress-box">
            <div className="delivery-progress-text">
              {deliveryFee === 0 ? (
                <span style={{ color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} /> Bepul yetkazib berish huquqiga egasiz!
                </span>
              ) : (
                <span>
                  Yetkazib berish bepul bo'lishi uchun yana <strong style={{ color: 'var(--primary)' }}>{formatPrice(neededForFreeDelivery)}</strong>lik tovar qo'shing
                </span>
              )}
              <span>{deliveryProgressPercent}%</span>
            </div>
            <div className="progress-bar-track">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${deliveryProgressPercent}%` }}
              />
            </div>
          </div>

          {/* List of Cart Items */}
          <div>
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/catalog" style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              ← Xaridni davom ettirish
            </Link>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Topshirish punktida 10 kun bepul saqlanadi
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="order-summary-card">
          <h2 className="summary-title">Buyurtmangiz</h2>

          <div className="summary-row">
            <span>Mahsulotlar ({cartCount}):</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
              {formatPrice(originalTotal)}
            </span>
          </div>

          {totalDiscount > 0 && (
            <div className="summary-row savings">
              <span>Tejalgan mablag':</span>
              <span>-{formatPrice(totalDiscount)}</span>
            </div>
          )}

          <div className="summary-row">
            <span>Yetkazib berish:</span>
            <span>
              {deliveryFee === 0 ? (
                <strong style={{ color: 'var(--secondary)' }}>Bepul</strong>
              ) : (
                formatPrice(deliveryFee)
              )}
            </span>
          </div>

          {/* Promo Code Input */}
          <div className="promo-box">
            <div className="promo-box-title">
              <Tag size={13} style={{ display: 'inline', marginRight: '4px' }} />
              Promokod bormi?
            </div>

            {appliedPromo ? (
              <div className="applied-promo-tag">
                <div>
                  <strong>{appliedPromo.code}</strong> — {appliedPromo.discount}% chegirma
                </div>
                <button onClick={removePromo} style={{ color: '#d32f2f' }}>
                  <X size={16} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="promo-input-group">
                <input
                  type="text"
                  placeholder="Kodni kiriting..."
                  className="promo-input"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                />
                <button type="submit" className="promo-btn">
                  Qo'llash
                </button>
              </form>
            )}

            {!appliedPromo && (
              <div className="demo-promos-hint">
                Demo kodlar:{" "}
                <span onClick={() => handleQuickPromo("UZUM10")}>UZUM10</span> (10%),{" "}
                <span onClick={() => handleQuickPromo("SALE20")}>SALE20</span> (20%),{" "}
                <span onClick={() => handleQuickPromo("MEGA30")}>MEGA30</span> (30%)
              </div>
            )}
          </div>

          {/* Final Total */}
          <div className="summary-row total">
            <span>Jami to'lov:</span>
            <span style={{ color: 'var(--primary)' }}>
              {formatPrice(finalTotal + deliveryFee)}
            </span>
          </div>

          <button
            className="checkout-btn"
            onClick={() => navigate('/checkout')}
          >
            <span>Buyurtma berishga o'tish</span>
            <ArrowRight size={18} />
          </button>

          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <ShieldCheck size={16} color="#00C65E" />
            <span>Xavfsiz va kafolatlangan to'lov</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

