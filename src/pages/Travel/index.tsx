import { useMemo, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import SliderCards from '@/components/SliderCards'
import FilterDropdown from '@/components/FilterDropdown'
import { ProductProps } from '@/components/Product'
import useBreakpoint from '@/utils/hooks/useBreakpoint'
import { RiHeartLine, RiArrowRightSLine, RiShoppingCartLine, RiStarFill } from 'react-icons/ri'
import s from './Travel.module.scss'

interface ExtendedProduct extends ProductProps {
  rating?: number
  ratingCount?: number
  mobileTag?: string
  mobileTagVariant?: 'purple' | 'pink' | 'green'
}

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
  { id: 'pillow', label: '목베개', icon: '🛏️', path: '/pillow' },
  { id: 'esim', label: '이심', icon: '📱', path: '/esim' }
]

// 실시간 검색 순위
const SEARCH_RANKINGS = [
  '이심',
  '여행용 캐리어',
  '멀티 어댑터',
  '여행용 목베개',
  '압축 파우치'
]

// 필터 옵션
const FILTER_OPTIONS = [
  { value: 'new', label: '신상품' },
  { value: 'name', label: '상품명' },
  { value: 'price-low', label: '낮은가격' },
  { value: 'price-high', label: '높은가격' },
  { value: 'manufacturer', label: '제조사' },
  { value: 'reviews', label: '사용후기' }
]

// 제품 데이터
const ESIM_PRODUCTS: ExtendedProduct[] = [
  {
    id: 'esim-1',
    name: '여행용 멀티 어댑터 45W 4구',
    description: '상품 요약 설명을 활용해보세요!',
    originalPrice: 50000,
    discountedPrice: 32900,
    discountRate: 34,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    rating: 4.8,
    ratingCount: 124,
    mobileTag: '즉시 확정',
    mobileTagVariant: 'purple'
  },
  {
    id: 'esim-2',
    name: '여행용 멀티 어댑터 45W 4구',
    description: '상품 요약 설명을 활용해보세요!',
    originalPrice: 50000,
    discountedPrice: 32900,
    discountRate: 34,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    rating: 4.9,
    ratingCount: 97,
    mobileTag: '9월 특가',
    mobileTagVariant: 'pink'
  },
  {
    id: 'esim-3',
    name: '여행용 멀티 어댑터 45W 4구',
    description: '상품 요약 설명을 활용해보세요!',
    originalPrice: 50000,
    discountedPrice: 32900,
    discountRate: 34,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    rating: 4.7,
    ratingCount: 88,
    mobileTag: '한정 수량',
    mobileTagVariant: 'green'
  }
]

const CARRIER_PRODUCTS: ExtendedProduct[] = [
  {
    id: 'carrier-1',
    name: '여행용 캐리어 20인치',
    description: '상품 요약 설명을 활용해보세요!',
    originalPrice: 150000,
    discountedPrice: 99000,
    discountRate: 34,
    image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800',
    rating: 4.8,
    ratingCount: 204,
    mobileTag: '즉시 확정',
    mobileTagVariant: 'purple'
  },
  {
    id: 'carrier-2',
    name: '여행용 캐리어 20인치',
    description: '상품 요약 설명을 활용해보세요!',
    originalPrice: 150000,
    discountedPrice: 99000,
    discountRate: 34,
    image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800',
    rating: 4.9,
    ratingCount: 97,
    mobileTag: '9월 특가',
    mobileTagVariant: 'pink'
  },
  {
    id: 'carrier-3',
    name: '여행용 캐리어 20인치',
    description: '상품 요약 설명을 활용해보세요!',
    originalPrice: 150000,
    discountedPrice: 99000,
    discountRate: 34,
    image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800',
    rating: 4.7,
    ratingCount: 152,
    mobileTag: '인기 상품',
    mobileTagVariant: 'green'
  }
]

