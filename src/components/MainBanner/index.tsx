import { useState } from 'react'
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri'
import s from './MainBanner.module.scss'

interface BannerItem {
  id: string
  image: string
  title?: string
  subtitle?: string
  buttonText?: string
}

interface MainBannerProps {
  items: BannerItem[]
}

const MainBanner = ({ items }: MainBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(1) // 중앙 슬라이드가 기본

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // 현재 슬라이드 기준으로 이전, 현재, 다음 슬라이드 표시
  const getVisibleSlides = () => {
    const slides = []
    for (let i = -1; i <= 1; i++) {
      let index = currentIndex + i
      if (index < 0) index = items.length - 1
      if (index >= items.length) index = 0
      slides.push({ item: items[index], originalIndex: index, offset: i })
    }
    return slides
  }

  return (
    <div className={s.bannerContainer}>
      <div className={s.bannerWrapper}>
        {getVisibleSlides().map(({ item, originalIndex, offset }) => (
          <div
            key={`${item.id}-${originalIndex}`}
            className={`${s.bannerSlide} ${offset === 0 ? s.active : ''} ${offset === -1 ? s.left : ''} ${offset === 1 ? s.right : ''}`}
            style={{
              backgroundImage: `url(${item.image})`
            }}
          >
            {offset === 0 && (item.title || item.buttonText) && (
              <div className={s.bannerContent}>
                {item.title && <h2 className={s.bannerTitle}>{item.title}</h2>}
                {item.subtitle && <p className={s.bannerSubtitle}>{item.subtitle}</p>}
                {item.buttonText && (
                  <button className={s.bannerButton}>{item.buttonText}</button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 네비게이션 화살표 */}
      <button 
        className={s.navArrow} 
        onClick={goToPrevious}
        aria-label="이전 슬라이드"
      >
        <RiArrowLeftSLine />
      </button>
      <button 
        className={`${s.navArrow} ${s.navArrowRight}`} 
        onClick={goToNext}
        aria-label="다음 슬라이드"
      >
        <RiArrowRightSLine />
      </button>

      {/* 페이지네이션 도트 */}
      <div className={s.pagination}>
        {items.map((_, index) => (
          <button
            key={index}
            className={`${s.paginationDot} ${index === currentIndex ? s.active : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`슬라이드 ${index + 1}로 이동`}
          />
        ))}
      </div>
    </div>
  )
}

export default MainBanner

