import s from './ItemCount.module.scss'

interface ItemCountProps {
  count: number
}

const ItemCount = ({ count }: ItemCountProps) => {
  return (
    <div className={s.itemCount}>
      <span className={s.count}>{count}</span>
      <span className={s.label}>items</span>
    </div>
  )
}

export default ItemCount
