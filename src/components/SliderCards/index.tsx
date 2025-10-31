import useBreakpoint from '@/utils/hooks/useBreakpoint'
import s from './SliderCards.module.scss'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'

export type Slider = { id: string; title: string; subtitle: string; image: string }
type Props = { items: Slider[] }

const SliderCards = ({ items }: Props) => {
  const { bp } = useBreakpoint()
  const isSwiper = bp === 'xs' || bp === 'sm' || bp === 'md'  // lg 미만은 전부 슬라이드

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