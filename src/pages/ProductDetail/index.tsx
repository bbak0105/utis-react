import { useState, useEffect, useRef } from 'react'
import Breadcrumb from '@/components/Breadcrumb'
import ProductOptions, { ProductOption } from '@/components/ProductOptions'
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
  
  const navRef = useRef<HTMLDivElement>(null)
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
        <section ref={(el) => { sectionsRef.current.review = el }} className={s.section}>
          <h2>구매후기</h2>
          <div className={s.sectionContent}>
            <p>고객들의 구매 후기가 여기에 표시됩니다.</p>
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
