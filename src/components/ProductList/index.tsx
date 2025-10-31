import Product, { ProductProps } from '../Product'
import s from './ProductList.module.scss'

interface ProductListProps {
  title?: string
  subtitle?: string
  products: ProductProps[]
}

const ProductList = ({ title, subtitle, products }: ProductListProps) => {
  return (
    <section className={s.productList}>
      <div className={s.container}>
        <div className={s.header}>
          <h2 className={s.title}>{title}</h2>
          <p className={s.subtitle}>{subtitle}</p>
        </div>
        
        <ul className={s.productGrid}>
          {products.map((product) => (
            <Product key={product.id} {...product} />
          ))}
        </ul>
      </div>
    </section>
  )
}

export default ProductList
