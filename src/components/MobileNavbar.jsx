import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

const MobileNavbar = () => {
  const { cartCount } = useCart();
  const { favoritesCount } = useFavorites();

  return (
    <nav className="mobile-bottom-nav">
      <div className="mobile-nav-inner">
        <NavLink
          to="/"
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <Home size={22} />
          <span>Bosh sahifa</span>
        </NavLink>

        <NavLink
          to="/catalog"
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <Grid size={22} />
          <span>Katalog</span>
        </NavLink>

        <NavLink
          to="/favorites"
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <Heart size={22} />
          {favoritesCount > 0 && (
            <span className="mobile-badge">{favoritesCount}</span>
          )}
          <span>Sevimlilar</span>
        </NavLink>

        <NavLink
          to="/cart"
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <ShoppingBag size={22} />
          {cartCount > 0 && (
            <span className="mobile-badge">{cartCount}</span>
          )}
          <span>Savatcha</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <User size={22} />
          <span>Profil</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default MobileNavbar;

