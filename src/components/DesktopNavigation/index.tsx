import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import s from './DesktopNavigation.module.scss'

interface NavItem {
  id: string
  label: string
  path: string
  hasNotification?: boolean
  children?: NavItem[]
}

interface DesktopNavigationProps {
  onItemClick?: () => void
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? `${s.link} ${s.linkActive}` : s.link

const DesktopNavigation = ({ onItemClick }: DesktopNavigationProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const navItems: NavItem[] = [
    { id: 'shower', label: '샤워기', path: '/shower' },
    { id: 'adapter', label: '어댑터', path: '/adapter' },
    { 
      id: 'travel', 
      label: '여행 용품', 
      path: '/travel',
      hasNotification: true 
    },
    { 
      id: 'carrier', 
      label: '캐리어', 
      path: '/carrier',
      children: [
        { id: 'carrier-japan', label: '일본', path: '/carrier/japan' }
      ]
    },
    { id: 'flights', label: '항공권', path: '/flights' },
    { id: 'accommodation', label: '숙소', path: '/accommodation' },
    { 
      id: 'cs', 
      label: '고객센터', 
      path: '/cs',
      children: [
        { id: 'notice', label: '공지사항', path: '/cs/notice' },
        { id: 'event', label: '이벤트', path: '/cs/event' },
        { id: 'inquiry', label: '문의하기', path: '/cs/inquiry' },
        { id: 'review', label: '상품리뷰', path: '/cs/review' }
      ]
    }
  ]

  const handleMouseEnter = (itemId: string) => {
    setHoveredItem(itemId)
  }

  const handleMouseLeave = () => {
    setHoveredItem(null)
  }

  const renderNavItem = (item: NavItem) => {
    if (item.children) {
      const isHovered = hoveredItem === item.id
      
      return (
        <div 
          key={item.id}
          className={s.csContainer}
          onMouseEnter={() => handleMouseEnter(item.id)}
          onMouseLeave={handleMouseLeave}
        >
          <NavLink to={item.path} className={linkClass}>
            {item.label}
            {item.hasNotification && <span className={s.notificationDot}></span>}
          </NavLink>
          {isHovered && (
            <div className={s.csDropdown}>
              {item.children.map(child => (
                <NavLink 
                  key={child.id} 
                  to={child.path} 
                  className={s.csDropdownLink} 
                  onClick={onItemClick}
                >
                  {child.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      )
    }

    return (
      <NavLink key={item.id} to={item.path} className={linkClass}>
        {item.label}
        {item.hasNotification && <span className={s.notificationDot}></span>}
      </NavLink>
    )
  }

  return (
    <div className={s.navLinks}>
      {navItems.map(renderNavItem)}
    </div>
  )
}

export default DesktopNavigation
