import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import s from './Navigation.module.scss'

interface NavItem {
  id: string
  label: string
  path: string
  hasNotification?: boolean
  children?: NavItem[]
  icon?: string
}

interface NavigationProps {
  onItemClick?: () => void
  className?: string
}

const MobileNavigation = ({ onItemClick, className }: NavigationProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const navItems: NavItem[] = [
    { 
      id: 'travel', 
      label: '여행 용품', 
      path: '/travel',
      icon: 'ri-arrow-down-s-line',
      hasNotification: true,
      children: [
        { id: 'shower', label: '샤워기', path: '/shower' },
        { id: 'adapter', label: '어댑터', path: '/adapter' },
        { id: 'carrier', label: '캐리어', path: '/carrier' },
        { id: 'pillow', label: '목베개', path: '/pillow' },
        { id: 'esim', label: '이심', path: '/esim' },
      ]
    },
    { id: 'tour', label: '투어/티켓', path: '/tour' },
    { id: 'flights', label: '항공예약', path: '/flights' },
    // { id: 'accommodation', label: '숙소예약', path: '/accommodation' },
    { 
      id: 'cs', 
      label: '고객센터', 
      path: '/cs',
      icon: 'ri-arrow-down-s-line',
      children:[
        { id: 'notice', label: '공지사항', path: '/cs/notice' },
        { id: 'event', label: '이벤트', path: '/cs/event' },
        { id: 'inquiry', label: '문의하기', path: '/cs/inquiry' },
        { id: 'review', label: '상품리뷰', path: '/cs/review' }
      ]
    }
  ]

  const renderNavItem = (item: NavItem) => {
    if (item.children) {
      const isExpanded = expandedItems.has(item.id)
      
      return (
        <li key={item.id} className={s.navItem}>
          <div className={s.navItemWithChildren}>
            <NavLink 
              to={item.path} 
              onClick={onItemClick}
              className={s.navLink}
            >
              <span className={s.labelContainer}>
                {item.label}
                {item.hasNotification && <span className={s.notificationDot}></span>}
              </span>
            </NavLink>
            <button
              className={s.expandButton}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleExpanded(item.id)
              }}
              aria-label={isExpanded ? '메뉴 접기' : '메뉴 펼치기'}
            >
              <i className={`${item.icon} ${isExpanded ? s.expanded : ''}`}></i>
            </button>
          </div>
          {isExpanded && (
            <ul className={s.subNavList}>
              {item.children.map(child => (
                <li key={child.id} className={s.subNavItem}>
                  <NavLink to={child.path} onClick={onItemClick}>
                    {child.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </li>
      )
    }

    return (
      <li key={item.id} className={s.navItem}>
        <NavLink to={item.path} onClick={onItemClick}>
          {item.label}
          {item.hasNotification && <span className={s.notificationDot}></span>}
        </NavLink>
      </li>
    )
  }

  return (
    <ul className={`${s.navList} ${className || ''}`}>
      {navItems.map(renderNavItem)}
    </ul>
  )
}

export default MobileNavigation
