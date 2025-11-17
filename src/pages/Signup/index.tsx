import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { RiArrowRightSLine, RiArrowDownSLine } from 'react-icons/ri'
import Breadcrumb from '@/components/Breadcrumb'
import s from './Signup.module.scss'
import Lottie from 'lottie-react'
import completeAnimation from '../../assets/lottie/Success.json'
const STEPS = [
  { id: 1, label: '약관동의' },
  { id: 2, label: '정보입력' },
  { id: 3, label: '가입완료' }
]

const BREADCRUMB_ITEMS = [
  { label: '홈', path: '/' },
  { label: '회원가입' }
]

// 약관동의 단계
const TermsAgreement = ({ onNext }: { onNext: () => void }) => {
  const [allAgreed, setAllAgreed] = useState(false)
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [shoppingAgreed, setShoppingAgreed] = useState(false)
  const [smsAgreed, setSmsAgreed] = useState(false)
  const [emailAgreed, setEmailAgreed] = useState(false)
  const [expandedTerms, setExpandedTerms] = useState(false)
  const [expandedShopping, setExpandedShopping] = useState(false)

  const handleAllAgreed = (checked: boolean) => {
    setAllAgreed(checked)
    setTermsAgreed(checked)
    setShoppingAgreed(checked)
    setSmsAgreed(checked)
    setEmailAgreed(checked)
  }

  const handleTermsChange = (checked: boolean) => {
    setTermsAgreed(checked)
    // 다른 체크박스 상태를 확인하여 전체 동의 업데이트
    setAllAgreed((prev) => {
      if (checked) {
        return shoppingAgreed && smsAgreed && emailAgreed
      }
      return false
    })
  }

  const handleShoppingChange = (checked: boolean) => {
    setShoppingAgreed(checked)
    setAllAgreed((prev) => {
      if (checked) {
        return termsAgreed && smsAgreed && emailAgreed
      }
      return false
    })
  }

  const handleSmsChange = (checked: boolean) => {
    setSmsAgreed(checked)
    setAllAgreed((prev) => {
      if (checked) {
        return termsAgreed && shoppingAgreed && emailAgreed
      }
      return false
    })
  }

  const handleEmailChange = (checked: boolean) => {
    setEmailAgreed(checked)
    setAllAgreed((prev) => {
      if (checked) {
        return termsAgreed && shoppingAgreed && smsAgreed
      }
      return false
    })
  }

  // useEffect로 전체 동의 상태 동기화
  useEffect(() => {
    const allChecked = termsAgreed && shoppingAgreed && smsAgreed && emailAgreed
    setAllAgreed(allChecked)
  }, [termsAgreed, shoppingAgreed, smsAgreed, emailAgreed])

  const canProceed = termsAgreed // 필수 항목만 체크

  return (
    <div className={s.termsSection}>
      <h2 className={s.sectionTitle}>전체 동의</h2>
      
      {/* 전체 동의 */}
      <div className={s.consentItem}>
        <label className={s.consentLabel}>
          <input
            type="checkbox"
            className={s.checkbox}
            checked={allAgreed}
            onChange={(e) => handleAllAgreed(e.target.checked)}
          />
          <span className={s.consentText}>모든 약관을 확인하고 전체 동의합니다.</span>
        </label>
        <p className={s.consentNote}>
          (전체 동의는 필수 및 선택 정보에 대한 동의가 포함되어 있습니다.)
        </p>
      </div>

      {/* 개별 동의 항목 */}
      <div className={s.consentList}>
        {/* 이용약관 동의 (필수) */}
        <div className={s.consentItem}>
          <label className={s.consentLabel}>
            <input
              type="checkbox"
              className={s.checkbox}
              checked={termsAgreed}
              onChange={(e) => handleTermsChange(e.target.checked)}
            />
            <span className={s.consentText}>
              이용약관 동의 <span className={s.required}>(필수)</span>
            </span>
            <button
              className={s.expandButton}
              onClick={() => setExpandedTerms(!expandedTerms)}
              type="button"
            >
              <RiArrowDownSLine className={expandedTerms ? s.expanded : ''} />
            </button>
          </label>
          {expandedTerms && (
            <div className={s.termsContent}>
              <p>이용약관 내용이 여기에 표시됩니다...</p>
            </div>
          )}
        </div>

        {/* 쇼핑정보 수신 동의 (선택) */}
        <div className={s.consentItem}>
          <label className={s.consentLabel}>
            <input
              type="checkbox"
              className={s.checkbox}
              checked={shoppingAgreed}
              onChange={(e) => handleShoppingChange(e.target.checked)}
            />
            <span className={s.consentText}>
              쇼핑정보 수신 동의 <span className={s.optional}>(선택)</span>
            </span>
            <button
              className={s.expandButton}
              onClick={() => setExpandedShopping(!expandedShopping)}
              type="button"
            >
              <RiArrowDownSLine className={expandedShopping ? s.expanded : ''} />
            </button>
          </label>
          {expandedShopping && (
            <div className={s.termsContent}>
              <p>쇼핑정보 수신 동의 내용이 여기에 표시됩니다...</p>
            </div>
          )}
        </div>

        {/* SMS 수신 동의 (선택) */}
        <div className={s.consentRow}>
          <label className={s.consentLabel}>
            <input
              type="checkbox"
              className={s.checkbox}
              checked={smsAgreed}
              onChange={(e) => handleSmsChange(e.target.checked)}
            />
            <span className={s.consentText}>
              SMS 수신 동의 <span className={s.optional}>(선택)</span>
            </span>
          </label>
        </div>

        {/* 이메일 수신 동의 (선택) */}
        <div className={s.consentRow}>
          <label className={s.consentLabel}>
            <input
              type="checkbox"
              className={s.checkbox}
              checked={emailAgreed}
              onChange={(e) => handleEmailChange(e.target.checked)}
            />
            <span className={s.consentText}>
              이메일 수신 동의 <span className={s.optional}>(선택)</span>
            </span>
          </label>
        </div>
      </div>

      {/* 버튼 */}
      <div className={s.actionButtons}>
        <button className={s.cancelButton} onClick={() => window.history.back()}>
          취소
        </button>
        <button
          className={s.nextButton}
          onClick={onNext}
          disabled={!canProceed}
        >
          다음
        </button>
      </div>
    </div>
  )
}

