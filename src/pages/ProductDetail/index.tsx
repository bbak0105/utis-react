import { useState, useEffect, useRef } from 'react'
import Breadcrumb from '@/components/Breadcrumb'
import ProductOptions, { ProductOption } from '@/components/ProductOptions'
import { RiStarFill, RiStarLine, RiSearchLine, RiArrowDownSLine } from 'react-icons/ri'
import s from './ProductDetail.module.scss'

const PRODUCT = {
  id: '1',
  name: '퓨어리 여행용 샤워 필터',
  originalPrice: 23900,
  discountedPrice: 16500,
  discountRate: 31,
  description: '상품 요약 설명을 활용해보세요!',
  interestCount: 153,
  images: [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ],
    features: [
      { text: '국내 유일', highlight: ' 아토피 인증 보유', highlightFirst: false },
      { text: ' 여행용 샤워기', highlight: ' 핸드폰보다 가벼운', highlightFirst: true },
      { text: '1년동안', highlight: ' 5만개이상 판매', highlightFirst: false }
    ],
  brand: '자체브랜드',
  shipping: '무료',
  installment: '자세히 보기'
}

const PRODUCT_OPTIONS: ProductOption[] = [
  {
    id: 'brand',
    label: '브랜드',
    type: 'text',
    value: PRODUCT.brand
  },
  {
    id: 'shipping',
    label: '배송비',
    type: 'text',
    value: PRODUCT.shipping
  },
  {
    id: 'installment',
    label: '무이자 할부',
    type: 'link',
    linkText: PRODUCT.installment,
    linkIcon: 'ri-question-line'
  },
  {
    id: 'shower',
    label: '퓨어리 샤워기',
    type: 'select',
    required: true,
    options: [
      { value: 'option1', label: '옵션 1' },
      { value: 'option2', label: '옵션 2' }
    ]
  },
  {
    id: 'freeEvent',
    label: '무료 이벤트',
    type: 'select',
    required: true,
    options: [
      { value: 'event1', label: '이벤트 1' },
      { value: 'event2', label: '이벤트 2' }
    ]
  },
  {
    id: 'event',
    label: '이벤트',
    type: 'select',
    required: true,
    options: [
      { value: 'event1', label: '이벤트 1' },
      { value: 'event2', label: '이벤트 2' }
    ]
  }
]

const BUNDLED_PRODUCTS = [
  {
    id: 'bundle-1',
    name: '퓨어리 여행용 샤워 필터',
    price: 16500,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    brand: 'PURELY'
  },
  {
    id: 'bundle-2',
    name: '여행용 실리콘 공병 세트',
    price: 8900,
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    brand: 'TRAVELER'
  },
  {
    id: 'bundle-3',
    name: '휴대용 섬유향수 3종',
    price: 12900,
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    brand: 'SCENT'
  }
]

const PURCHASE_GUIDE_SECTIONS = [
  {
    id: 'payment',
    title: '상품 결제정보',
    description: [
      '고액결제의 경우 안전을 위해 카드사에서 확인전화를 드릴 수도 있습니다. 확인과정에서 도난 카드의 사용이나 타인 명의의 주문 등 정상적인 주문이 아니라고 판단될 경우 임의로 주문을 보류 또는 취소할 수 있습니다.',
      '무통장 입금은 상품 구매 대금을 PC뱅킹, 인터넷뱅킹, 텔레뱅킹 혹은 가까운 은행에서 직접 입금하시면 됩니다. 주문시 입력한 입금자명과 실제입금자의 성명이 반드시 일치하여야 하며, 7일 이내로 입금을 하셔야 하며 입금되지 않은 주문은 자동취소 됩니다.'
    ]
  },
  {
    id: 'shipping',
    title: '배송안내',
    description: [
      '배송 방법 : 택배',
      '배송 지역 : 전국지역',
      '배송 비용 : 일부 상품 무료 / 조건부 무료',
      '배송 기간 : 2일 ~ 7일',
      '배송 안내 : 산간벽지나 도서지방은 별도의 추가금액을 지불하셔야 하는 경우가 있습니다.'
    ]
  },
  {
    id: 'exchange',
    title: '교환 및 반품안내',
    description: [
      '교환 및 반품이 가능한 경우 상품을 공급 받으신 날로부터 7일이내 단, 가전제품의 경우 포장을 개봉하였거나 포장이 훼손되어 상품가치가 상실된 경우에는 교환/반품이 불가능합니다.',
      '교환 및 반품이 불가능한 경우 고객님의 책임 있는 사유로 상품등이 멸실 또는 훼손된 경우.'
    ]
  }
]

