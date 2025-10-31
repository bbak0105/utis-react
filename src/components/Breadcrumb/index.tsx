import { NavLink } from 'react-router-dom'
import s from './Breadcrumb.module.scss'

interface BreadcrumbItem {
  label: string
  path?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className={s.breadcrumb}>
      {items.map((item, index) => (
        <div key={index} className={s.breadcrumbItem}>
          {item.path ? (
            <NavLink to={item.path} className={s.breadcrumbLink}>
              {item.label}
            </NavLink>
          ) : (
            <span className={s.breadcrumbCurrent}>{item.label}</span>
          )}
          {index < items.length - 1 && (
            <span className={s.breadcrumbSeparator}>/</span>
          )}
        </div>
      ))}
    </nav>
  )
}

export default Breadcrumb