// 정보입력 단계
const InformationInput = ({ onNext }: { onNext: () => void }) => {
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    passwordConfirm: '',
    name: '',
    email: '',
    phone: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    // 입력 시 에러 메시지 제거
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // 아이디 검증
    if (!formData.id.trim()) {
      newErrors.id = '아이디를 입력해주세요.'
    }

    // 비밀번호 검증
    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요.'
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.'
    }

    // 비밀번호 확인 검증
    if (!formData.passwordConfirm.trim()) {
      newErrors.passwordConfirm = '비밀번호 확인을 입력해주세요.'
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.'
    }

    // 이름 검증
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.'
    }

    // 휴대폰 번호 검증
    if (!formData.phone.trim()) {
      newErrors.phone = '휴대폰 번호를 입력해주세요.'
    } else if (!/^[0-9-]+$/.test(formData.phone)) {
      newErrors.phone = '올바른 휴대폰 번호를 입력해주세요.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      // 유효성 검사 통과 시 제출
      console.log('Form submitted:', formData)
      onNext()
    }
  }

  // 필수 항목이 모두 입력되었는지 확인
  const isFormValid = 
    formData.id.trim() !== '' &&
    formData.password.trim() !== '' &&
    formData.passwordConfirm.trim() !== '' &&
    formData.name.trim() !== '' &&
    formData.phone.trim() !== '' &&
    formData.password === formData.passwordConfirm &&
    formData.password.length >= 8

  return (
    <div className={s.infoSection}>
      <h2 className={s.sectionTitle}>회원 정보 입력</h2>
      
      <div className={s.formGroup}>
        <label className={s.label}>
          아이디 <span className={s.required}>(필수)</span>
        </label>
        <input
          type="text"
          name="id"
          className={`${s.input} ${errors.id ? s.inputError : ''}`}
          value={formData.id}
          onChange={handleChange}
          placeholder="아이디를 입력하세요"
        />
        {errors.id && <span className={s.errorMessage}>{errors.id}</span>}
      </div>

      <div className={s.formGroup}>
        <label className={s.label}>
          비밀번호 <span className={s.required}>(필수)</span>
        </label>
        <input
          type="password"
          name="password"
          className={`${s.input} ${errors.password ? s.inputError : ''}`}
          value={formData.password}
          onChange={handleChange}
          placeholder="비밀번호를 입력하세요"
        />
        {formData.password.length > 0 && formData.password.length < 8 && !errors.password && (
          <span className={s.helpText}>8자 이상 입력해주세요.</span>
        )}
        {errors.password && <span className={s.errorMessage}>{errors.password}</span>}
      </div>

      <div className={s.formGroup}>
        <label className={s.label}>
          비밀번호 확인 <span className={s.required}>(필수)</span>
        </label>
        <input
          type="password"
          name="passwordConfirm"
          className={`${s.input} ${errors.passwordConfirm ? s.inputError : ''}`}
          value={formData.passwordConfirm}
          onChange={handleChange}
          placeholder="비밀번호를 다시 입력하세요"
        />
        {formData.passwordConfirm.length > 0 && 
         formData.password !== formData.passwordConfirm && 
         !errors.passwordConfirm && (
          <span className={s.helpText}>위에서 입력한 비밀번호와 동일하게 입력해주세요.</span>
        )}
        {errors.passwordConfirm && <span className={s.errorMessage}>{errors.passwordConfirm}</span>}
      </div>

      <div className={s.formGroup}>
        <label className={s.label}>
          이름 <span className={s.required}>(필수)</span>
        </label>
        <input
          type="text"
          name="name"
          className={`${s.input} ${errors.name ? s.inputError : ''}`}
          value={formData.name}
          onChange={handleChange}
          placeholder="이름을 입력하세요"
        />
        {errors.name && <span className={s.errorMessage}>{errors.name}</span>}
      </div>

      <div className={s.formGroup}>
        <label className={s.label}>
          이메일
        </label>
        <input
          type="email"
          name="email"
          className={s.input}
          value={formData.email}
          onChange={handleChange}
          placeholder="이메일을 입력하세요 (선택)"
        />
      </div>

      <div className={s.formGroup}>
        <label className={s.label}>
          휴대폰 번호 <span className={s.required}>(필수)</span>
        </label>
        <input
          type="tel"
          name="phone"
          className={`${s.input} ${errors.phone ? s.inputError : ''}`}
          value={formData.phone}
          onChange={handleChange}
          placeholder="휴대폰 번호를 입력하세요"
        />
        {formData.phone.length > 0 && 
         !/^[0-9-]+$/.test(formData.phone) && 
         !errors.phone && (
          <span className={s.helpText}>숫자와 하이픈(-)만 입력 가능합니다.</span>
        )}
        {errors.phone && <span className={s.errorMessage}>{errors.phone}</span>}
      </div>

      <div className={s.actionButtons}>
        <button className={s.cancelButton} onClick={() => window.history.back()}>
          취소
        </button>
        <button 
          className={s.nextButton} 
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          다음
        </button>
      </div>
    </div>
  )
}

