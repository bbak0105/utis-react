import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SliderCards from '@/components/SliderCards'
import FilterDropdown from '@/components/FilterDropdown'
import useBreakpoint from '@/utils/hooks/useBreakpoint'
import { RiSearchLine, RiMapPinLine, RiStarFill, RiHeartLine, RiShoppingCartLine, RiArrowRightSLine } from 'react-icons/ri'
import s from './Tour.module.scss'

interface ExtendedProduct {
  id: string
  name: string
  description: string
  originalPrice: number
  discountedPrice: number
  discountRate: number
  image: string
  rating?: number
  ratingCount?: number
  tag?: string
  tagVariant?: 'purple' | 'pink' | 'green'
  location?: string
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

// 필터 옵션
const FILTER_OPTIONS = [
  { value: 'new', label: '신상품' },
  { value: 'name', label: '상품명' },
  { value: 'price-low', label: '낮은가격' },
  { value: 'price-high', label: '높은가격' },
  { value: 'manufacturer', label: '제조사' },
  { value: 'reviews', label: '사용후기' }
]

// 도시 옵션
const CITY_OPTIONS = [
  { value: 'tokyo', label: '도쿄' },
  { value: 'osaka', label: '오사카' },
  { value: 'kyoto', label: '교토' },
  { value: 'fukuoka', label: '후쿠오카' }
]

// 인기 검색어
const POPULAR_SEARCHES = [
  '유니버셜 재팬',
  '디즈니랜드',
  '일본 유니버셜'
]

// 인기 어트랙션
const POPULAR_ATTRACTIONS = [
  '도쿄 타워',
  '센소지',
  '도쿄 스카이트리',
  '고쿄',
  '긴자',
  '신주쿠구'
]

// 투어 상품 데이터
const TOUR_PRODUCTS: ExtendedProduct[] = [
  {
    id: 'tour-1',
    name: '[유후인 직행, 8가지 특전] 유후인 버스투어 (후쿠오카 유후인 벳푸 히타 우키하) 유유...',
    description: '후쿠오카에서 출발하는 편리한 버스투어',
    originalPrice: 52000,
    discountedPrice: 40900,
    discountRate: 21,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    ratingCount: 2732,
    tag: '즉시확정',
    tagVariant: 'purple',
    location: '후쿠오카·투어'
  },
  {
    id: 'tour-2',
    name: '[1명부터 출발] 교토 버스투어 (청수사 후시미 금각사 아라시야마) 엔데이트립',
    description: '교토의 명소를 한 번에 둘러보는 버스투어',
    originalPrice: 99800,
    discountedPrice: 47040,
    discountRate: 52,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    ratingCount: 1523,
    tag: '쿠폰',
    tagVariant: 'pink',
    location: '교토·투어'
  },
  {
    id: 'tour-3',
    name: '[1명부터 출발] 나라 교토 버스투어 (나라사슴 공원 교토 청수사 헤이안신궁) 엔데이트...',
    description: '나라와 교토를 함께 둘러보는 특별한 투어',
    originalPrice: 69000,
    discountedPrice: 28130,
    discountRate: 59,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    ratingCount: 987,
    tag: '쿠폰',
    tagVariant: 'pink',
    location: '나라·교토·투어'
  },
  {
    id: 'tour-4',
    name: '[준페이예약/스스키노하차] 비에이 버스투어 (후라노 삿포로)',
    description: '홋카이도의 아름다운 풍경을 만나는 투어',
    originalPrice: 59000,
    discountedPrice: 52270,
    discountRate: 11,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    ratingCount: 2156,
    tag: '즉시확정',
    tagVariant: 'purple',
    location: '홋카이도·투어'
  }
]

const Tour = () => {
  const navigate = useNavigate()
  const { bp } = useBreakpoint()
  const isMobile = bp === 'xs' || bp === 'sm' || bp === 'md'
  const [selectedCity, setSelectedCity] = useState('tokyo')
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [filter, setFilter] = useState('new')
  const searchRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 시 검색 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false)
      }
    }

    if (isSearchFocused) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSearchFocused])

  const handleSearch = () => {
    // 검색 로직
    console.log('Search:', { city: selectedCity, term: searchTerm })
  }

  return (
    <div className={s.container}>
      {/* 히어로 배너 */}
      <div className={s.heroBanner}>
        <div className={s.heroContent}>
          <h1 className={s.heroTitle}>투어 & 티켓</h1>
          
          {/* 검색 바 */}
          <div className={s.searchBar} ref={searchRef}>
            <div className={s.searchRow}>
              <FilterDropdown
                options={CITY_OPTIONS}
                selectedValue={selectedCity}
                onSelect={setSelectedCity}
                placeholder="도시 선택"
              />
              <div className={s.searchInputWrapper}>
                <input
                  type="text"
                  className={s.searchInput}
                  placeholder="여행지 또는 어트랙션 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                />
                {isSearchFocused && (
                  <div className={s.searchDropdown}>
                    <div className={s.searchDropdownHeader}>
                      <span>최근 검색</span>
                      <button className={s.deleteHistoryButton}>기록 삭제</button>
                    </div>
                    <div className={s.searchSection}>
                      <div className={s.sectionTitle}>인기 검색</div>
                      <div className={s.searchItems}>
                        {POPULAR_SEARCHES.map((item, idx) => (
                          <button key={idx} className={s.searchItem}>
                            <RiSearchLine className={s.searchIcon} />
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className={s.searchSection}>
                      <div className={s.sectionTitle}>인기 어트랙션</div>
                      <div className={s.searchItems}>
                        {POPULAR_ATTRACTIONS.map((item, idx) => (
                          <button key={idx} className={s.searchItem}>
                            <RiMapPinLine className={s.searchIcon} />
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button className={s.searchButton} onClick={handleSearch}>
                <RiSearchLine />
                검색
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 프로모션 섹션 */}
      <div className={s.bannerSection}>
        <SliderCards items={PROMO_SLIDER_ITEMS} />
      </div>

      {/* 인기 상품 섹션 */}
      <div className={s.productsSection}>
        <div className={s.sectionHeader}>
          <div className={s.sectionTitleGroup}>
            <h2 className={s.sectionTitle}>인기 상품</h2>
          </div>
          <div className={s.sectionControls}>
            <FilterDropdown
              options={FILTER_OPTIONS}
              selectedValue={filter}
              onSelect={setFilter}
            />
          </div>
        </div>

        <div className={s.productGrid}>
          {TOUR_PRODUCTS.map((product) => (
            <div key={product.id} className={s.productCard}>
              <div className={s.productImage}>
                <img src={product.image} alt={product.name} />
                {product.tag && (
                  <span className={`${s.productTag} ${product.tagVariant ? s[`productTag_${product.tagVariant}`] : ''}`}>
                    {product.tag}
                  </span>
                )}
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
                {product.location && (
                  <div className={s.productLocation}>{product.location}</div>
                )}
                <h3 className={s.productName}>{product.name}</h3>
                {product.rating && (
                  <div className={s.productRating}>
                    <RiStarFill className={s.ratingIcon} />
                    <span>★{product.rating.toFixed(1)} ({product.ratingCount?.toLocaleString()}개)</span>
                  </div>
                )}
                <div className={s.productPrice}>
                  <span className={s.originalPrice}>{product.originalPrice.toLocaleString()}원</span>
                  <span className={s.discountRate}>{product.discountRate}%</span>
                </div>
                <div className={s.discountedPrice}>{product.discountedPrice.toLocaleString()}원</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Tour
