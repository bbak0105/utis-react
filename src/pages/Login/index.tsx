import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { RiArrowLeftSLine, RiHomeLine, RiKakaoTalkFill, RiSmartphoneLine } from 'react-icons/ri'
import s from './Login.module.scss'

const Login = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'member' | 'guest'>('member')
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [secureConnection, setSecureConnection] = useState(true)

  const handleLogin = () => {
    // 로그인 로직 구현
    console.log('Login:', { id, password, secureConnection })
  }

  return (
    <div className={s.loginPage}>
      {/* 헤더 */}
      <header className={s.header}>
        <button 
          className={s.backButton}
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <RiArrowLeftSLine />
        </button>
        <h1 className={s.pageTitle}>로그인</h1>
        <Link to="/" className={s.homeButton} aria-label="홈으로">
          <RiHomeLine />
        </Link>
      </header>

      {/* 프로모션 배너 */}
      <div className={s.promoBanner}>
        <div className={s.promoContent}>
          <div className={s.promoText}>
            <span>카카오 1초 가입하고</span>
            <span className={s.pointBadge}>P</span>
            <span>적립금 받으세요</span>
          </div>
          <div className={s.promoIllustration}>
            <div className={s.envelope}>
              <div className={s.couponCard}>
                <span>WELCOME COUPON</span>
                <span className={s.downloadIcon}>↓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 */}
      <div className={s.tabs}>
        <button
          className={`${s.tab} ${activeTab === 'member' ? s.active : ''}`}
          onClick={() => setActiveTab('member')}
        >
          기존 회원
        </button>
        <button
          className={`${s.tab} ${activeTab === 'guest' ? s.active : ''}`}
          onClick={() => setActiveTab('guest')}
        >
          비회원 주문조회
        </button>
      </div>

      {/* 로그인 폼 */}
      {activeTab === 'member' && (
        <div className={s.loginForm}>
          <div className={s.inputGroup}>
            <input
              type="text"
              id="id"
              className={s.input}
              placeholder="아이디"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>
          <div className={s.inputGroup}>
            <input
              type="password"
              id="password"
              className={s.input}
              placeholder="패스워드"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* 보안접속 토글 */}
          <div className={s.secureToggle}>
            <label className={s.toggleLabel}>
              <input
                type="checkbox"
                className={s.toggleInput}
                checked={secureConnection}
                onChange={(e) => setSecureConnection(e.target.checked)}
              />
              <span className={s.toggleSlider}></span>
            </label>
            <span className={s.toggleText}>보안접속</span>
          </div>

          {/* 로그인 버튼 */}
          <button 
            className={s.loginButton}
            onClick={handleLogin}
            disabled={!id || !password}
          >
            로그인
          </button>

          {/* 소셜 로그인 */}
          <div className={s.socialLogin}>
            <button className={s.kakaoButton}>
              <RiKakaoTalkFill className={s.kakaoIcon} />
              카카오로 로그인하기
            </button>
            <button className={s.phoneButton}>
              <RiSmartphoneLine className={s.phoneIcon} />
              휴대폰으로 로그인하기
            </button>
          </div>

          {/* 유틸리티 링크 */}
          <div className={s.utilityLinks}>
            <Link to="/find-id" className={s.link}>아이디찾기</Link>
            <span className={s.divider}>|</span>
            <Link to="/find-password" className={s.link}>비밀번호찾기</Link>
            <span className={s.divider}>|</span>
            <Link to="/signup" className={s.link}>회원가입</Link>
          </div>
        </div>
      )}

      {/* 비회원 주문조회 폼 */}
      {activeTab === 'guest' && (
        <div className={s.loginForm}>
          <div className={s.inputGroup}>
            <input
              type="text"
              className={s.input}
              placeholder="주문번호"
            />
          </div>
          <div className={s.inputGroup}>
            <input
              type="text"
              className={s.input}
              placeholder="주문자명"
            />
          </div>
          <button className={s.loginButton}>
            주문조회
          </button>
        </div>
      )}

      {/* 하단 안내 */}
      <div className={s.footerMessage}>
        <p className={s.footerTitle}>아직도 회원이 아니세요?</p>
        <p className={s.footerText}>
          지금 유티스의 회원이 되어 다양한 서비스를 이용해 보세요.
        </p>
      </div>
    </div>
  )
}

export default Login
