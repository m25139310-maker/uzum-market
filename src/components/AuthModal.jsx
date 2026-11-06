import React, { useState } from 'react';
import { X, Smartphone, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, updateProfile } = useAuth();
  const [step, setStep] = useState(1); // 1: phone, 2: otp
  const [phone, setPhone] = useState('+998 90 123 45 67');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSendCode = (e) => {
    e.preventDefault();
    if (phone.length < 9) {
      setError("Iltimos, to'liq telefon raqamingizni kiriting");
      return;
    }
    setError('');
    setStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp !== '1234' && otp.length < 4) {
      setError("Kiritilgan SMS kod noto'g'ri (Demo kod: 1234)");
      return;
    }

    updateProfile({
      firstName: name || "Azizbek",
      phone: phone
    });

    closeAuthModal();
    setStep(1);
  };

  return (
    <div className="modal-overlay" onClick={closeAuthModal}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={closeAuthModal}>
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ 
            width: '56px', 
            height: '56px', 
            background: 'var(--primary-light)', 
            color: 'var(--primary)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 12px auto'
          }}>
            <Smartphone size={28} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>
            {step === 1 ? "Uzum Market'ga kirish" : "Tasdiqlash kodi"}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {step === 1 
              ? "Buyurtmalaringiz va sevimlilaringizni ko'rish uchun telefon raqamingizni kiriting"
              : `${phone} raqamiga yuborilgan 4 xonali kodni kiriting`
            }
          </p>
        </div>

        {error && (
          <div style={{ 
            background: '#FFF1F0', 
            color: 'var(--accent-red)', 
            padding: '10px 14px', 
            borderRadius: '8px', 
            fontSize: '13px', 
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendCode}>
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Ismingiz (ixtiyoriy)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Masalan: Sardor"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">Telefon raqami</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+998 90 123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="checkout-btn">
              Kodni olish
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">SMS Kod</label>
              <input
                type="text"
                maxLength={4}
                className="form-input"
                placeholder="1234"
                style={{ textAlign: 'center', fontSize: '22px', letterSpacing: '8px', fontWeight: 800 }}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <button
                type="button"
                onClick={() => setOtp('1234')}
                style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline' }}
              >
                Demo kodni to'ldirish (1234)
              </button>
            </div>

            <button type="submit" className="checkout-btn">
              Tasdiqlash va kirish
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;

