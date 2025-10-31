import { useState } from 'react'
import Breadcrumb from '@/components/Breadcrumb'
import ItemCount from '@/components/ItemCount'
import FilterDropdown from '@/components/FilterDropdown'
import ProductList from '@/components/ProductList'
import { ProductProps } from '@/components/Product'
import useScrollAnimation from '@/utils/hooks/useScrollAnimation'
import s from './Travel.module.scss'

const SHOWER_PRODUCTS: ProductProps[] = [
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
  }
]

const FILTER_OPTIONS = [
  { value: 'new', label: '신상품' },
  { value: 'name', label: '상품명' },
  { value: 'price-low', label: '낮은가격' },
  { value: 'price-high', label: '높은가격' },
  { value: 'manufacturer', label: '제조사' },
  { value: 'reviews', label: '사용후기' }
]

const BREADCRUMB_ITEMS = [
  { label: '홈', path: '/' },
  { label: '여행용품' }
]

const Travel = () => {
  const [selectedFilter, setSelectedFilter] = useState('new')
  const titleRef = useScrollAnimation<HTMLHeadingElement>({ threshold: 0.2 })

  return (
    <div className={s.container}>
      {/* Page Header */}
      <div className={s.pageHeader}>
        <h1 
          ref={titleRef.ref}
          className={`${s.pageTitle} ${titleRef.isVisible ? s.animateIn : s.animateOut}`}
        >
          여행용품
        </h1>
      </div>
      
      {/* Breadcrumb */}
      <div className={s.breadcrumbContainer}>
        <Breadcrumb items={BREADCRUMB_ITEMS} />
      </div>
      
      {/* Filter Section */}
      <div className={s.filterSection}>
        <div className={s.filterLeft}>
          <ItemCount count={SHOWER_PRODUCTS.length} />
        </div>
        <div className={s.filterRight}>
          <FilterDropdown 
            options={FILTER_OPTIONS}
            selectedValue={selectedFilter}
            onSelect={setSelectedFilter}
          />
        </div>
      </div>
      
      {/* Product List */}
      <ProductList products={SHOWER_PRODUCTS} />
    </div>
  )
}

export default Travel
