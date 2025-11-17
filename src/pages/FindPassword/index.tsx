import { useState } from 'react'
import { RiArrowDownSLine } from 'react-icons/ri'
import Breadcrumb from '@/components/Breadcrumb'
import s from './FindPassword.module.scss'

const BREADCRUMB_ITEMS = [
  { label: '홈', path: '/' },
  { label: '비밀번호 찾기' }
]

const FindPassword = () => {
  const [memberType, setMemberType] = useState<'personal' | 'business'>('personal')
  const [method, setMethod] = useState<'email' | 'phone'>('email')
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 실제 비밀번호 찾기 로직 연동
    console.log('findPassword', { memberType, method, id, name, email, phone })
    alert('임시 안내: 비밀번호 찾기 요청이 전송되었습니다.')
  }

  return (
    <div className={s.container}>
      <div className={s.breadcrumb}>
        <Breadcrumb items={BREADCRUMB_ITEMS} />
      </div>

      <h1 className={s.title}>비밀번호 찾기</h1>
      
      <form className={s.form} onSubmit={handleSubmit}>
        {/* 회원유형 */}
        <div className={s.formRow}>
          <label className={s.label}>회원유형</label>
          <div className={s.selectWrapper}>
            <select
              className={s.select}
              value={memberType}
              onChange={(e) => setMemberType(e.target.value as 'personal' | 'business')}
            >
              <option value="personal">개인회원</option>
              <option value="business">법인회원</option>
            </select>
            <RiArrowDownSLine className={s.selectIcon} />
          </div>
        </div>

        {/* 찾기 방법 */}
        <div className={s.formRow}>
          <div className={s.radioGroup}>
            <label className={s.radioLabel}>
              <input
                type="radio"
                name="method"
                checked={method === 'email'}
                onChange={() => setMethod('email')}
              />
              <span>이메일</span>
            </label>
            <label className={s.radioLabel}>
              <input
                type="radio"
                name="method"
                checked={method === 'phone'}
                onChange={() => setMethod('phone')}
              />
              <span>휴대폰번호</span>
            </label>
          </div>
        </div>

        {/* 아이디 */}
        <div className={s.formRow}>
          <label className={s.label}>아이디</label>
          <div className={s.inputBlock}>
            <input
              type="text"
              className={s.input}
              placeholder="아이디"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>
        </div>

        {/* 이름 */}
        <div className={s.formRow}>
          <label className={s.label}>이름</label>
          <div className={s.inputBlock}>
            <input
              type="text"
              className={s.input}
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        {/* 이메일 또는 휴대폰 */}
        <div className={s.formRow}>
          <label className={s.label}>{method === 'email' ? '이메일로 찾기' : '휴대폰번호로 찾기'}</label>
          <div className={s.inputBlock}>
            {method === 'email' ? (
              <input
                type="email"
                className={s.input}
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            ) : (
              <input
                type="tel"
                className={s.input}
                placeholder="휴대폰번호 (숫자와 하이픈만)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                pattern="[0-9-]+"
                required
              />
            )}
          </div>
        </div>

        <div className={s.actions}>
          <button type="submit" className={s.submitButton}>
            확인
          </button>
        </div>
      </form>
    </div>
  )
}

export default FindPassword

