'use client'

import React, { useState } from 'react'
import { RiUserLine, RiArrowDownSLine, RiAddLine, RiSubtractLine } from 'react-icons/ri'
import styles from './MobilePassengerSelector.module.scss'

interface MobilePassengerSelectorProps {
  label: string
  adultCount: number
  childCount: number
  infantCount: number
  selectedSeatClass: string
  onPassengerChange: (adults: number, children: number, infants: number, seatClass: string) => void
}

const MobilePassengerSelector: React.FC<MobilePassengerSelectorProps> = ({
  label,
  adultCount,
  childCount,
  infantCount,
  selectedSeatClass,
  onPassengerChange
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [localAdults, setLocalAdults] = useState(adultCount)
  const [localChildren, setLocalChildren] = useState(childCount)
  const [localInfants, setLocalInfants] = useState(infantCount)
  const [localSeatClass, setLocalSeatClass] = useState(selectedSeatClass)

  const seatClasses = [
    { value: '일반석', label: '일반석' },
    { value: '프리미엄 일반석', label: '프리미엄 일반석' },
    { value: '비즈니스석', label: '비즈니스석' },
    { value: '퍼스트클래스', label: '퍼스트클래스' }
  ]

  const getDisplayValue = (): string => {
    const total = localAdults + localChildren + localInfants
    if (total === localAdults) {
      return `성인 ${localAdults}, ${localSeatClass}`
    }
    return `승객 ${total}, ${localSeatClass}`
  }

  const handleApply = () => {
    onPassengerChange(localAdults, localChildren, localInfants, localSeatClass)
    setIsOpen(false)
  }

  const adjustCount = (type: 'adult' | 'child' | 'infant', delta: number) => {
    switch (type) {
      case 'adult':
        const newAdults = Math.max(1, localAdults + delta)
        setLocalAdults(newAdults)
        break
      case 'child':
        const newChildren = Math.max(0, localChildren + delta)
        setLocalChildren(newChildren)
        break
      case 'infant':
        const newInfants = Math.max(0, localInfants + delta)
        setLocalInfants(newInfants)
        break
    }
  }

  return (
    <div className={styles.inputGroup}>
      <label>{label}</label>
      <div className={styles.selectorContainer}>
        <button 
          className={styles.selectorButton}
          onClick={() => setIsOpen(!isOpen)}
        >
          <RiUserLine className={styles.icon} />
          <span className={styles.selectedValue}>{getDisplayValue()}</span>
          <RiArrowDownSLine className={`${styles.arrow} ${isOpen ? styles.open : ''}`} />
        </button>
        
        {isOpen && (
          <div className={styles.dropdown}>
            <div className={styles.passengerSection}>
              <h4 className={styles.sectionTitle}>승객 수</h4>
              
              {/* 성인 */}
              <div className={styles.passengerRow}>
                <div className={styles.passengerInfo}>
                  <div className={styles.passengerLabel}>성인</div>
                  <div className={styles.passengerAge}>12세 이상</div>
                </div>
                <div className={styles.counter}>
                  <button 
                    className={styles.counterButton}
                    onClick={() => adjustCount('adult', -1)}
                    disabled={localAdults <= 1}
                  >
                    <RiSubtractLine />
                  </button>
                  <span className={styles.count}>{localAdults}</span>
                  <button 
                    className={styles.counterButton}
                    onClick={() => adjustCount('adult', 1)}
                  >
                    <RiAddLine />
                  </button>
                </div>
              </div>

              {/* 어린이 */}
              <div className={styles.passengerRow}>
                <div className={styles.passengerInfo}>
                  <div className={styles.passengerLabel}>어린이</div>
                  <div className={styles.passengerAge}>2-11세</div>
                </div>
                <div className={styles.counter}>
                  <button 
                    className={styles.counterButton}
                    onClick={() => adjustCount('child', -1)}
                    disabled={localChildren <= 0}
                  >
                    <RiSubtractLine />
                  </button>
                  <span className={styles.count}>{localChildren}</span>
                  <button 
                    className={styles.counterButton}
                    onClick={() => adjustCount('child', 1)}
                  >
                    <RiAddLine />
                  </button>
                </div>
              </div>

              {/* 유아 */}
              <div className={styles.passengerRow}>
                <div className={styles.passengerInfo}>
                  <div className={styles.passengerLabel}>유아</div>
                  <div className={styles.passengerAge}>2세 미만</div>
                </div>
                <div className={styles.counter}>
                  <button 
                    className={styles.counterButton}
                    onClick={() => adjustCount('infant', -1)}
                    disabled={localInfants <= 0}
                  >
                    <RiSubtractLine />
                  </button>
                  <span className={styles.count}>{localInfants}</span>
                  <button 
                    className={styles.counterButton}
                    onClick={() => adjustCount('infant', 1)}
                  >
                    <RiAddLine />
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.seatClassSection}>
              <h4 className={styles.sectionTitle}>좌석 등급</h4>
              <div className={styles.seatClassGrid}>
                {seatClasses.map((seat) => (
                  <button
                    key={seat.value}
                    className={`${styles.seatClassOption} ${localSeatClass === seat.value ? styles.selected : ''}`}
                    onClick={() => setLocalSeatClass(seat.value)}
                  >
                    {seat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.actionButtons}>
              <button 
                className={styles.cancelButton}
                onClick={() => setIsOpen(false)}
              >
                취소
              </button>
              <button 
                className={styles.applyButton}
                onClick={handleApply}
              >
                적용
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MobilePassengerSelector
