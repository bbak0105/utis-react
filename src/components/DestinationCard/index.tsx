import React from 'react'
import { RiStarFill } from 'react-icons/ri'
import styles from './DestinationCard.module.scss'

interface DestinationCardProps {
  title: string
  image: string
  rating?: string
  reviewCount?: string
  price?: string
  isPromotional?: boolean
  onClick?: () => void
}

const DestinationCard: React.FC<DestinationCardProps> = ({
  title,
  image,
  rating,
  reviewCount,
  price,
  isPromotional = false,
  onClick
}) => {
  return (
    <div 
      className={`${styles.destinationCard} ${isPromotional ? styles.promotionalCard : ''}`}
      onClick={onClick}
    >
      <div className={styles.cardImage}>
        <img src={image} alt={title} />
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>
          {isPromotional && <RiStarFill className={styles.starIcon} />}
          {title}
        </h3>
        
        {!isPromotional && (
          <>
            <div className={styles.cardRating}>
              <span className={styles.ratingBadge}>{rating}</span>
              <span className={styles.reviewCount}>{reviewCount}</span>
            </div>
            <div className={styles.cardPrice}>
              <span className={styles.priceText}>
                <span className={styles.priceNumber}>{price}</span>
                <span className={styles.priceUnit}>원부터~</span>
              </span>
            </div>
          </>
        )}
        
        {isPromotional && (
          <button className={styles.checkButton}>지금 확인하기</button>
        )}
      </div>
    </div>
  )
}

export default DestinationCard