const ADAPTER_PRODUCTS: ExtendedProduct[] = [
  {
    id: 'adapter-1',
    name: '여행용 멀티 어댑터 45W 4구',
    description: '상품 요약 설명을 활용해보세요!',
    originalPrice: 50000,
    discountedPrice: 32900,
    discountRate: 34,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    rating: 4.8,
    ratingCount: 63,
    mobileTag: '무료 배송',
    mobileTagVariant: 'purple'
  },
  {
    id: 'adapter-2',
    name: '여행용 멀티 어댑터 45W 4구',
    description: '상품 요약 설명을 활용해보세요!',
    originalPrice: 50000,
    discountedPrice: 32900,
    discountRate: 34,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    rating: 4.6,
    ratingCount: 54,
    mobileTag: '베스트',
    mobileTagVariant: 'pink'
  },
  {
    id: 'adapter-3',
    name: '여행용 멀티 어댑터 45W 4구',
    description: '상품 요약 설명을 활용해보세요!',
    originalPrice: 50000,
    discountedPrice: 32900,
    discountRate: 34,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    rating: 4.9,
    ratingCount: 138,
    mobileTag: '즉시 확정',
    mobileTagVariant: 'purple'
  }
]

interface MobileSection {
  id: string
  title: string
  badgeLabel?: string
  badgeVariant?: 'default' | 'highlight'
  icon?: string
  moreLink?: string
  products: ExtendedProduct[]
}

