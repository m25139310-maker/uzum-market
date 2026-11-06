import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item-row">
      {/* Thumbnail */}
      <Link to={`/product/${item.id}`}>
        <img src={item.image} alt={item.name} className="cart-item-img" />
      </Link>

      {/* Info */}
      <div className="cart-item-info">
        <Link to={`/product/${item.id}`} className="cart-item-name">
          {item.name}
        </Link>
        <span className="cart-item-category">{item.categoryName}</span>
        {item.features && Object.keys(item.features).length > 0 && (
          <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>
            {Object.entries(item.features)[0][0]}: {Object.entries(item.features)[0][1]}
          </span>
        )}
      </div>

      {/* Quantity Stepper */}
      <div className="qty-stepper">
        <button
          className="qty-btn"
          onClick={() => updateQuantity(item.id, -1)}
          aria-label="Kamaytirish"
        >
          <Minus size={15} />
        </button>
        <span className="qty-value">{item.quantity}</span>
        <button
          className="qty-btn"
          onClick={() => updateQuantity(item.id, 1)}
          aria-label="Ko'paytirish"
        >
          <Plus size={15} />
        </button>
      </div>

      {/* Price Details */}
      <div className="cart-item-total">
        <div>{formatPrice(item.price * item.quantity)}</div>
        {item.quantity > 1 && (
          <div className="cart-item-unit-price">
            {formatPrice(item.price)} / dona
          </div>
        )}
      </div>

      {/* Delete Button */}
      <button
        className="cart-item-del-btn"
        onClick={() => removeFromCart(item.id)}
        title="O'chirish"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default CartItem;

