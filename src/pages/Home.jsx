import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Flame, Zap, ShieldCheck, Truck, 
  RotateCcw, CreditCard, ChevronRight, Clock 
} from 'lucide-react';
import DiscountBanner from '../components/DiscountBanner';
import CategoryList from '../components/CategoryList';
import ProductList from '../components/ProductList';
import ProductCard from '../components/ProductCard';
import { products, formatPrice } from '../data/products';

const Home = () => {
  // Countdown timer for Deal of the Day
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 42, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dealProducts = products.filter(p => p.isDealOfDay).slice(0, 4);
  const superDiscountProducts = products.filter(p => p.isSuperDiscount || p.discount >= 40).slice(0, 10);
  const popularProducts = [...products].sort((a, b) => b.reviewsCount - a.reviewsCount).slice(0, 10);
  const phoneProducts = products.filter(p => p.category === 'telefonlar').slice(0, 5);
  const techProducts = products.filter(p => p.category === 'maishiy-texnika' || p.category === 'noutbuklar').slice(0, 5);
  const fashionProducts = products.filter(p => p.category === 'kiyimlar' || p.category === 'oyoq-kiyimlar').slice(0, 5);

  const formatDigit = (num) => String(num).padStart(2, '0');

  return (
    <div className="container" style={{ paddingBottom: '40px' }}>
      {/* Promotional Carousel */}
      <DiscountBanner />

      {/* Categories Horizontal Strip */}
      <CategoryList />

      {/* Deal of the Day (Kun mahsuloti) */}
      <section className="deal-section">
        <div className="deal-header">
          <div className="deal-title-box">
            <Zap size={28} color="#FFD700" fill="#FFD700" />
            <div>
              <h2 className="deal-title">Kun mahsulotlari</h2>
              <p style={{ fontSize: '13px', opacity: 0.85 }}>Bugungi eng katta chegirmalar va cheklangan takliflar</p>
            </div>
          </div>

          <div className="countdown-box">
            <Clock size={16} />
            <span>Tugashiga:</span>
            <span className="countdown-digit">{formatDigit(timeLeft.hours)}</span>:
            <span className="countdown-digit">{formatDigit(timeLeft.minutes)}</span>:
            <span className="countdown-digit">{formatDigit(timeLeft.seconds)}</span>
          </div>
        </div>

        <div className="deal-grid">
          {dealProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Super Chegirmalar */}
      <ProductList
        title="Super chegirmalar — 70% gacha"
        products={superDiscountProducts}
        limit={10}
        linkTo="/discounts"
        icon={<Flame size={24} color="#F04438" fill="#F04438" />}
      />

      {/* Ommabop mahsulotlar */}
      <ProductList
        title="Xaridorlar tanlovi — Eng ko'p sotilganlar"
        products={popularProducts}
        limit={10}
        linkTo="/catalog?sort=popular"
        icon={<Sparkles size={24} color="#7000FF" />}
      />

      {/* Middle Promo Banner */}
      <div style={{
        background: 'linear-gradient(90deg, #101828 0%, #1D2939 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px 36px',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '36px 0',
        boxShadow: 'var(--shadow-md)',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'inline-block', background: 'var(--primary)', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, marginBottom: '8px' }}>
            MAXSUS TAKLIF
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>
            Promokod bilan qo'shimcha chegirmaga ega bo'ling!
          </h3>
          <p style={{ fontSize: '14px', color: '#98A2B3' }}>
            Savatda <strong style={{ color: '#fff' }}>UZUM10</strong> (10%), <strong style={{ color: '#fff' }}>SALE20</strong> (20%) yoki <strong style={{ color: '#fff' }}>MEGA30</strong> (30%) kodlaridan foydalaning.
          </p>
        </div>
        <Link 
          to="/discounts" 
          style={{
            background: 'var(--primary)',
            color: '#fff',
            fontWeight: 700,
            padding: '12px 24px',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>Chegirmalarni ko'rish</span>
          <ChevronRight size={18} />
        </Link>
      </div>

      {/* Smartfonlar va Gadjetlar */}
      <ProductList
        title="Smartfonlar va flagman telefonlar"
        products={phoneProducts}
        linkTo="/catalog?category=telefonlar"
        icon={<Zap size={24} color="#7000FF" />}
      />

      {/* Noutbuklar va Maishiy Texnika */}
      <ProductList
        title="Noutbuklar va qulay maishiy texnika"
        products={techProducts}
        linkTo="/catalog?category=noutbuklar"
      />

      {/* Kiyim va Poyabzallar */}
      <ProductList
        title="Kiyimlar va urfdagi poyabzallar"
        products={fashionProducts}
        linkTo="/catalog?category=kiyimlar"
      />

      {/* Why Choose Uzum Market Value Props */}
      <section style={{
        marginTop: '50px',
        background: '#fff',
        borderRadius: 'var(--radius-xl)',
        padding: '36px',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: 800, textAlign: 'center', marginBottom: '28px' }}>
          Nima uchun aynan Uzum Market?
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px'
        }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Truck size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>1 kunda yetkazib berish</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Bugun buyurtma bering va ertaga tovaringizni bepul qabul qilib oling.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>100% original tovarlar</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Barcha tovarlar sifat nazoratidan o'tgan va rasmiy kafolatga ega.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CreditCard size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>Uzum Nasiya muddatli to'lov</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Boshlang'ich to'lovsiz 3, 6 yoki 12 oyga teng taqsimlab to'lang.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <RotateCcw size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>Oson qaytarish</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Agar tovar yoqmasa, 10 kun ichida topshirish punktiga qaytarishingiz mumkin.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

