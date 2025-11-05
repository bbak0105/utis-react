import { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import useBreakpoint from '@/utils/hooks/useBreakpoint'
import Drawer from '@/components/Drawer'
import MobileNavigation from '@/components/MobileNavigation'
import DesktopNavigation from '@/components/DesktopNavigation'
import s from './AppLayout.module.scss'
import '@/styles/global.scss'
import logoImage from '@/assets/images/logo.png'

const AppLayout = () => {
  const { width } = useBreakpoint()
  const isMobile = width < 1024
  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [cartCount, setCartCount] = useState(3) // 장바구니 카운터 상태 (테스트용)
  const [isHeaderHidden, setIsHeaderHidden] = useState(false)
  const location = useLocation()
  
  // ProductDetail 페이지에서 스크롤에 따라 헤더 숨기기
  const isProductDetail = location.pathname.startsWith('/product/')
  
  // Flights 페이지 감지
  const isFlightsPage = location.pathname === '/flights'
  
  // 라우트 변경 시 스크롤을 최상단으로 초기화
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])
  
  useEffect(() => {
    if (!isProductDetail) return
    
    const handleScroll = () => {
      const scrollTop = window.pageYOffset
      
      // 네비게이션 바를 찾아서 그 위치까지 스크롤했을 때 헤더 숨김
      const navBar = document.querySelector('[data-nav-bar]')
      if (navBar) {
        const navRect = navBar.getBoundingClientRect()
        const navTop = navRect.top + scrollTop
        // 네비게이션 바가 상단에 가까워질 때 헤더 숨김
        setIsHeaderHidden(scrollTop > navTop - 100)
      } else {
        // 네비게이션 바를 찾을 수 없으면 기본값 사용
        setIsHeaderHidden(scrollTop > 500)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isProductDetail])

  return (
    <div>
      {!isProductDetail || !isHeaderHidden ? (
        <header className={s.header}>
        {!isMobile ? (
          <>
            {/* ===== 데스크탑 상단(로고/검색바/액션) ===== */}
            <div className={`${s.top} ${s.container}`}>
              <NavLink to="/" className={s.logo}>
                <img src={logoImage} alt="UTIS" className={s.logoImage} />
              </NavLink>
              <div className={s.searchBar}>
                <input 
                  type="text" 
                  placeholder="어디로 여행 가시나요?" 
                  className={s.searchInput}
                />
                <button aria-label="검색" className={s.searchButton}>
                  <i className="ri-search-line"></i>
                </button>
              </div>
              <div className={s.authLinks}>
                <NavLink to="/login" className={s.authLink}>로그인</NavLink>
                <NavLink to="/signup" className={s.authLink}>회원가입</NavLink>
                <NavLink to="/reservation" className={s.authLink}>예약조회</NavLink>
              </div>
            </div>

            {/* ===== 데스크탑 네비(로고 아래) ===== */}
            <div className={`${s.navRow} ${dropdownOpen ? s.navRowExpanded : ''}`}>
              <div className={`${s.nav} ${s.container}`}>
                <DesktopNavigation />
              </div>
              
              {/* 확장된 메뉴 영역 */}
              {/* {dropdownOpen && (
                <>
                  <div className={s.expandedOverlay} onClick={() => setDropdownOpen(false)} />
                  <div className={s.expandedMenu}>
                    <div className={s.expandedContent}>
                      <div className={s.menuColumn}>
                        <NavLink to="/shower" className={s.expandedLink}>샤워기</NavLink>
                        <NavLink to="/adapter" className={s.expandedLink}>어댑터</NavLink>
                        <NavLink to="/travel" className={s.expandedLink}>
                          여행 용품
                          <span className={s.notificationDot}></span>
                        </NavLink>
                        <NavLink to="/carrier" className={s.expandedLink}>캐리어</NavLink>
                        <NavLink to="/carrier/japan" className={s.expandedLink}>일본</NavLink>
                        <NavLink to="/accommodation" className={s.expandedLink}>숙소</NavLink>
                        <NavLink to="/flights" className={s.expandedLink}>항공권</NavLink>
                      </div>
                      <div className={s.menuColumn}>
                        <h3 className={s.columnTitle}>커뮤니티</h3>
                        <NavLink to="/notice" className={s.expandedLink}>공지사항</NavLink>
                        <NavLink to="/event" className={s.expandedLink}>이벤트</NavLink>
                        <NavLink to="/inquiry" className={s.expandedLink}>문의하기</NavLink>
                        <NavLink to="/review" className={s.expandedLink}>상품리뷰</NavLink>
                      </div>
                    </div>
                  </div>
                </>
              )} */}
            </div>
          </>
        ) : (
          // ===== 모바일 헤더 (기존 유지) =====
          <div className={s.mobileHeader}>
            <button
              aria-label="메뉴 열기"
              onClick={() => setOpen(true)}
              className={s.mobileMenuButton}
            >
              <i className="ri-menu-line"></i>
            </button>
            <NavLink to="/" className={s.mobileLogo}>
              <img src={logoImage} alt="UTIS" className={s.logoImage} />
            </NavLink>
            <div className={s.mobileActions}>
              <button aria-label="장바구니" className={s.iconButton}>
                <i className="ri-shopping-cart-line"></i>
                {cartCount > 0 && (
                  <span className={s.cartBadge}>{cartCount}</span>
                )}
              </button>
              <button aria-label="검색" className={s.iconButton}>
                <i className="ri-search-line"></i>
              </button>
            </div>
          </div>
        )}
        </header>
      ) : null}

      {/* 모바일 드로어 */}
      <Drawer open={open} onClose={() => setOpen(false)} side="left" width={360}>
        <div className={s.drawerContent}>
          <div className={s.drawerHeader}>
            <strong>메뉴</strong>
            <button onClick={() => setOpen(false)} aria-label="닫기" className={s.iconButton}>
              <i className="ri-close-line"></i>
            </button>
          </div>

          {/* 간단한 유저 카드/버튼 영역 */}
          <div className={s.userActions}>
            <button className={s.userButton}>로그아웃</button>
            <button className={s.userButton}>마이페이지</button>
          </div>

          {/* 네비 목록 */}
          <MobileNavigation onItemClick={() => setOpen(false)} />
        </div>
      </Drawer>

      <main className={s.main}>
        <Outlet />
      </main>
      
      {/* 푸터 */}
      <footer className={`${s.footer} ${isFlightsPage ? s.footerDark : ''}`}>
        <div className={s.footerContainer}>
          <div className={s.footerContent}>
            {/* 회사 정보 */}
            <div className={s.companyInfo}>
              <h3 className={s.companyName}>유티스</h3>
              <div className={s.companyDetails}>
                <p>상호: 주식회사 유티스</p>
                <p>대표: 김형민</p>
                <p>대표전화: 07041380595</p>
                <p>주소: 07788 서울 강서구 마곡서로 152 두산더랜드타워 a동 320-라06호</p>
                <p>사업자등록번호: 3908703764</p>
                <p>통신판매업 신고번호: 제2024-서울강서-1234호</p>
                <p>개인정보 보호책임자: 김형민</p>
                <p>E-mail: info@utis.co.kr</p>
              </div>
            </div>
            
            {/* 고객센터 */}
            <div className={s.customerCenter}>
              <h3 className={s.sectionTitle}>고객센터</h3>
              <p className={s.phoneNumber}>07041380595</p>
            </div>
            
            {/* 서비스 정보 */}
            <div className={s.serviceInfo}>
              <h3 className={s.sectionTitle}>서비스 정보</h3>
              <ul className={s.serviceLinks}>
                <li><a href="/about">회사소개</a></li>
                <li><a href="/terms">이용약관</a></li>
                <li><a href="/privacy">개인정보처리방침</a></li>
                <li><a href="/guide">이용안내</a></li>
              </ul>
            </div>
          </div>
          
          {/* 하단 정보 */}
          <div className={s.footerBottom}>
            <div className={s.copyright}>
              <p>Copyright ⓒ 유티스 All rights reserved. Designed by dfloor</p>
            </div>
            <div className={s.partners}>
              <button className={s.partnerButton}>CAFE24</button>
              <button className={s.partnerButton}>KG 에스크로 가입사실 확인</button>
            </div>
          </div>
        </div>
      </footer>
      
      {/* 스크롤 탑 버튼 */}
      <button 
        className={s.scrollButton}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="맨 위로"
      >
        <i className="ri-arrow-up-line"></i>
      </button>
    </div>
  )
}

export default AppLayout