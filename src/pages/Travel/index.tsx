import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import SliderCards from '@/components/SliderCards'
import ProductList from '@/components/ProductList'
import { ProductProps } from '@/components/Product'
import useBreakpoint from '@/utils/hooks/useBreakpoint'
import { RiSearchLine, RiHeartLine } from 'react-icons/ri'
import s from './Travel.module.scss'

// 프로모션 슬라이드 카드 데이터
const PROMO_SLIDER_ITEMS = [
  {
    id: '1',
    title: '무료 샤워기 받아가세요',
    subtitle: '신규 가입시 무료 샤워기 지급',
    image: ''
  },
  {
    id: '2',
    title: '타이머가 멈추기 전에!',
    subtitle: '늦으면 끝! 지금 바로 쇼핑하세요.',
    image: ''
  }
]

// 카테고리 데이터
const CATEGORIES = [
  { id: 'shower', label: '샤워기', icon: '🚿', path: '/shower' },
  { id: 'adapter', label: '어댑터', icon: '🔌', path: '/adapter' },
  { id: 'carrier', label: '캐리어', icon: '🧳', path: '/carrier' },
  { id: 'pillow', label: '목베개', icon: '🛏️', path: '/travel' },
  { id: 'esim', label: '이심', icon: '📱', path: '/travel' }
]

// 실시간 검색 순위
const SEARCH_RANKINGS = [
  '이심',
  '여행용 캐리어',
  '멀티 어댑터',
  '여행용 목베개',
  '압축 파우치'
]

// 제품 데이터
const ESIM_PRODUCTS: ProductProps[] = [
  {
    id: 'esim-1',
    name: '여행용 멀티 어댑터 45W 4구',
    description: '상품 요약 설명을 활용해보세요!',
    originalPrice: 50000,
    discountedPrice: 32900,
    discountRate: 34,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 'esim-2',
    name: '여행용 멀티 어댑터 45W 4구',
    description: '상품 요약 설명을 활용해보세요!',
    originalPrice: 50000,
    discountedPrice: 32900,
    discountRate: 34,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 'esim-3',
    name: '여행용 멀티 어댑터 45W 4구',
    description: '상품 요약 설명을 활용해보세요!',
    originalPrice: 50000,
    discountedPrice: 32900,
    discountRate: 34,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  }
]

const CARRIER_PRODUCTS: ProductProps[] = [
  {
    id: 'carrier-1',
    name: '여행용 캐리어 20인치',
    description: '상품 요약 설명을 활용해보세요!',
    originalPrice: 150000,
    discountedPrice: 99000,
    discountRate: 34,
    image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800'
  },
  {
    id: 'carrier-2',
    name: '여행용 캐리어 20인치',
    description: '상품 요약 설명을 활용해보세요!',
    originalPrice: 150000,
    discountedPrice: 99000,
    discountRate: 34,
    image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800'
  },
  {
    id: 'carrier-3',
    name: '여행용 캐리어 20인치',
    description: '상품 요약 설명을 활용해보세요!',
    originalPrice: 150000,
    discountedPrice: 99000,
    discountRate: 34,
    image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800'
  }
]

const ADAPTER_PRODUCTS: ProductProps[] = [
  {
    id: 'adapter-1',
    name: '여행용 멀티 어댑터 45W 4구',
    description: '상품 요약 설명을 활용해보세요!',
    originalPrice: 50000,
    discountedPrice: 32900,
    discountRate: 34,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 'adapter-2',
    name: '여행용 멀티 어댑터 45W 4구',
    description: '상품 요약 설명을 활용해보세요!',
    originalPrice: 50000,
    discountedPrice: 32900,
    discountRate: 34,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 'adapter-3',
    name: '여행용 멀티 어댑터 45W 4구',
    description: '상품 요약 설명을 활용해보세요!',
    originalPrice: 50000,
    discountedPrice: 32900,
    discountRate: 34,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  }
]

