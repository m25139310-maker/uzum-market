import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const DEFAULT_USER = {
  firstName: "Azizbek",
  lastName: "Karimov",
  phone: "+998 90 123 45 67",
  email: "azizbek.karimov@example.uz",
  city: "Toshkent shahri",
  address: "Chilonzor tumani, 9-mavze, 14-uy, 42-xonadon",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80"
};

const DEFAULT_ORDERS = [
  {
    id: "UZ-84921",
    date: "2026-11-04 15:30",
    status: "Yetkazilmoqda",
    paymentMethod: "Payme",
    deliveryType: "Kuryer orqali eshikkacha",
    address: "Toshkent shahri, Chilonzor tumani, 9-mavze, 14-uy",
    totalAmount: 4350000,
    items: [
      {
        id: 5,
        name: "Smartfon Samsung Galaxy A55 5G 8/128GB Awesome Iceblue",
        price: 4350000,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=300&q=80"
      }
    ]
  },
  {
    id: "UZ-72109",
    date: "2026-10-28 11:15",
    status: "Yetkazildi",
    paymentMethod: "Click",
    deliveryType: "Topshirish punkti (PVZ)",
    address: "Toshkent, Chilonzor metro bekati yonidagi Uzum punkti",
    totalAmount: 1130000,
    items: [
      {
        id: 52,
        name: "Krossovka Nike Air Force 1 '07 White oq klassik charm",
        price: 890000,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&q=80"
      },
      {
        id: 45,
        name: "Qalin paxtali kapyushonli xudi oversize unisex 100% paxta",
        price: 240000,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300&q=80"
      }
    ]
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('uzum_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch (e) {
      return DEFAULT_USER;
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('uzum_orders');
      return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
    } catch (e) {
      return DEFAULT_ORDERS;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('uzum_user', JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('uzum_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders', e);
    }
  }, [orders]);

  const updateProfile = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  const addOrder = (orderData) => {
    const newOrder = {
      id: `UZ-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleString('uz-UZ', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: "Qabul qilindi",
      ...orderData
    };

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        updateProfile,
        orders,
        addOrder,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

