import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, Package, Heart, MapPin, 
  Phone, Mail, CheckCircle2, Save, LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';

const Profile = () => {
  const { user, updateProfile, orders } = useAuth();
  const { favoritesCount } = useFavorites();
  const { cartCount } = useCart();

  const [firstName, setFirstName] = useState(user?.firstName || 'Azizbek');
  const [lastName, setLastName] = useState(user?.lastName || 'Karimov');
  const [phone, setPhone] = useState(user?.phone || '+998 90 123 45 67');
  const [email, setEmail] = useState(user?.email || 'azizbek.karimov@example.uz');
  const [city, setCity] = useState(user?.city || 'Toshkent shahri');
  const [address, setAddress] = useState(user?.address || 'Chilonzor tumani, 9-mavze, 14-uy');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      firstName,
      lastName,
      phone,
      email,
      city,
      address
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="container" style={{ padding: '24px 16px 60px 16px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px' }}>
        Foydalanuvchi profili
      </h1>

      <div className="profile-layout">
        {/* Left Sidebar */}
        <div>
          <div className="profile-card">
            <div className="profile-avatar-box">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80"}
                alt="Profil rasmi"
                className="profile-avatar-img"
              />
            </div>
            <h2 className="profile-user-name">{user?.firstName} {user?.lastName}</h2>
            <div className="profile-user-phone">{user?.phone}</div>

            {/* Stats row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              padding: '14px 0',
              borderTop: '1px solid var(--border-light)',
              borderBottom: '1px solid var(--border-light)',
              marginBottom: '18px'
            }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>
                  {orders.length}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Buyurtma</div>
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>
                  {favoritesCount}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Istaklar</div>
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>
                  {cartCount}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Savatda</div>
              </div>
            </div>

            {/* Menu Nav */}
            <div className="profile-menu-nav">
              <Link to="/orders" className="profile-menu-item">
                <Package size={18} />
                <span>Buyurtmalar tarixi ({orders.length})</span>
              </Link>
              <Link to="/favorites" className="profile-menu-item">
                <Heart size={18} />
                <span>Sevimlilar ({favoritesCount})</span>
              </Link>
              <Link to="/cart" className="profile-menu-item">
                <MapPin size={18} />
                <span>Savatcha ({cartCount})</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Form: Profile Settings */}
        <div style={{
          background: '#fff',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>
            Shaxsiy ma'lumotlarni tahrirlash
          </h2>

          {savedSuccess && (
            <div style={{
              background: '#DCFCE7',
              color: '#15803D',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px'
            }}>
              <CheckCircle2 size={18} />
              <span>Ma'lumotlar muvaffaqiyatli saqlandi!</span>
            </div>
          )}

          <form onSubmit={handleSave}>
            <div className="checkout-form-grid" style={{ marginBottom: '20px' }}>
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

              <div className="form-group">
                <label className="form-label">Telefon raqami *</label>
                <input
                  type="tel"
                  required
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Elektron pochta (Email)</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Shahar / Viloyat</label>
                <input
                  type="text"
                  className="form-input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Asosiy yetkazib berish manzili</label>
                <input
                  type="text"
                  className="form-input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="checkout-btn"
              style={{ width: 'fit-content', padding: '12px 28px' }}
            >
              <Save size={18} />
              <span>O'zgarishlarni saqlash</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

