import React, { createContext, useContext, useState, useEffect } from 'react';
import { promoCodes } from '../data/products';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('uzum_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState(() => {
    try {
      const saved = localStorage.getItem('uzum_promo');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('uzum_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  useEffect(() => {
    if (appliedPromo) {
      localStorage.setItem('uzum_promo', JSON.stringify(appliedPromo));
    } else {
      localStorage.removeItem('uzum_promo');
    }
  }, [appliedPromo]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    showNotification(`"${product.name.slice(0, 32)}..." savatchaga qo'shildi!`);
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    showNotification("Mahsulot savatchadan o'chirildi", 'info');
  };

  const updateQuantity = (productId, delta) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const setItemQuantity = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => (item.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedPromo(null);
  };

  const applyPromo = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (promoCodes[cleanCode]) {
      const promo = { code: cleanCode, ...promoCodes[cleanCode] };
      setAppliedPromo(promo);
      showNotification(`"${cleanCode}" promokodi muvaffaqiyatli qo'llandi! ${promo.discount}% chegirma`, 'success');
      return { success: true, message: `${promo.discount}% chegirma faollashtirildi!` };
    } else {
      showNotification("Noto'g'ri promokod kiritildi!", 'error');
      return { success: false, message: "Noto'g'ri promokod! Iltimos, tekshirib qayta kiriting." };
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    showNotification("Promokod bekor qilindi", 'info');
  };

  // Calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const originalTotal = cartItems.reduce((acc, item) => {
    const original = item.oldPrice || item.price;
    return acc + (original * item.quantity);
  }, 0);

  const baseSavings = Math.max(0, originalTotal - subtotal);

  const promoDiscountAmount = appliedPromo 
    ? Math.round((subtotal * appliedPromo.discount) / 100) 
    : 0;

  const totalDiscount = baseSavings + promoDiscountAmount;

  const finalTotal = Math.max(0, subtotal - promoDiscountAmount);

  // Free delivery threshold: 200 000 UZS
  const freeDeliveryThreshold = 200000;
  const deliveryFee = finalTotal >= freeDeliveryThreshold || finalTotal === 0 ? 0 : 20000;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        setItemQuantity,
        clearCart,
        appliedPromo,
        applyPromo,
        removePromo,
        cartCount,
        subtotal,
        originalTotal,
        baseSavings,
        promoDiscountAmount,
        totalDiscount,
        finalTotal,
        deliveryFee,
        freeDeliveryThreshold,
        notification
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