// 리뷰 데이터
const REVIEW_DATA = {
  averageRating: 5.0,
  totalReviews: 867,
  ratingDistribution: [
    { stars: 5, percentage: 98 },
    { stars: 4, percentage: 1 },
    { stars: 3, percentage: 1 },
    { stars: 2, percentage: 0 },
    { stars: 1, percentage: 0 }
  ],
  photoReviews: [
    {
      id: 'photo-1',
      image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400',
      rating: 5,
      text: '방학 기념으로 오사카 여행 가면서 큐알캐리어...',
      userId: '신**'
    },
    {
      id: 'photo-2',
      image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400',
      rating: 5,
      text: '친구랑 같이 노랑색, 분홍색 26인치 캐리어 주문...',
      userId: '김**'
    },
    {
      id: 'photo-3',
      image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400',
      rating: 5,
      text: '효도여행시켜준다고 딸이 주문해준 캐리어랑 베트...',
      userId: '장**'
    },
    {
      id: 'photo-4',
      image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400',
      rating: 5,
      text: '강아지들이랑 3박4일제 주가면 한짐이라서 캐리...',
      userId: '이**'
    },
    {
      id: 'photo-5',
      image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400',
      rating: 5,
      text: '고민했던게 후회되요..무조건 사야해요 실물이...',
      userId: 'J__'
    }
  ],
  reviews: [
    {
      id: 'review-1',
      rating: 5,
      userId: '신**',
      text: '방학 기념으로 오사카 여행 가면서 큐알캐리어 샀는데 진짜 후회없는 선택이었어요! 파스텔 색상이 너무 예쁘고 깔끔한 디자인이라 여행 갈 때마다 기분이 좋아져요. 손잡이가 넓어서 짐이 무거워도 손목에 부담이 없고, 360도 회전하는 바퀴 덕분에 좁은 골목길이나 지하철역에서도 자유롭게 이동할 수 있었어요. 비가 많이 왔는데 커버 덕분에 짐이 전혀 젖지 않았고, 재질도 튼튼해서 여행 다니면서도 깨끗하게 유지됐어요.',
      images: [
        'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400',
        'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400',
        'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400'
      ]
    },
    {
      id: 'review-2',
      rating: 5,
      userId: '김**',
      text: '친구랑 같이 노랑색, 분홍색 26인치 캐리어 주문했는데 색상이 정말 예뻐요! 짐 찾을 때도 한눈에 알아볼 수 있어서 편했어요. 내부 수납공간도 깔끔하게 정리되어 있고 넓어서 필요한 것들 다 넣을 수 있었어요. 바퀴가 정말 부드러워서 다른 캐리어보다 훨씬 끌기 편했고, 여행 중에 가장 만족스러운 구매였어요.',
      images: [
        'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400'
      ]
    }
  ]
}

