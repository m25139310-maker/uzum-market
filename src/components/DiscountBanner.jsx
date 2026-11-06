import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    tag: "Katta bahorgi aksiya",
    title: "Mavsumiy chegirmalar — 70% gacha!",
    subtitle: "Kiyimlar, poyabzallar va go'zallik mahsulotlariga maxsus narxlar. Shoshiling, tovarlar soni cheklangan!",
    btnText: "Xarid qilish",
    link: "/discounts",
    bg: "linear-gradient(135deg, #7000FF 0%, #B800FF 100%)",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80"
  },
  {
    id: 2,
    tag: "Uzum Nasiya 0-0-12",
    title: "Boshlang'ich to'lovsiz, 12 oyga bo'lib to'lang!",
    subtitle: "Smartfonlar, noutbuklar va maishiy texnikani bugun oling, to'lovini esa ortiqcha foizsiz 12 oyga bo'ling.",
    btnText: "Gadjetlarni ko'rish",
    link: "/catalog?category=telefonlar",
    bg: "linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80"
  },
  {
    id: 3,
    tag: "Tezkor yetkazish",
    title: "1 kunda bepul yetkazib beramiz!",
    subtitle: "Bugun soat 22:00 gacha buyurtma bering va ertaga uyingizga yoki yaqin atrofdagi topshirish punktiga yetkazib olamiz.",
    btnText: "Barcha tovarlar",
    link: "/catalog",
    bg: "linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80"
  }
];

const DiscountBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="hero-slider-section">
      <div className="banner-slider">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ background: slide.bg }}
          >
            <div className="slide-content">
              <span className="slide-tag">{slide.tag}</span>
              <h1 className="slide-title">{slide.title}</h1>
              <p className="slide-subtitle">{slide.subtitle}</p>
              <button
                className="slide-btn"
                onClick={() => navigate(slide.link)}
              >
                <span>{slide.btnText}</span>
                <ArrowRight size={18} />
              </button>
            </div>
            <img src={slide.image} alt={slide.title} className="slide-bg-img" />
          </div>
        ))}

        {/* Navigation Arrows */}
        <button className="slider-arrow prev" onClick={handlePrev} aria-label="Oldingi banner">
          <ChevronLeft size={24} />
        </button>
        <button className="slider-arrow next" onClick={handleNext} aria-label="Keyingi banner">
          <ChevronRight size={24} />
        </button>

        {/* Indicators */}
        <div className="slider-dots">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiscountBanner;