// 가입완료 단계
const SignupComplete = () => {
  const navigate = useNavigate()
  
  return (
    <div className={s.completeSection}>
      {/* <div className={s.completeIcon}>✓</div> */}
      <Lottie className={s.lottieSmall} animationData={completeAnimation} loop={false} />
      <h2 className={s.completeTitle}>회원가입이 완료되었습니다!</h2>
      <p className={s.completeText}>
        유티스의 회원이 되신 것을 환영합니다.
        <br />
        다양한 서비스를 이용해 보세요.
      </p>
      <div className={s.completeButtons}>
        <button className={s.homeButton} onClick={() => navigate('/')}>
          홈으로
        </button>
        <button className={s.loginButton} onClick={() => navigate('/login')}>
          로그인
        </button>
      </div>
    </div>
  )
}

const Signup = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentStep = parseInt(searchParams.get('step') || '1', 10)

  const handleNext = () => {
    if (currentStep < 3) {
      setSearchParams({ step: String(currentStep + 1) })
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <TermsAgreement onNext={handleNext} />
      case 2:
        return <InformationInput onNext={handleNext} />
      case 3:
        return <SignupComplete />
      default:
        return <TermsAgreement onNext={handleNext} />
    }
  }

  return (
    <div className={s.signupPage}>
      {/* Breadcrumb */}
      <div className={s.breadcrumbContainer}>
        <Breadcrumb items={BREADCRUMB_ITEMS} />
      </div>

      {/* Page Title */}
      <h1 className={s.pageTitle}>회원가입</h1>

      {/* Progress Indicator */}
      <div className={s.progressIndicator}>
        {STEPS.map((step, index) => (
          <div key={step.id} className={s.progressStep}>
            <div
              className={`${s.stepCircle} ${
                currentStep >= step.id ? s.active : ''
              }`}
            >
              {step.id}
            </div>
            <span
              className={`${s.stepLabel} ${
                currentStep >= step.id ? s.active : ''
              }`}
            >
              {step.label}
            </span>
            {index < STEPS.length - 1 && (
              <RiArrowRightSLine className={s.stepArrow} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className={s.stepContent}>{renderStep()}</div>
    </div>
  )
}

export default Signup