const ProductDetail = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState({
    shower: '',
    freeEvent: '',
    event: ''
  })
  const [isNavSticky, setIsNavSticky] = useState(false)
  const [activeSection, setActiveSection] = useState('detail')
  const [showFooter, setShowFooter] = useState(false)
  const [isInfoPanelVisible, setIsInfoPanelVisible] = useState(true)
  const [openGuideId, setOpenGuideId] = useState<string | null>(PURCHASE_GUIDE_SECTIONS[0].id)
  const [sortOption, setSortOption] = useState('recommended')
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  
  const navRef = useRef<HTMLDivElement>(null)
  const sortDropdownRef = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({
    detail: null,
    guide: null,
    review: null,
    inquiry: null
  })

  // 페이지 진입 시 스크롤을 최상단으로 초기화
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset
      
      // 네비게이션 바가 상단에 고정되는 시점
      if (navRef.current) {
        const navTop = navRef.current.offsetTop
        setIsNavSticky(scrollTop > navTop)
      }
      
      // 푸터바 표시 시점 (스크롤이 어느 정도 내려갔을 때)
      setShowFooter(scrollTop > 800)

      // scrollButton bottom offset 조정 (footerBar가 나타나면 겹침 방지)
      const root = document.documentElement
      const isMobileView = window.innerWidth <= 868
      if (scrollTop > 800) {
        // 모바일은 footerBar가 더 높으므로 여유를 더 줌
        root.style.setProperty('--scroll-button-bottom', isMobileView ? '250px' : '110px')
      } else {
        root.style.setProperty('--scroll-button-bottom', '24px')
      }
      
      // infoPanel 표시/숨김 처리 (AppLayout 푸터 침범 방지)
      const footer = document.querySelector('footer')
      if (footer) {
        const footerRect = footer.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        
        // 푸터가 화면에 보이기 시작하면 infoPanel 숨김
        if (footerRect.top < viewportHeight - 100) { // 100px 여유 공간
          setIsInfoPanelVisible(false)
        } else {
          setIsInfoPanelVisible(true)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false)
      }
    }

    if (isSortDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSortDropdownOpen])

  // 섹션으로 스크롤 이동
  const scrollToSection = (sectionId: string) => {
    const element = sectionsRef.current[sectionId]
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(sectionId)
    }
  }

  const breadcrumbItems = [
    { label: '홈', path: '/' },
    { label: '샤워기' }
  ]

  const handleOptionChange = (optionId: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionId]: value
    }))
  }

  return (
    <div className={s.productDetail}>
      {/* Breadcrumb */}
      <div className={s.breadcrumbContainer}>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Main Content */}
      <div className={s.mainContent}>
        {/* Left Panel - Product Images */}
        <div className={s.imagePanel}>
          {/* Main Image */}
          <div className={s.mainImageContainer}>
            <img 
              src={PRODUCT.images[selectedImageIndex]} 
              alt={PRODUCT.name}
              className={s.mainImage}
            />
            <div className={s.imageCounter}>
              {selectedImageIndex + 1}/{PRODUCT.images.length}
            </div>
          </div>

          {/* Thumbnail Images */}
          <div className={s.thumbnailContainer}>
            {PRODUCT.images.map((image, index) => (
              <div 
                key={index}
                className={`${s.thumbnail} ${selectedImageIndex === index ? s.thumbnailActive : ''}`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <img src={image} alt={`${PRODUCT.name} ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Product Info */}
        {isInfoPanelVisible && (
          <div className={s.infoPanel}>
          {/* Interest Badge */}
          <div className={s.interestBadge}>
            지금까지 <span className={s.interestCount}>{PRODUCT.interestCount}</span> 명이 관심을 보였어요.
          </div>

          {/* Product Title */}
          <div className={s.titleSection}>
            <h1 className={s.productTitle}>{PRODUCT.name}</h1>
            <div className={s.actionIcons}>
              <button className={s.iconButton}>
                <i className="ri-heart-line"></i>
              </button>
              <button className={s.iconButton}>
                <i className="ri-shopping-cart-line"></i>
              </button>
              <button className={s.iconButton}>
                <i className="ri-share-line"></i>
              </button>
            </div>
          </div>

          {/* Features */}
          <div className={s.features}>
            {PRODUCT.features.map((feature, index) => (
              <div key={index} className={s.feature}>
                <i className="ri-check-line"></i>
                <span>
                  {feature.highlightFirst ? (
                    <>
                      <span className={s.highlight}>{feature.highlight}</span>
                      {feature.text}
                    </>
                  ) : (
                    <>
                      {feature.text}
                      <span className={s.highlight}>{feature.highlight}</span>
                    </>
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className={s.pricing}>
            <div className={s.originalPrice}>{PRODUCT.originalPrice.toLocaleString()}원</div>
            <div className={s.discountRate}>{PRODUCT.discountRate}%</div>
            <div className={s.discountedPrice}>{PRODUCT.discountedPrice.toLocaleString()}원</div>
          </div>

          {/* Description */}
          <div className={s.description}>
            {PRODUCT.description}
          </div>

          {/* Product Options */}
          <ProductOptions 
            options={PRODUCT_OPTIONS}
            selectedValues={selectedOptions}
            onOptionChange={handleOptionChange}
          />
          </div>
        )}
      </div>

      {/* Navigation Bar */}
      <div ref={navRef} className={s.navigationBar} data-nav-bar>
        <nav className={s.navTabs}>
          <button 
            className={`${s.navTab} ${activeSection === 'detail' ? s.active : ''}`}
            onClick={() => scrollToSection('detail')}
          >
            상세정보
          </button>
          <button 
            className={`${s.navTab} ${activeSection === 'guide' ? s.active : ''}`}
            onClick={() => scrollToSection('guide')}
          >
            구매안내
          </button>
          <button 
            className={`${s.navTab} ${activeSection === 'review' ? s.active : ''}`}
            onClick={() => scrollToSection('review')}
          >
            구매후기
          </button>
          <button 
            className={`${s.navTab} ${activeSection === 'inquiry' ? s.active : ''}`}
            onClick={() => scrollToSection('inquiry')}
          >
            상품문의
          </button>
        </nav>
      </div>

      {/* Bundled Products */}
      <section className={s.bundleSection}>
        <h2 className={s.bundleTitle}>함께 구매한 상품</h2>
        <div className={s.bundleList}>
          {BUNDLED_PRODUCTS.map((product) => (
            <article key={product.id} className={s.bundleCard}>
              <div className={s.bundleImage}>
                <img src={product.image} alt={product.name} />
              </div>
              <div className={s.bundleInfo}>
                <span className={s.bundleBrand}>{product.brand}</span>
                <p className={s.bundleName}>{product.name}</p>
                <p className={s.bundlePrice}>{product.price.toLocaleString()}원</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Sticky Navigation */}
      {isNavSticky && (
        <div className={s.stickyNav}>
          <nav className={s.navFixedTabs}>
            <button 
              className={`${s.navTab} ${activeSection === 'detail' ? s.active : ''}`}
              onClick={() => scrollToSection('detail')}
            >
              상세정보
            </button>
            <button 
              className={`${s.navTab} ${activeSection === 'guide' ? s.active : ''}`}
              onClick={() => scrollToSection('guide')}
            >
              구매안내
            </button>
            <button 
              className={`${s.navTab} ${activeSection === 'review' ? s.active : ''}`}
              onClick={() => scrollToSection('review')}
            >
              구매후기
            </button>
            <button 
              className={`${s.navTab} ${activeSection === 'inquiry' ? s.active : ''}`}
              onClick={() => scrollToSection('inquiry')}
            >
              상품문의
            </button>
          </nav>
        </div>
      )}

      {/* 함께 구매한 상품 섹션 */}

      {/* Content Sections */}
      <div className={s.contentSections}>
        {/* 상세정보 섹션 */}
        <section ref={(el) => { sectionsRef.current.detail = el }} className={s.section}>
          <h2>상세정보</h2>
          <div className={s.sectionContent}>
            <p>상품의 자세한 정보가 여기에 표시됩니다.</p>
            {/* 상품 이미지 갤러리, 상세 설명 등 */}
          </div>
        </section>

        {/* 구매안내 섹션 */}
        <section ref={(el) => { sectionsRef.current.guide = el }} className={s.section}>
          <h2>구매안내</h2>
          <div className={s.guideAccordion}>
            {PURCHASE_GUIDE_SECTIONS.map((item) => {
              const isOpen = openGuideId === item.id
              return (
                <article key={item.id} className={`${s.guideItem} ${isOpen ? s.open : ''}`}>
                  <button
                    className={s.guideHeader}
                    onClick={() => setOpenGuideId(isOpen ? null : item.id)}
                  >
                    <span>{item.title}</span>
                    <i className={`ri-arrow-up-s-line ${s.guideArrow}`}></i>
                  </button>
                  <div className={s.guideBody}>
                    {item.description.map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* 구매후기 섹션 */}
        <section ref={(el) => { sectionsRef.current.review = el }} className={s.reviewSection}>
          {/* 리뷰 상단 헤더 */}
          <div className={s.reviewHeader}>
            <h2 className={s.reviewTitle}>리뷰</h2>
            <p className={s.reviewSubtitle}>고객님의 소중한 후기를 남겨주세요.</p>
          </div>

          {/* 리뷰 요약 섹션 */}
          <div className={s.reviewSummary}>
            <div className={s.reviewSummaryLeft}>
              <div className={s.satisfactionBox}>
                <h3 className={s.satisfactionTitle}>상품만족도</h3>
                <div className={s.ratingDisplay}>
                  <span className={s.ratingStars}>★</span>
                  <span className={s.ratingValue}>{REVIEW_DATA.averageRating}</span>
                  <span className={s.ratingMax}>/5</span>
                </div>
                <p className={s.reviewCount}>{REVIEW_DATA.totalReviews} 개의 리뷰가 있습니다.</p>
                <button className={s.writeReviewButton}>리뷰 작성하기</button>
              </div>
            </div>
            <div className={s.reviewSummaryRight}>
              <div className={s.ratingDistribution}>
                {REVIEW_DATA.ratingDistribution.map((item) => (
                  <div key={item.stars} className={s.ratingBarItem}>
                    <span className={s.ratingBarLabel}>{item.stars}점</span>
                    <div className={s.ratingBarContainer}>
                      <div 
                        className={`${s.ratingBar} ${item.percentage > 0 ? s.ratingBarActive : ''}`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className={s.ratingBarPercentage}>{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 포토 리뷰 섹션 */}
          <div className={s.photoReviewsSection}>
            <div className={s.photoReviewsScroll}>
              {REVIEW_DATA.photoReviews.map((review) => (
                <div key={review.id} className={s.photoReviewCard}>
                  <div className={s.photoReviewImage}>
                    <img src={review.image} alt="리뷰 이미지" />
                  </div>
                  <div className={s.photoReviewStars}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <RiStarFill key={i} className={s.starIcon} />
                    ))}
                  </div>
                  <p className={s.photoReviewText}>{review.text}</p>
                  <span className={s.photoReviewUserId}>{review.userId}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 리뷰 목록 헤더 */}
          <div className={s.reviewListHeader}>
            <h3 className={s.reviewListTitle}>리뷰 {REVIEW_DATA.totalReviews}</h3>
            <div className={s.reviewListFilters}>
              <button className={s.filterButton}>포토/동영상 리뷰 모아보기</button>
              <div className={s.sortDropdownContainer} ref={sortDropdownRef}>
                <button 
                  className={s.sortDropdownButton}
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                >
                  {sortOption === 'recommended' && '추천순'}
                  {sortOption === 'latest' && '최신순'}
                  {sortOption === 'rating' && '별점 높은 순'}
                  <RiArrowDownSLine className={`${s.dropdownIcon} ${isSortDropdownOpen ? s.rotated : ''}`} />
                </button>
                {isSortDropdownOpen && (
                  <div className={s.sortDropdownMenu}>
                    <button 
                      className={`${s.sortDropdownItem} ${sortOption === 'recommended' ? s.active : ''}`}
                      onClick={() => {
                        setSortOption('recommended')
                        setIsSortDropdownOpen(false)
                      }}
                    >
                      추천순
                    </button>
                    <button 
                      className={`${s.sortDropdownItem} ${sortOption === 'latest' ? s.active : ''}`}
                      onClick={() => {
                        setSortOption('latest')
                        setIsSortDropdownOpen(false)
                      }}
                    >
                      최신순
                    </button>
                    <button 
                      className={`${s.sortDropdownItem} ${sortOption === 'rating' ? s.active : ''}`}
                      onClick={() => {
                        setSortOption('rating')
                        setIsSortDropdownOpen(false)
                      }}
                    >
                      별점 높은 순
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={s.reviewListFilterDropdown}>
            <button className={s.dropdownButton}>
              별점 <RiArrowDownSLine />
            </button>
          </div>

          {/* 리뷰 목록 */}
          <div className={s.reviewList}>
            {REVIEW_DATA.reviews.map((review) => (
              <div key={review.id} className={s.reviewCard}>
                <div className={s.reviewCardHeader}>
                  <div className={s.reviewStars}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <RiStarFill key={i} className={s.starIcon} />
                    ))}
                  </div>
                  <span className={s.reviewUserId}>{review.userId}</span>
                </div>
                <p className={s.reviewText}>{review.text}</p>
                {review.images && review.images.length > 0 && (
                  <div className={s.reviewImages}>
                    {review.images.map((img, idx) => (
                      <img key={idx} src={img} alt={`리뷰 이미지 ${idx + 1}`} />
                    ))}
                  </div>
                )}
                <div className={s.reviewActions}>
                  <button className={s.reviewActionLink}>접기 ^</button>
                  <button className={s.reviewActionLink}>0 신고·차단</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 상품문의 섹션 */}
        <section ref={(el) => { sectionsRef.current.inquiry = el }} className={s.section}>
          <h2>상품문의</h2>
          <div className={s.sectionContent}>
            <p>상품에 대한 문의사항을 남길 수 있습니다.</p>
          </div>
        </section>
      </div>

      {/* Footer Bar */}
      {showFooter && (
        <div className={s.footerBar}>
          <div className={s.footerContent}>
            <div className={s.footerLeft}>
              <span className={s.totalLabel}>TOTAL</span>
              <span className={s.totalCount}>32,900원 (1개)</span>
            </div>
            <div className={s.footerCenter}>
              <button className={s.cartButton}>장바구니</button>
            </div>
            <div className={s.footerRight}>
              <button className={s.buyButton}>구매하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail
