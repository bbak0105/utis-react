import MainBanner from '@/components/MainBanner'
import SliderCards, { Slider } from '@/components/SliderCards'
import ProductList from '@/components/ProductList'
import FeatureCards from '@/components/FeatureCards'
import { ProductProps } from '@/components/Product'
import useScrollAnimation from '@/utils/hooks/useScrollAnimation'
import useBreakpoint from '@/utils/hooks/useBreakpoint'
import { RiSearchLine, RiFocus3Line } from 'react-icons/ri'
import s from './Home.module.scss'

const BANNER_ITEMS = [
    {
        id: "1",
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&h=400&fit=crop',
    },
    {
        id: "2",
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=400&fit=crop',
        title: '더 특별한 여행을 경험하세요',
        buttonText: '자세히 보기'
    },
    {
        id: "3",
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=400&fit=crop',
    }
]

const SLIDER_ITEMS: Slider[] = [
    {
        id: "1",
        title: '무료 샤워기 받아가세요',
        subtitle: '신규 가입시 무료 샤워기 지급',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    },
    {
        id: "2",
        title: '타이머가 멈추기 전에!',
        subtitle: '늦으면 끝! 지금 바로 쇼핑하세요.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    }
]

const BEST_PRODUCTS: ProductProps[] = [
    {
        id: "1",
        name: "여행용 멀티 어댑터 45W 4구",
        description: "상품 요약 설명을 활용해보세요!",
        originalPrice: 50000,
        discountedPrice: 32900,
        discountRate: 34,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    },
    {
        id: "2", 
        name: "퓨어리 여행용 샤워 필터",
        description: "상품 요약 설명을 활용해보세요!",
        originalPrice: 23900,
        discountedPrice: 16500,
        discountRate: 31,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    },
    {
        id: "3",
        name: "여행용 캐리어 20인치",
        description: "상품 요약 설명을 활용해보세요!",
        originalPrice: 120000,
        discountedPrice: 89000,
        discountRate: 26,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    },
    {
        id: "4",
        name: "무선 충전기 여행용",
        description: "상품 요약 설명을 활용해보세요!",
        originalPrice: 45000,
        discountedPrice: 32000,
        discountRate: 29,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    }
]

const Home = () => {
    const { width } = useBreakpoint()
    const isSmallMobile = width <= 480
    const travelGoodsRef = useScrollAnimation<HTMLElement>({ threshold: 0.1 })
    const sliderRef = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 })
    const productListRef = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 })
    const featureCardsRef = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 })

    return (
        <div className={s.home}>
            {isSmallMobile ? (
                <>
                    {/* 모바일: 검색창 */}
                    <div className={s.mobileSearchSection}>
                        <div className={s.mobileSearchBar}>
                            <RiSearchLine className={s.searchIcon} />
                            <input 
                                type="text" 
                                placeholder="링톡 이심 30프로 할인중" 
                                className={s.mobileSearchInput}
                            />
                            {/* <RiFocus3Line className={s.targetIcon} /> */}
                        </div>
                    </div>

                    {/* 모바일: 정사각형 배너 */}
                    <div className={s.mobileBannerSection}>
                        <div className={s.mobileBannerImage}>
                            <img 
                                src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&h=1200&fit=crop" 
                                alt="프로모션 배너"
                            />
                        </div>
                    </div>
                </>
            ) : (
                /* 데스크탑: 메인 배너 */
                <div className={s.bannerSection}>
                    <MainBanner items={BANNER_ITEMS} />
                </div>
            )}

            {/* 기존 슬라이드 카드들 */}
            <div 
                ref={sliderRef.ref} 
                className={`${sliderRef.isVisible ? s.animateIn : s.animateOut}`}
                style={{ marginTop: '2rem' }}
            >
                <SliderCards items={SLIDER_ITEMS} />
            </div>

            {/* 상품 카테고리 섹션 */}
            {/* <section 
                ref={travelGoodsRef.ref} 
                className={`${s.travelGoods} ${travelGoodsRef.isVisible ? s.animateIn : s.animateOut}`}
            >
                <div className={s.travelGoodsContent}>
                    <div className={s.goodsGrid}>
                        <div className={s.travelGoodsItem}>
                            <div className={s.travelGoodsIcon}>🚿</div>
                            <span className={s.travelGoodsText}>샤워기</span>
                        </div>
                        <div className={s.travelGoodsItem}>
                            <div className={s.travelGoodsIcon}>🔌</div>
                            <span className={s.travelGoodsText}>어댑터</span>
                        </div>
                        <div className={s.travelGoodsItem}>
                            <div className={s.travelGoodsIcon}>🧳</div>
                            <span className={s.travelGoodsText}>캐리어</span>
                        </div>
                        <div className={s.travelGoodsItem}>
                            <div className={s.travelGoodsIcon}>🎒</div>
                            <span className={s.travelGoodsText}>여행용품</span>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* 베스트 상품 섹션 */}
            <div 
                ref={productListRef.ref} 
                className={`${productListRef.isVisible ? s.animateIn : s.animateOut}`}
                style={{ marginTop: '3rem' }}
            >
                <ProductList 
                    title="베스트 상품"
                    subtitle="이달의 인기상품을 확인해 보세요."
                    products={BEST_PRODUCTS}
                />
            </div>
            
            <div 
                ref={featureCardsRef.ref} 
                className={`${featureCardsRef.isVisible ? s.animateIn : s.animateOut}`}
                style={{ marginTop: '4rem' }}
            >
                <FeatureCards />
            </div>
        </div>
    )
}

export default Home;