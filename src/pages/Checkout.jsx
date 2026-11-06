import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, MapPin, Truck, CreditCard, 
  Wallet, ShieldCheck, ChevronRight, ArrowLeft 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../data/products';

const CITIES = [
  "Toshkent shahri",
  "Samarqand viloyati",
  "Buxoro viloyati",
  "Andijon viloyati",
  "Farg'ona viloyati",
  "Namangan viloyati",
  "Xorazm viloyati",
  "Qashqadaryo viloyati",
  "Surxondaryo viloyati",
  "Navoiy viloyati",
  "Jizzax viloyati",
  "Sirdaryo viloyati",
  "Qoraqalpog'iston Respublikasi"
];

const PICKUP_POINTS = [
  { id: 1, name: "Uzum PVZ: Chilonzor, 9-mavze, 14-uy", schedule: "Har kuni 09:00 - 21:00", city: "Toshkent shahri" },
  { id: 2, name: "Uzum PVZ: Yunusobod, 11-mavze, Amir Temur ko'chasi", schedule: "Har kuni 09:00 - 21:00", city: "Toshkent shahri" },
  { id: 3, name: "Uzum PVZ: Mirzo Ulug'bek, Buyuk Ipak Yo'li metro", schedule: "Har kuni 09:00 - 21:00", city: "Toshkent shahri" },
  { id: 4, name: "Uzum PVZ: Samarqand sh., Registon ko'chasi 24", schedule: "Har kuni 09:00 - 20:00", city: "Samarqand viloyati" }
];

const PAYMENT_METHODS = [
  { id: 'payme', name: 'Payme', desc: 'Tezkor onlayn to\'lov', icon: '💳' },
  { id: 'click', name: 'Click', desc: 'Click Up yoki Click Pass', icon: '🔵' },
  { id: 'uzum_nasiya', name: 'Uzum Nasiya', desc: '0-0-12 muddatli to\'lov', icon: '🍇' },
  { id: 'card', name: 'Bank kartasi', desc: 'Humo, Uzcard, Visa', icon: '💳' },
  { id: 'cash', name: 'Naqd pul', desc: 'Qabul qilganda to\'lash', icon: '💵' },
  { id: 'credit', name: 'Kredit', desc: 'Bank orqali rasmiylashtirish', icon: '🏦' }
];