const Travel = () => {
  const { bp } = useBreakpoint()
  const isMobile = bp === 'xs' || bp === 'sm' || bp === 'md'

  return (
    <div className={s.container}>
      {/* 프로모션 슬라이드 카드 */}
      <div className={s.bannerSection}>
        <SliderCards items={PROMO_SLIDER_ITEMS} />
      </div>
      
      {/* 카테고리 아이콘 */}
      <div className={s.categoriesSection}>
        <div className={s.categoriesGrid}>
          {CATEGORIES.map((category) => (
            <NavLink
              key={category.id}
              to={category.path}
              className={s.categoryItem}
            >
              <div className={s.categoryIcon}>{category.icon}</div>
              <span className={s.categoryLabel}>{category.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
      
      {/* 메인 콘텐츠 영역 */}
      <div className={s.mainContent}>
        {/* 데스크탑: 사이드바 + 메인 콘텐츠 */}
        {!isMobile && (
          <>
            {/* 좌측 사이드바 */}
            <aside className={s.sidebar}>
              <div className={s.sidebarContent}>
                <h3 className={s.sidebarTitle}>실시간 여행용품 검색 순위</h3>
                <ul className={s.rankingList}>
                  {SEARCH_RANKINGS.map((item, index) => (
                    <li key={index} className={s.rankingItem}>
                      <span className={s.rankingNumber}>{index + 1}</span>
                      <span className={s.rankingText}>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className={s.sidebarNote}>
                  자가 등록한 검색 순위 노출
                  <br />
                  그는 실시간 검색 순위
                </div>
              </div>
            </aside>

            {/* 우측 메인 콘텐츠 */}
            <div className={s.contentArea}>
              {/* 이심 섹션 */}
              <section className={s.productSection}>
                <div className={s.sectionHeader}>
                  <h2 className={s.sectionTitle}>이심</h2>
                  <div className={s.sectionControls}>
                    <select className={s.sortSelect}>
                      <option>정렬</option>
                      <option>추천순</option>
                    </select>
                    <button className={s.moreButton}>더보기</button>
                  </div>
                </div>
                <div className={s.productGrid}>
                  {ESIM_PRODUCTS.map((product) => (
                    <div key={product.id} className={s.productCard}>
                      <div className={s.productImage}>
                        <img src={product.image} alt={product.name} />
                        <button className={s.heartButton}>
                          <RiHeartLine />
                        </button>
                      </div>
                      <div className={s.productInfo}>
                        <h3 className={s.productName}>{product.name}</h3>
                        <p className={s.productDescription}>{product.description}</p>
                        <div className={s.productPrice}>
                          <span className={s.originalPrice}>
                            {product.originalPrice.toLocaleString()}원
                          </span>
                          <div className={s.discountInfo}>
                            <span className={s.discountRate}>{product.discountRate}%</span>
                            <span className={s.discountedPrice}>
                              {product.discountedPrice.toLocaleString()}원
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 여행용캐리어 섹션 */}
              <section className={s.productSection}>
                <div className={s.sectionHeader}>
                  <h2 className={s.sectionTitle}>여행용캐리어</h2>
                  <button className={s.moreButton}>더보기</button>
                </div>
                <div className={s.productGrid}>
                  {CARRIER_PRODUCTS.map((product) => (
                    <div key={product.id} className={s.productCard}>
                      <div className={s.productImage}>
                        <img src={product.image} alt={product.name} />
                        <button className={s.heartButton}>
                          <RiHeartLine />
                        </button>
                      </div>
                      <div className={s.productInfo}>
                        <h3 className={s.productName}>{product.name}</h3>
                        <p className={s.productDescription}>{product.description}</p>
                        <div className={s.productPrice}>
                          <span className={s.originalPrice}>
                            {product.originalPrice.toLocaleString()}원
                          </span>
                          <div className={s.discountInfo}>
                            <span className={s.discountRate}>{product.discountRate}%</span>
                            <span className={s.discountedPrice}>
                              {product.discountedPrice.toLocaleString()}원
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 멀티 어댑터 섹션 */}
              <section className={s.productSection}>
                <div className={s.sectionHeader}>
                  <h2 className={s.sectionTitle}>멀티 어댑터</h2>
                  <button className={s.moreButton}>더보기</button>
                </div>
                <div className={s.productGrid}>
                  {ADAPTER_PRODUCTS.map((product) => (
                    <div key={product.id} className={s.productCard}>
                      <div className={s.productImage}>
                        <img src={product.image} alt={product.name} />
                        <button className={s.heartButton}>
                          <RiHeartLine />
                        </button>
                      </div>
                      <div className={s.productInfo}>
                        <h3 className={s.productName}>{product.name}</h3>
                        <p className={s.productDescription}>{product.description}</p>
                        <div className={s.productPrice}>
                          <span className={s.originalPrice}>
                            {product.originalPrice.toLocaleString()}원
                          </span>
                          <div className={s.discountInfo}>
                            <span className={s.discountRate}>{product.discountRate}%</span>
                            <span className={s.discountedPrice}>
                              {product.discountedPrice.toLocaleString()}원
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </>
        )}

        {/* 모바일: 단순 제품 리스트 */}
        {isMobile && (
          <div className={s.mobileContent}>
            <ProductList products={[...ESIM_PRODUCTS, ...CARRIER_PRODUCTS, ...ADAPTER_PRODUCTS]} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Travel
