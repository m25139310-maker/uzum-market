import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, ShoppingBag, Star, Truck, ShieldCheck, 
  RotateCcw, Check, ChevronRight, Share2, Plus, Minus, CreditCard, MessageSquare, User, Send, CheckCircle2, X 
} from 'lucide-react';
import { products, formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import ProductList from '../components/ProductList';

const INITIAL_REVIEWS = [
  { id: 1, author: "Farrux B.", rating: 5, date: "3 kun oldin", comment: "Sifati ajoyib, 1 kunda yetkazib berishdi! Juda mamnunman, tavsiya qilaman." },
  { id: 2, author: "Nilufar O.", rating: 5, date: "1 hafta oldin", comment: "Mahsulot xuddi rasmdagidek chiqdi, qadoqlanishi juda ehtiyotkorona bo'lgan." },
  { id: 3, author: "Javohir T.", rating: 4, date: "2 hafta oldin", comment: "Narxiga arziydi, kutilganidan ham yaxshi. Rahmat Uzum Market!" }
];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const product = products.find(p => p.id === Number(id)) || products[0];
  const [selectedImg, setSelectedImg] = useState(product?.image);
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const [isNasiyaModalOpen, setIsNasiyaModalOpen] = useState(false);
  const [nasiyaMonths, setNasiyaMonths] = useState(12);

  // Reviews state
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(`uzum_reviews_${product?.id}`);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch (e) {
      return INITIAL_REVIEWS;
    }
  });
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImg(product.image);
      setQuantity(1);
      window.scrollTo(0, 0);

      try {
        const saved = localStorage.getItem(`uzum_reviews_${product.id}`);
        setReviews(saved ? JSON.parse(saved) : INITIAL_REVIEWS);
      } catch (e) {
        setReviews(INITIAL_REVIEWS);
      }
    }
  }, [id, product]);

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const newRev = {
      id: Date.now(),
      author: newAuthor.trim(),
      rating: newRating,
      date: "Hozirgina",
      comment: newComment.trim()
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem(`uzum_reviews_${product.id}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    setNewAuthor('');
    setNewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  if (!product) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>Mahsulot topilmadi</h2>
        <Link to="/catalog" className="checkout-btn" style={{ width: 'fit-content', margin: '20px auto' }}>
          Katalogga qaytish
        </Link>
      </div>
    );
  }

  const isItemInCart = cartItems.some(item => item.id === product.id);
  const isItemFavorite = isFavorite(product.id);

  const imagesList = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const similarProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 5);

  return (
    <div className="container">
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', margin: '18px 0' }}>
        <Link to="/" style={{ color: 'var(--text-muted)' }}>Bosh sahifa</Link>
        <ChevronRight size={14} />
        <Link to="/catalog" style={{ color: 'var(--text-muted)' }}>Katalog</Link>
        <ChevronRight size={14} />
        <Link to={`/catalog?category=${product.category}`} style={{ color: 'var(--text-muted)' }}>
          {product.categoryName}
        </Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>
          {product.name.slice(0, 30)}...
        </span>
      </div>

      <div className="details-layout">
        {/* Gallery */}
        <div className="details-gallery">
          {imagesList.length > 1 && (
            <div className="gallery-thumbs">
              {imagesList.map((img, idx) => (
                <div
                  key={idx}
                  className={`thumb-item ${selectedImg === img ? 'active' : ''}`}
                  onClick={() => setSelectedImg(img)}
                >
                  <img src={img} alt={`${product.name} ${idx}`} />
                </div>
              ))}
            </div>
          )}

          <div className="gallery-main">
            <img src={selectedImg} alt={product.name} className="gallery-main-img" />
            {product.discount > 0 && (
              <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                <span className="discount-badge" style={{ fontSize: '14px', padding: '6px 12px' }}>
                  -{product.discount}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Product Details Info */}
        <div className="details-info">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="details-brand-tag">
              {product.features?.Brend || product.categoryName}
            </span>
            <button
              onClick={handleShare}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}
            >
              <Share2 size={16} />
              <span>{copied ? "Nusxalandi!" : "Ulashish"}</span>
            </button>
          </div>

          <h1 className="details-title">{product.name}</h1>

          <div className="details-rating-bar">
            <div className="rating-pill" style={{ fontSize: '14px' }}>
              <Star size={16} fill="#F59E0B" color="#F59E0B" />
              <span>{product.rating}</span>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>
              ({product.reviewsCount + reviews.length - INITIAL_REVIEWS.length} ta sharh va baholar)
            </span>
            <span style={{ color: '#107c41', fontWeight: 600 }}>
              {product.soldCount}
            </span>
          </div>

          {/* Pricing Box */}
          <div className="details-price-box">
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span className="details-current-price">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <span className="details-old-price">{formatPrice(product.oldPrice)}</span>
              )}
            </div>

            {product.monthlyPrice && (
              <div 
                className="details-installment-box" 
                style={{ cursor: 'pointer' }}
                onClick={() => setIsNasiyaModalOpen(true)}
                title="Uzum Nasiya kalkulyatorini ochish"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={18} color="#7000FF" />
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>Uzum Nasiya:</span>
                </div>
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--primary)', textDecoration: 'underline' }}>
                  oyiga {formatPrice(product.monthlyPrice)} dan 12 oyga ⓘ
                </span>
              </div>
            )}
          </div>

          {/* Delivery & Guarantees */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '14px 0', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#107c41', fontWeight: 600 }}>
              <Truck size={18} />
              <span>1 kunda bepul yetkazib beriladi (Ertaga topshirish punktida)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
              <ShieldCheck size={18} />
              <span>100% original tovar, rasmiy kafolat bilan</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
              <RotateCcw size={18} />
              <span>10 kun ichida qulay va tezkor qaytarish kafolati</span>
            </div>
          </div>

          {/* Quantity Stepper */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '20px 0' }}>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Miqdori:</span>
            <div className="qty-stepper">
              <button
                className="qty-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus size={15} />
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                className="qty-btn"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus size={15} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="details-actions">
            <button
              className="add-to-cart-large-btn"
              onClick={() => addToCart(product, quantity)}
            >
              <ShoppingBag size={20} />
              <span>
                {isItemInCart ? "Yana savatchaga qo'shish" : "Savatchaga qo'shish"}
              </span>
            </button>

            <button
              className="checkout-btn"
              style={{ background: '#FF6900', boxShadow: 'none' }}
              onClick={handleBuyNow}
            >
              1 marta bosishda xarid qilish
            </button>

            <button
              className={`fav-large-btn ${isItemFavorite ? 'active' : ''}`}
              onClick={() => toggleFavorite(product)}
              title="Sevimlilarga qo'shish"
            >
              <Heart size={22} fill={isItemFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>

      {/* Description & Specs Tabs */}
      <div style={{
        background: '#fff',
        borderRadius: 'var(--radius-xl)',
        padding: '32px',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '30px'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>
          Mahsulot tavsifi
        </h3>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '24px' }}>
          {product.description}
        </p>

        {product.features && (
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
              Asosiy xususiyatlari
            </h4>
            <div className="details-features-table" style={{ maxWidth: '600px' }}>
              {Object.entries(product.features).map(([key, val]) => (
                <div key={key} className="feature-row">
                  <span className="feature-name">{key}</span>
                  <span className="feature-val">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Customer Reviews & Feedback Section */}
      <div style={{
        background: '#fff',
        borderRadius: 'var(--radius-xl)',
        padding: '32px',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '40px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={22} color="var(--primary)" />
              <span>Mijozlar sharhlari ({reviews.length})</span>
            </h3>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Faqat haqiqiy xaridorlar tomonidan qoldirilgan fikrlar
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-gray)', padding: '8px 16px', borderRadius: '12px' }}>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#F59E0B' }}>{product.rating}</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={14} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Umumiy baho</span>
            </div>
          </div>
        </div>

        {/* Review Submission Form */}
        <form onSubmit={handleAddReview} style={{ background: 'var(--bg-gray)', padding: '20px', borderRadius: '14px', marginBottom: '28px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>
            Mahsulot haqida o'z fikringizni qoldiring:
          </h4>

          {reviewSubmitted && (
            <div style={{ background: '#DCFCE7', color: '#15803D', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <CheckCircle2 size={16} />
              <span>Sharhingiz qabul qilindi va qo'shildi!</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '16px', marginBottom: '14px' }}>
            <input
              type="text"
              required
              placeholder="Ismingiz (masalan: Nodirbek)"
              className="form-input"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', padding: '0 12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Baho:</span>
              <div style={{ display: 'flex', gap: '4px', cursor: 'pointer' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={18}
                    fill={s <= newRating ? '#F59E0B' : 'none'}
                    color="#F59E0B"
                    onClick={() => setNewRating(s)}
                  />
                ))}
              </div>
            </div>
          </div>

          <textarea
            required
            rows={3}
            placeholder="Mahsulot sifati, yetkazib berish va taassurotlaringiz haqida yozing..."
            className="form-textarea"
            style={{ marginBottom: '14px' }}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />

          <button type="submit" className="checkout-btn" style={{ width: 'fit-content', padding: '10px 24px', fontSize: '13px' }}>
            <Send size={15} />
            <span>Sharh qoldirish</span>
          </button>
        </form>

        {/* Reviews List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviews.map((rev) => (
            <div key={rev.id} style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px' }}>
                    {rev.author[0]}
                  </div>
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: 700 }}>{rev.author}</span>
                    <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={12} fill="#F59E0B" color="#F59E0B" />
                      ))}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>{rev.date}</span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-main)', marginTop: '8px', paddingLeft: '40px' }}>
                {rev.comment}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Uzum Nasiya Calculator Modal */}
      {isNasiyaModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNasiyaModalOpen(false)}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <button className="modal-close-btn" onClick={() => setIsNasiyaModalOpen(false)}>
              <X size={18} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                <CreditCard size={28} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Uzum Nasiya kalkulyatori</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Boshlang'ich to'lovsiz, 0% ortiqcha foiz bilan bo'lib to'lang</p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                Muddatni tanlang:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {[3, 6, 12, 24].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setNasiyaMonths(m)}
                    style={{
                      padding: '10px 0',
                      borderRadius: '8px',
                      border: nasiyaMonths === m ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      background: nasiyaMonths === m ? 'var(--primary-light)' : '#fff',
                      color: nasiyaMonths === m ? 'var(--primary)' : 'var(--text-main)',
                      fontWeight: 700,
                      fontSize: '13px'
                    }}
                  >
                    {m} oy
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--bg-gray)', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tovar narxi:</span>
                <span style={{ fontWeight: 600 }}>{formatPrice(product.price)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Boshlang'ich to'lov:</span>
                <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>0 so'm</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', paddingTop: '10px', borderTop: '1px dashed var(--border-color)' }}>
                <span style={{ fontWeight: 700 }}>Oylik to'lov:</span>
                <span style={{ fontWeight: 800, color: 'var(--primary)' }}>
                  {formatPrice(Math.round(product.price / nasiyaMonths))} / oy
                </span>
              </div>
            </div>

            <button
              className="checkout-btn"
              onClick={() => {
                setIsNasiyaModalOpen(false);
                addToCart(product, quantity);
                navigate('/checkout');
              }}
            >
              Uzum Nasiya bilan xarid qilish
            </button>
          </div>
        </div>
      )}

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <ProductList
          title="O'xshash mahsulotlar"
          products={similarProducts}
        />
      )}
    </div>
  );
};

export default ProductDetails;
