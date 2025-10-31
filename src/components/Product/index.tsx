import React, { useState } from 'react';
import s from './Product.module.scss';
import { NavLink } from 'react-router-dom';

export interface ProductProps {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discountRate: number;
  image: string;
}

const Product: React.FC<ProductProps> = ({
  id,
  name,
  description,
  originalPrice,
  discountedPrice,
  discountRate,
  image,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li className={s.productItem}>
      {/* 썸네일 */}
      <div className={s.thumb}>
        <NavLink 
          to={`/product/${id}`} 
          className={s.thumbLink}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img 
            src={image} 
            alt={name} 
            className={`${s.thumbImage} ${isHovered ? s.imageHovered : ''}`} 
          />
        </NavLink>

        {/* 장바구니·관심상품 액션 버튼 */}
        <div className={s.actions}>
          <span className={s.actionItem}>
            <button className={s.actionButton}>
              <i className="ri-shopping-cart-line"></i>
            </button>
          </span>
          <span className={s.actionItem}>
            <button className={s.actionButton}>
              <i className="ri-heart-line"></i>
            </button>
          </span>
        </div>
      </div>

      {/* 상품정보 */}
      <div className={s.info}>
        {/* 상품명 */}
        <NavLink to={`/product/${id}`} className={s.name}>
          <span className={s.nameText}>{name}</span>
        </NavLink>

        {/* 상품항목 */}
        <ul className={s.desc}>
          <li className={s.descItem}>
            <span className={s.descText}>{description}</span>
          </li>
          <li className={s.descItem}>
            <span className={s.originalPrice}>{originalPrice.toLocaleString()}원</span>
          </li>
          <li className={s.descItem}>
            <span className={s.discountRate}>{discountRate}%</span>
            <span className={s.discountedPrice}>{discountedPrice.toLocaleString()}원</span>
          </li>
        </ul>
      </div>
    </li>
  );
};

export default Product;