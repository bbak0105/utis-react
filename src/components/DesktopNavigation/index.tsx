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
    { id: 'travel', label: '여행용품', path: '/travel', hasNotification: true },
    { id: 'tour', label: '투어/티켓', path: '/tour' },
    { id: 'flights', label: '항공예약', path: '/flights' },
    { id: 'accommodation', label: '숙소예약', path: '/accommodation' },
    { id: 'cs', label: '고객센터', path: '/cs' }
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
