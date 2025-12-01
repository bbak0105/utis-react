import { useState, useRef } from 'react'
import useBreakpoint from '@/utils/hooks/useBreakpoint'
import s from './SliderCards.module.scss'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { RiArrowLeftSLine, RiArrowRightSLine, RiLayoutGridLine } from 'react-icons/ri'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'

export type Slider = { id: string; title: string; subtitle: string; image: string }
type Props = { items: Slider[] }

const SliderCards = ({ items }: Props) => {
  const { bp } = useBreakpoint()
  const isSwiper = bp === 'xs' || bp === 'sm' || bp === 'md'  // lg 미만은 전부 슬라이드
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<SwiperType | null>(null)

  // 각 카드마다 다른 배경 색상 - 강제로 밝은 색상 고정
  const getCardStyle = (index: number) => {
    const gradients = [
      'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)', // 밝은 회색 그라데이션
      'linear-gradient(135deg, #f0f9f0 0%, #ffffff 100%)', // 밝은 녹색 그라데이션
    ]
    return {
      background: `${gradients[index % gradients.length]} !important`
    }
  }

  if (isSwiper) {
    const handlePrev = () => {
      swiperRef.current?.slidePrev()
    }

    const handleNext = () => {
      swiperRef.current?.slideNext()
    }

    // loop 모드에서는 realIndex를 사용해야 실제 인덱스를 얻을 수 있음
    const getRealIndex = () => {
      if (swiperRef.current) {
        return swiperRef.current.realIndex !== undefined 
          ? swiperRef.current.realIndex 
          : activeIndex
      }
      return activeIndex
    }

    const currentIndex = getRealIndex() + 1
    const totalSlides = items.length

    return (
      <div className={s.mobileWrap}>
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          spaceBetween={12}
          slidesPerView={1}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          loop={true}
          speed={500}
          style={{ paddingBottom: 24 }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper
          }}
          onSlideChange={(swiper) => {
            const realIndex = swiper.realIndex !== undefined ? swiper.realIndex : swiper.activeIndex
            setActiveIndex(realIndex)
          }}
        >
          {items.map((it, index) => (
            <SwiperSlide key={it.id}>
              <article 
                className={s.card}
                style={{
                  ...getCardStyle(index),
                  backgroundImage: it.image ? `url(${it.image})` : undefined
                }}
              >
                <div className={s.text}>
                  <h3 className={s.title}>{it.title}</h3>
                  <p className={s.sub}>{it.subtitle}</p>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className={s.paginationControls}>
          <button 
            className={s.navButton} 
            onClick={handlePrev}
            aria-label="이전 슬라이드"
          >
            <RiArrowLeftSLine />
          </button>
          <span className={s.pageInfo}>
            {currentIndex} / {totalSlides}
          </span>
          <button 
            className={s.navButton} 
            onClick={handleNext}
            aria-label="다음 슬라이드"
          >
            <RiArrowRightSLine />
          </button>
        </div>
      </div>
    )
  }

  // lg 이상 → 3칸, xl 이상 → 4칸
  return (
    <div className={`${s.grid} container`}>
      {items.map((it, index) => (
        <article 
          key={it.id} 
          className={s.card}
          style={{
            ...getCardStyle(index),
            backgroundImage: it.image ? `url(${it.image})` : undefined
          }}
        >
          <div className={s.text}>
            <h3 className={s.title}>{it.title}</h3>
            <p className={s.sub}>{it.subtitle}</p>
          </div>
        </article>
      ))}
    </div>
  )
}

export default SliderCards