const Travel = () => {
  const navigate = useNavigate()
  const { bp } = useBreakpoint()
  const isMobile = bp === 'xs' || bp === 'sm' || bp === 'md'
  
  // 각 섹션별 필터 상태 관리
  const [esimFilter, setEsimFilter] = useState('new')
  const [carrierFilter, setCarrierFilter] = useState('new')
  const [adapterFilter, setAdapterFilter] = useState('new')

  const mobileSections: MobileSection[] = useMemo(() => ([
    {
      id: 'esim',
      title: '이심',
      badgeLabel: '마트 추천',
      products: ESIM_PRODUCTS,
      moreLink: '/esim'
    },
    {
      id: 'golf',
      title: '여행용 캐리어',
      badgeLabel: '마트 추천',
      badgeVariant: 'highlight',
      products: CARRIER_PRODUCTS,
      moreLink: '/carrier'
    },
    {
      id: 'adapter',
      title: '여행 필수 멀티 어댑터',
      badgeLabel: '스테디셀러',
      products: ADAPTER_PRODUCTS,
      moreLink: '/adapter'
    }
  ]), [])

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
                    <li 
                      key={index} 
                      className={s.rankingItem}
                      style={{ 
                        animationDelay: `0s, ${2 + index * 2.4}s`
                      }}
                    >
                      <span className={s.rankingNumber}>{index + 1}</span>
                      <span className={s.rankingText}>{item}</span>
                    </li>
                  ))}
                </ul>
                {/* <div className={s.sidebarNote}>
                  자가 등록한 검색 순위 노출
                  <br />
                  그는 실시간 검색 순위
                </div> */}
              </div>
            </aside>

            {/* 우측 메인 콘텐츠 */}
            <div className={s.contentArea}>
              {/* 이심 섹션 */}
              <section className={s.productSection}>
                <div className={s.sectionHeader}>
                  <h2 className={s.sectionTitle}>이심</h2>
                  <div className={s.sectionControls}>
                    <FilterDropdown
                      options={FILTER_OPTIONS}
                      selectedValue={esimFilter}
                      onSelect={setEsimFilter}
                    />
                    <button 
                      className={s.moreButton}
                      onClick={() => navigate('/esim')}
                    >
                      더보기
                      <RiArrowRightSLine className={s.arrowIcon} />
                    </button>
                  </div>
                </div>
                <div className={s.productGrid}>
                  {ESIM_PRODUCTS.map((product) => (
                    <div key={product.id} className={s.productCard}>
                      <div className={s.productImage}>
                        <img src={product.image} alt={product.name} />
                        <div className={s.productActions}>
                          <button type="button" className={s.productActionButton} aria-label="장바구니 담기">
                            <RiShoppingCartLine />
                          </button>
                          <button type="button" className={s.productActionButton} aria-label="찜하기">
                            <RiHeartLine />
                          </button>
                        </div>
                      </div>
                      <div className={s.productInfo}>
                        <div className={s.productTitleRow}>
                          <h3 className={s.productName}>{product.name}</h3>
                          {product.mobileTag && (
                            <span className={`${s.productTag} ${product.mobileTagVariant ? s[`productTag_${product.mobileTagVariant}`] : ''}`}>
                              {product.mobileTag}
                            </span>
                          )}
                        </div>
                        <p className={s.productSubtext}>{product.description}</p>
                        <div className={s.productMeta}>
                          <div className={s.originalRow}>
                            <span className={s.originalPrice}>
                              {product.originalPrice.toLocaleString()}원
                            </span>
                            <span className={s.discountPill}>{product.discountRate}%</span>
                          </div>
                          <div className={s.priceRow}>
                            <span className={s.discountedPrice}>
                              {product.discountedPrice.toLocaleString()}원
                            </span>
                            {product.rating && (
                              <span className={s.productRating}>
                                <RiStarFill className={s.ratingIcon} />
                                {product.rating.toFixed(1)} ({product.ratingCount ?? 0})
                              </span>
                            )}
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
                  <h2 className={s.sectionTitle}>여행용 캐리어</h2>
                  <div className={s.sectionControls}>
                    <FilterDropdown
                      options={FILTER_OPTIONS}
                      selectedValue={carrierFilter}
                      onSelect={setCarrierFilter}
                    />
                    <button 
                      className={s.moreButton}
                      onClick={() => navigate('/carrier')}
                    >
                      더보기
                      <RiArrowRightSLine className={s.arrowIcon} />
                    </button>
                  </div>
                </div>
                <div className={s.productGrid}>
                  {CARRIER_PRODUCTS.map((product) => (
                    <div key={product.id} className={s.productCard}>
                      <div className={s.productImage}>
                        <img src={product.image} alt={product.name} />
                        <div className={s.productActions}>
                          <button type="button" className={s.productActionButton} aria-label="장바구니 담기">
                            <RiShoppingCartLine />
                          </button>
                          <button type="button" className={s.productActionButton} aria-label="찜하기">
                            <RiHeartLine />
                          </button>
                        </div>
                      </div>
                      <div className={s.productInfo}>
                        <div className={s.productTitleRow}>
                          <h3 className={s.productName}>{product.name}</h3>
                          {product.mobileTag && (
                            <span className={`${s.productTag} ${product.mobileTagVariant ? s[`productTag_${product.mobileTagVariant}`] : ''}`}>
                              {product.mobileTag}
                            </span>
                          )}
                        </div>
                        <p className={s.productSubtext}>{product.description}</p>
                        <div className={s.productMeta}>
                          <div className={s.originalRow}>
                            <span className={s.originalPrice}>
                              {product.originalPrice.toLocaleString()}원
                            </span>
                            <span className={s.discountPill}>{product.discountRate}%</span>
                          </div>
                          <div className={s.priceRow}>
                            <span className={s.discountedPrice}>
                              {product.discountedPrice.toLocaleString()}원
                            </span>
                            {product.rating && (
                              <span className={s.productRating}>
                                <RiStarFill className={s.ratingIcon} />
                                {product.rating.toFixed(1)} ({product.ratingCount ?? 0})
                              </span>
                            )}
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
                  <div className={s.sectionControls}>
          <FilterDropdown 
            options={FILTER_OPTIONS}
                      selectedValue={adapterFilter}
                      onSelect={setAdapterFilter}
                    />
                    <button 
                      className={s.moreButton}
                      onClick={() => navigate('/adapter')}
                    >
                      더보기
                      <RiArrowRightSLine className={s.arrowIcon} />
                    </button>
                  </div>
                </div>
                <div className={s.productGrid}>
                  {ADAPTER_PRODUCTS.map((product) => (
                    <div key={product.id} className={s.productCard}>
                      <div className={s.productImage}>
                        <img src={product.image} alt={product.name} />
                        <div className={s.productActions}>
                          <button type="button" className={s.productActionButton} aria-label="장바구니 담기">
                            <RiShoppingCartLine />
                          </button>
                          <button type="button" className={s.productActionButton} aria-label="찜하기">
                            <RiHeartLine />
                          </button>
                        </div>
                      </div>
                      <div className={s.productInfo}>
                        <div className={s.productTitleRow}>
                          <h3 className={s.productName}>{product.name}</h3>
                          {product.mobileTag && (
                            <span className={`${s.productTag} ${product.mobileTagVariant ? s[`productTag_${product.mobileTagVariant}`] : ''}`}>
                              {product.mobileTag}
                            </span>
                          )}
                        </div>
                        <p className={s.productSubtext}>{product.description}</p>
                        <div className={s.productMeta}>
                          <div className={s.originalRow}>
                            <span className={s.originalPrice}>
                              {product.originalPrice.toLocaleString()}원
                            </span>
                            <span className={s.discountPill}>{product.discountRate}%</span>
                          </div>
                          <div className={s.priceRow}>
                            <span className={s.discountedPrice}>
                              {product.discountedPrice.toLocaleString()}원
                            </span>
                            {product.rating && (
                              <span className={s.productRating}>
                                <RiStarFill className={s.ratingIcon} />
                                {product.rating.toFixed(1)} ({product.ratingCount ?? 0})
                              </span>
                            )}
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
            {mobileSections.map((section) => (
              <section key={section.id} className={s.mobileSection}>
                <div className={s.mobileSectionHeader}>
                  <div className={s.mobileSectionTitleGroup}>
                    <h3 className={s.mobileSectionTitle}>
                      {section.title}
                    </h3>
                    {section.badgeLabel && (
                      <span className={`${s.mobileBadge} ${section.badgeVariant === 'highlight' ? s.mobileBadgeHighlight : ''}`}>
                        {section.badgeLabel}
                      </span>
                    )}
                  </div>
                  <button 
                    className={s.mobileMoreButton}
                    onClick={() => navigate(section.moreLink || '/esim')}
                  >
                    더보기
                    <RiArrowRightSLine />
                  </button>
                </div>
                <div className={s.mobileCardScroller}>
                  {section.products.map((product) => (
                    <article key={product.id} className={s.mobileCard}>
                      <div className={s.mobileCardImage}>
                        <img src={product.image} alt={product.name} />
                        <div className={s.productActions}>
                          <button type="button" className={s.productActionButton} aria-label="장바구니 담기">
                            <RiShoppingCartLine />
                          </button>
                          <button type="button" className={s.productActionButton} aria-label="찜하기">
                            <RiHeartLine />
                          </button>
                        </div>
                      </div>
                      <div className={s.mobileCardBody}>
                        <p className={s.mobileCardName}>{product.name}</p>
                        <p className={s.mobileCardDescription}>{product.description}</p>
                        <div className={s.mobileCardMeta}>
                          <span className={s.mobilePrice}>
                            {product.discountedPrice.toLocaleString()}원
                          </span>
                          {product.rating && (
                            <span className={s.mobileRating}>
                              <RiStarFill className={s.ratingIcon} />
                              {product.rating.toFixed(1)} ({product.ratingCount ?? 0})
                            </span>
                          )}
                        </div>
                        {product.mobileTag && (
                          <span className={`${s.mobileCardTag} ${product.mobileTagVariant ? s[`mobileCardTag_${product.mobileTagVariant}`] : ''}`}>
                            {product.mobileTag}
                          </span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
        </div>
        )}
      </div>
    </div>
  )
}

export default Travel