const Checkout = () => {
  const { cartItems, cartCount, finalTotal, deliveryFee, clearCart, appliedPromo, totalDiscount } = useCart();
  const { user, addOrder } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [firstName, setFirstName] = useState(user?.firstName || 'Azizbek');
  const [lastName, setLastName] = useState(user?.lastName || 'Karimov');
  const [phone, setPhone] = useState(user?.phone || '+998 90 123 45 67');
  const [city, setCity] = useState(user?.city || 'Toshkent shahri');
  const [address, setAddress] = useState(user?.address || 'Chilonzor tumani, 9-mavze, 14-uy');
  const [deliveryType, setDeliveryType] = useState('pickup'); // 'pickup' | 'courier'
  const [selectedPickup, setSelectedPickup] = useState(PICKUP_POINTS[0]);
  const [paymentMethod, setPaymentMethod] = useState('payme');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  if (cartItems.length === 0 && !createdOrder) {
    return (
      <div className="container" style={{ padding: '80px 16px', textAlign: 'center' }}>
        <h2>Buyurtma berish uchun savatchada tovarlar bo'lishi kerak</h2>
        <Link to="/catalog" className="checkout-btn" style={{ width: 'fit-content', margin: '20px auto' }}>
          Katalogga o'tish
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    const orderData = {
      customer: { firstName, lastName, phone },
      city,
      address: deliveryType === 'pickup' ? selectedPickup.name : address,
      deliveryType: deliveryType === 'pickup' ? 'Topshirish punkti (PVZ)' : 'Kuryer eshikkacha',
      paymentMethod: PAYMENT_METHODS.find(m => m.id === paymentMethod)?.name || paymentMethod,
      items: cartItems,
      totalAmount: finalTotal + (deliveryType === 'courier' ? deliveryFee : 0),
      discountAmount: totalDiscount
    };

    const newOrder = addOrder(orderData);
    setCreatedOrder(newOrder);

    // Confetti effect
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    clearCart();
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="container">
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', margin: '18px 0' }}>
        <Link to="/" style={{ color: 'var(--text-muted)' }}>Bosh sahifa</Link>
        <ChevronRight size={14} />
        <Link to="/cart" style={{ color: 'var(--text-muted)' }}>Savatcha</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Buyurtmani rasmiylashtirish</span>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="checkout-layout">
          {/* Left Details */}
          <div>
            {/* 1. Contact info */}
            <div className="checkout-section">
              <h2 className="checkout-section-title">
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>1</span>
                <span>Qabul qiluvchi ma'lumotlari</span>
              </h2>

              <div className="checkout-form-grid">
                <div className="form-group">
                  <label className="form-label">Ism *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Familiya *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Telefon raqami (SMS tasdiqlash uchun) *</label>
                  <input
                    type="tel"
                    required
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Method */}
            <div className="checkout-section">
              <h2 className="checkout-section-title">
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>2</span>
                <span>Yetkazib berish usuli va manzil</span>
              </h2>

              <div className="delivery-options-grid">
                <div
                  className={`delivery-opt-card ${deliveryType === 'pickup' ? 'active' : ''}`}
                  onClick={() => setDeliveryType('pickup')}
                >
                  <div className="delivery-opt-title">
                    <span>Uzum topshirish punkti (PVZ)</span>
                    <span style={{ color: 'var(--secondary)' }}>Bepul</span>
                  </div>
                  <div className="delivery-opt-sub">
                    Ertaga topshirish punktida bo'ladi. 10 kun bepul saqlanadi.
                  </div>
                </div>

                <div
                  className={`delivery-opt-card ${deliveryType === 'courier' ? 'active' : ''}`}
                  onClick={() => setDeliveryType('courier')}
                >
                  <div className="delivery-opt-title">
                    <span>Kuryer orqali eshikkacha</span>
                    <span>{deliveryFee === 0 ? "Bepul" : formatPrice(deliveryFee)}</span>
                  </div>
                  <div className="delivery-opt-sub">
                    Ertaga soat 10:00 dan 20:00 gacha kuryer qo'lingizga topshiradi.
                  </div>
                </div>
              </div>

              {/* City selector */}
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Shahar yoki viloyat</label>
                <select
                  className="form-select"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {deliveryType === 'pickup' ? (
                <div>
                  <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>
                    Qulay topshirish punktini tanlang:
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                    {PICKUP_POINTS.map((pt) => (
                      <div
                        key={pt.id}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '8px',
                          border: selectedPickup.id === pt.id ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                          background: selectedPickup.id === pt.id ? 'var(--primary-light)' : '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}
                        onClick={() => setSelectedPickup(pt)}
                      >
                        <MapPin size={20} color={selectedPickup.id === pt.id ? '#7000FF' : '#757575'} />
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600 }}>{pt.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ish tartibi: {pt.schedule}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Interactive Map Visual Simulation */}
                  <div className="map-picker-box">
                    <img
                      src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80"
                      alt="Uzum xaritasi"
                      className="map-bg-pattern"
                    />
                    <div className="map-center-pin">
                      <div className="map-pin-label">{selectedPickup.name.split(':')[1] || selectedPickup.name}</div>
                      <MapPin size={36} fill="#7000FF" color="#fff" />
                    </div>
                    <div className="map-select-btn">
                      Xaritadan belgilangan PVZ
                    </div>
                  </div>
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Yetkazib berishning to'liq manzili (ko'cha, uy, xonadon) *</label>
                  <textarea
                    rows={3}
                    required
                    className="form-textarea"
                    placeholder="Masalan: Chilonzor tumani, 9-mavze, 14-uy, 42-xonadon"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* 3. Payment Method */}
            <div className="checkout-section">
              <h2 className="checkout-section-title">
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>3</span>
                <span>To'lov usulini tanlang</span>
              </h2>

              <div className="payment-grid">
                {PAYMENT_METHODS.map((pm) => (
                  <div
                    key={pm.id}
                    className={`payment-card ${paymentMethod === pm.id ? 'active' : ''}`}
                    onClick={() => setPaymentMethod(pm.id)}
                  >
                    <div className="payment-logo-icon">{pm.icon}</div>
                    <div className="payment-name">{pm.name}</div>
                    <div className="payment-desc">{pm.desc}</div>
                  </div>
                ))}
              </div>

              {paymentMethod === 'uzum_nasiya' && (
                <div style={{ marginTop: '16px', background: 'var(--primary-light)', padding: '14px', borderRadius: '10px', fontSize: '13px', color: 'var(--primary)' }}>
                  <strong>🍇 Uzum Nasiya orqali to'lov:</strong> Mahsulotlarni hoziroq olasiz, to'lovni esa oyma-oy 12 oy davomida (oyiga {formatPrice(Math.round(finalTotal / 12))}) to'laysiz!
                </div>
              )}
            </div>
          </div>

          {/* Right Summary */}
          <div>
            <div className="order-summary-card">
              <h3 className="summary-title">Buyurtma tarkibi ({cartCount})</h3>

              {/* Items preview */}
              <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '16px' }}>
                {cartItems.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <img src={item.image} alt={item.name} style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div style={{ flex: 1, fontSize: '12px', lineHeight: '1.2' }}>
                      <div style={{ fontWeight: 600 }}>{item.name.slice(0, 32)}...</div>
                      <div style={{ color: 'var(--text-muted)' }}>{item.quantity} dona × {formatPrice(item.price)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-row">
                <span>Mahsulotlar:</span>
                <span>{formatPrice(finalTotal + totalDiscount)}</span>
              </div>

              {totalDiscount > 0 && (
                <div className="summary-row savings">
                  <span>Chegirmalar:</span>
                  <span>-{formatPrice(totalDiscount)}</span>
                </div>
              )}

              {appliedPromo && (
                <div className="summary-row savings">
                  <span>Promokod ({appliedPromo.code}):</span>
                  <span>Faol</span>
                </div>
              )}

              <div className="summary-row">
                <span>Yetkazib berish:</span>
                <span>
                  {deliveryType === 'pickup' || deliveryFee === 0 ? (
                    <strong style={{ color: 'var(--secondary)' }}>Bepul</strong>
                  ) : (
                    formatPrice(deliveryFee)
                  )}
                </span>
              </div>

              <div className="summary-row total">
                <span>To'lanadigan summa:</span>
                <span style={{ color: 'var(--primary)' }}>
                  {formatPrice(finalTotal + (deliveryType === 'courier' ? deliveryFee : 0))}
                </span>
              </div>

              <button type="submit" className="checkout-btn">
                <span>Buyurtmani tasdiqlash</span>
                <ChevronRight size={18} />
              </button>

              <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '12px' }}>
                "Buyurtmani tasdiqlash" tugmasini bosish orqali siz ommaviy oferta shartlariga rozilik bildirasiz.
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* Order Success Modal */}
      {isSuccessModalOpen && createdOrder && (
        <div className="modal-overlay">
          <div className="modal-window" style={{ textAlign: 'center', maxWidth: '440px' }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: '#DCFCE7',
              color: '#16A34A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>
              Buyurtmangiz qabul qilindi!
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Buyurtma raqami: <strong style={{ color: 'var(--primary)', fontSize: '16px' }}>{createdOrder.id}</strong>
            </p>

            <div style={{
              background: 'var(--bg-gray)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              textAlign: 'left',
              fontSize: '13px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Holati:</span>
                <span style={{ fontWeight: 700, color: '#B45309' }}>Qabul qilindi (Tayyorlanmoqda)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Manzil:</span>
                <span style={{ fontWeight: 600 }}>{createdOrder.address}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>To'lov usuli:</span>
                <span style={{ fontWeight: 600 }}>{createdOrder.paymentMethod}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Umumiy summa:</span>
                <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{formatPrice(createdOrder.totalAmount)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                className="checkout-btn"
                onClick={() => navigate('/orders')}
              >
                Buyurtmalar tarixini ko'rish
              </button>
              <button
                style={{ padding: '10px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}
                onClick={() => navigate('/')}
              >
                Bosh sahifaga qaytish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;

