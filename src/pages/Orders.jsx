import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Clock, MapPin, CreditCard, ChevronRight, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';

const Orders = () => {
  const { orders } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleReorder = (items) => {
    items.forEach(item => {
      addToCart(item, item.quantity || 1);
    });
    navigate('/cart');
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Yetkazildi':
        return 'status-delivered';
      case 'Yetkazilmoqda':
        return 'status-delivering';
      default:
        return 'status-accepted';
    }
  };

  if (orders.length === 0) {
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
          <Package size={44} />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '10px' }}>
          Hozircha buyurtmalar yo'q
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 24px auto' }}>
          Uzum Market'dan o'zingizga ma'qul tovarlarni xarid qiling va ularni shu yerda kuzatib boring.
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
    <div className="container" style={{ padding: '24px 16px 60px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800 }}>
          Buyurtmalar tarixi <span style={{ color: 'var(--text-muted)', fontSize: '16px', fontWeight: 500 }}>({orders.length} ta)</span>
        </h1>
        <Link to="/catalog" style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: 600 }}>
          Yangi buyurtma berish →
        </Link>
      </div>

      <div style={{ maxWidth: '860px' }}>
        {orders.map((order) => (
          <div key={order.id} className="order-history-card">
            <div className="order-history-header">
              <div>
                <span className="order-number">Buyurtma #{order.id}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <Clock size={14} />
                  <span>{order.date}</span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className={`order-status-badge ${getStatusClass(order.status)}`}>
                  {order.status}
                </span>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                  {formatPrice(order.totalAmount)}
                </div>
              </div>
            </div>

            {/* Delivery & Payment meta */}
            <div style={{
              background: 'var(--bg-gray)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              fontSize: '13px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={15} color="var(--primary)" />
                <span><strong>Manzil:</strong> {order.address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CreditCard size={15} color="var(--primary)" />
                <span><strong>To'lov:</strong> {order.paymentMethod}</span>
              </div>
            </div>

            {/* Order Items preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {order.items?.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="order-thumb-wrapper">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div>
                      <Link to={`/product/${item.id}`} style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                        {item.name}
                      </Link>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {item.quantity} dona × {formatPrice(item.price)}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Action button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
              <button
                onClick={() => handleReorder(order.items || [])}
                className="checkout-btn"
                style={{ width: 'fit-content', padding: '8px 18px', fontSize: '12px' }}
              >
                <ShoppingBag size={14} />
                <span>Qayta buyurtma berish</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;

