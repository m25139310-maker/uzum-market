import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { categories } from '../data/categories';

const CategoryList = () => {
  return (
    <section className="categories-strip-section">
      <div className="section-header">
        <h2 className="section-title">Ommabop kategoriyalar</h2>
        <Link to="/catalog" className="section-more-link">
          <span>Barcha kategoriyalar ({categories.length})</span>
          <ChevronRight size={18} />
        </Link>
      </div>

      <div className="categories-strip-grid">
        {categories.slice(0, 8).map((cat) => (
          <Link
            key={cat.id}
            to={`/catalog?category=${cat.slug}`}
            className="category-chip-card"
          >
            <div className="category-chip-img-wrapper">
              <img src={cat.image} alt={cat.name} className="category-chip-img" />
            </div>
            <span className="category-chip-name">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryList;

