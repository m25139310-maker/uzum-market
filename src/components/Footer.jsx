import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Send, Instagram, Youtube, Facebook, 
  Smartphone, ShieldCheck, Truck, Headphones, HelpCircle 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Biz haqimizda */}
          <div>
            <h4 className="footer-col-title">Biz haqimizda</h4>
            <ul className="footer-links-list">
              <li><Link to="/catalog">Topshirish punktlari</Link></li>
              <li><a href="#vacancies" onClick={(e) => e.preventDefault()}>Vakansiyalar</a></li>
              <li><a href="#partnership" onClick={(e) => e.preventDefault()}>Hamkorlik</a></li>
              <li><a href="#about" onClick={(e) => e.preventDefault()}>Kompaniya haqida</a></li>
              <li><a href="#eco" onClick={(e) => e.preventDefault()}>Uzum ekotizimi</a></li>
            </ul>
          </div>

          {/* Col 2: Foydalanuvchilarga */}
          <div>
            <h4 className="footer-col-title">Foydalanuvchilarga</h4>
            <ul className="footer-links-list">
              <li><a href="#contact" onClick={(e) => e.preventDefault()}>Biz bilan bog'lanish</a></li>
              <li><a href="#faq" onClick={(e) => e.preventDefault()}>Savol-Javob</a></li>
              <li><a href="#returns" onClick={(e) => e.preventDefault()}>Tovarlarni qaytarish</a></li>
              <li><a href="#guarantee" onClick={(e) => e.preventDefault()}>Kafolat shartlari</a></li>
              <li><a href="#terms" onClick={(e) => e.preventDefault()}>Foydalanish qoidalari</a></li>
            </ul>
          </div>

          {/* Col 3: Tadbirkorlarga */}
          <div>
            <h4 className="footer-col-title">Tadbirkorlarga</h4>
            <ul className="footer-links-list">
              <li><a href="#seller" onClick={(e) => e.preventDefault()}>Uzumda soting</a></li>
              <li><a href="#seller-cabinet" onClick={(e) => e.preventDefault()}>Sotuvchi kabineti</a></li>
              <li><a href="#pickup" onClick={(e) => e.preventDefault()}>Topshirish punkti ochish</a></li>
              <li><a href="#delivery-driver" onClick={(e) => e.preventDefault()}>Yetkazib beruvchi bo'ling</a></li>
            </ul>

            <h4 className="footer-col-title" style={{ marginTop: '20px' }}>To'lov usullari</h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="payment-partner-pill">Uzcard</span>
              <span className="payment-partner-pill">Humo</span>
              <span className="payment-partner-pill">Click</span>
              <span className="payment-partner-pill">Payme</span>
              <span className="payment-partner-pill">Visa</span>
              <span className="payment-partner-pill">Mastercard</span>
              <span className="payment-partner-pill" style={{ background: '#F0E5FF', color: '#7000FF' }}>Uzum Nasiya</span>
            </div>
          </div>

          {/* Col 4: Ilovani yuklab olish va Ijtimoiy tarmoqlar */}
          <div>
            <h4 className="footer-col-title">Ilovani yuklab oling</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Ilovada xarid qilish yanada qulay va tezroq!
            </p>
            <div className="app-download-badges">
              <a href="#appstore" onClick={(e) => e.preventDefault()} className="app-badge-btn">
                <Smartphone size={20} color="#7000FF" />
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Yuklab oling</div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>App Store</div>
                </div>
              </a>
              <a href="#googleplay" onClick={(e) => e.preventDefault()} className="app-badge-btn">
                <Smartphone size={20} color="#7000FF" />
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Mavjud</div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>Google Play</div>
                </div>
              </a>
            </div>

            <h4 className="footer-col-title" style={{ marginTop: '20px' }}>Ijtimoiy tarmoqlar</h4>
            <div className="social-icons-row">
              <a href="https://t.me" target="_blank" rel="noreferrer" className="social-btn" title="Telegram">
                <Send size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn" title="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-btn" title="YouTube">
                <Youtube size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-btn" title="Facebook">
                <Facebook size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Row */}
        <div className="footer-bottom-row">
          <div>
            © 2026 Uzum Market MChJ. Barcha huquqlar himoyalangan.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#privacy" onClick={(e) => e.preventDefault()}>Maxfiylik kelishuvi</a>
            <a href="#user-agreement" onClick={(e) => e.preventDefault()}>Foydalanuvchi kelishuvi</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

