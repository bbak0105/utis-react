'use client'

import React, { useState, useRef, useEffect } from 'react'
import { RiArrowDownSLine, RiMapPinLine, RiSearchLine } from 'react-icons/ri'
import styles from './MobileCitySelector.module.scss'

interface MobileCitySelectorProps {
  label: string
  value: string
  onChange: (city: string) => void
  cities: string[]
}

const MobileCitySelector: React.FC<MobileCitySelectorProps> = ({
  label,
  value,
  onChange,
  cities
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCities, setFilteredCities] = useState(cities)
  const inputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const [keyboardVisible, setKeyboardVisible] = useState(false)
  const [modalHeight, setModalHeight] = useState<number | null>(null)

  useEffect(() => {
    if (searchTerm) {
      const filtered = cities.filter(city => 
        city.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredCities(filtered)
    } else {
      setFilteredCities(cities)
    }
  }, [searchTerm, cities])

  // iOS 자동 확대 방지를 위해 자동 포커스 제거
  // 사용자가 직접 클릭할 때만 포커스되도록 함

  // 모달이 열려 있을 때 body 스크롤 방지 및 초기 높이 설정
  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 body 스크롤 방지
      const originalStyle = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = 'hidden'
      
      // 초기 모달 높이 계산 (키보드가 없을 때)
      const initialHeight = Math.min(window.innerHeight * 0.7, 600)
      // 키보드가 없으면 기본 높이로 설정하지 않음 (CSS가 처리하도록)
      
      return () => {
        // 모달이 닫힐 때 원래 스크롤 상태로 복원
        document.body.style.overflow = originalStyle
      }
    }
  }, [isOpen])

  // 키보드 감지
  useEffect(() => {
    if (!isOpen) return

    const handleResize = () => {
      const visualViewport = window.visualViewport
      const windowHeight = window.innerHeight
      const viewportHeight = visualViewport?.height || windowHeight
      const heightDifference = windowHeight - viewportHeight
      
      const isKeyboardVisible = heightDifference > 150
      setKeyboardVisible(isKeyboardVisible)
      
      // 키보드가 올라오면 모달 높이를 동적으로 조정
      if (isKeyboardVisible && visualViewport) {
        // visualViewport의 실제 사용 가능한 높이를 계산
        // offsetTop은 키보드가 올라왔을 때 화면 상단에서 visualViewport까지의 거리
        const visualTop = visualViewport.offsetTop
        // 모달은 bottom: 0으로 고정되어 있으므로, visualViewport 높이에서 여백을 빼면 됨
        const topMargin = Math.max(visualTop, 0) // 상단 여백 (최소 0)
        const bottomMargin = 5 // 하단 여백 (키보드와의 간격)
        const availableHeight = viewportHeight - topMargin - bottomMargin
        setModalHeight(Math.max(availableHeight, 250)) // 최소 250px 보장
      } else {
        // 키보드가 없으면 기본 높이 사용
        setModalHeight(null)
      }
      
      // 키보드가 올라오면 입력창이 보이도록 스크롤 조정
      if (isKeyboardVisible && inputRef.current && modalRef.current) {
        setTimeout(() => {
          if (inputRef.current && modalRef.current) {
            // 입력창이 모달 상단에서 보이도록 스크롤
            modalRef.current.scrollTop = 0
          }
        }, 150)
      }
    }

    const handleFocusIn = () => {
      setTimeout(() => {
        handleResize()
      }, 100)
    }

    // visualViewport API 사용 (모바일 브라우저 지원)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize)
    } else {
      window.addEventListener('resize', handleResize)
    }
    
    window.addEventListener('focusin', handleFocusIn)

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize)
      } else {
        window.removeEventListener('resize', handleResize)
      }
      window.removeEventListener('focusin', handleFocusIn)
    }
  }, [isOpen])

  const handleCitySelect = (city: string) => {
    onChange(city)
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleOpen = () => {
    setIsOpen(true)
    setSearchTerm('')
  }

  const handleClose = () => {
    setIsOpen(false)
    setSearchTerm('')
    setModalHeight(null)
    setKeyboardVisible(false)
  }

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // iOS에서 자동 확대를 방지하기 위해 약간의 딜레이 후 스크롤 조정
    setTimeout(() => {
      if (modalRef.current && inputRef.current) {
        // 모달 내부에서만 스크롤 조정
        // searchContainer를 참조해서 스크롤
        const searchContainer = inputRef.current.closest('[class*="searchContainer"]')
        if (searchContainer && modalRef.current) {
          // 입력창이 모달 상단에 보이도록 스크롤
          modalRef.current.scrollTop = 0
        }
      }
    }, 200) // 키보드가 올라온 후 조정
  }

  return (
    <div className={styles.inputGroup}>
      <label>{label}</label>
      <div className={styles.selectorContainer}>
        <button 
          className={styles.selectorButton}
          onClick={handleOpen}
        >
          <RiMapPinLine className={styles.icon} />
          <span className={styles.selectedValue}>{value || '도시 선택'}</span>
          <RiArrowDownSLine className={`${styles.arrow} ${isOpen ? styles.open : ''}`} />
        </button>
        
        {isOpen && (
          <>
            <div className={styles.overlay} onClick={handleClose} />
            <div 
              className={`${styles.modal} ${keyboardVisible ? styles.keyboardVisible : ''}`} 
              ref={modalRef}
              style={modalHeight ? { maxHeight: `${modalHeight}px`, height: `${modalHeight}px` } : undefined}
            >
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>{label} 도시 선택</h3>
                <button 
                  className={styles.closeButton}
                  onClick={handleClose}
                >
                  ×
                </button>
              </div>
              
              <div className={styles.searchContainer}>
                <div className={styles.searchInputWrapper}>
                  <RiSearchLine className={styles.searchIcon} />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="도시명을 입력하세요..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={handleInputFocus}
                    className={styles.searchInput}
                  />
                </div>
              </div>

              <div className={styles.citiesList}>
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <button
                      key={city}
                      className={`${styles.cityItem} ${city === value ? styles.selected : ''}`}
                      onClick={() => handleCitySelect(city)}
                    >
                      <RiMapPinLine className={styles.cityIcon} />
                      <span className={styles.cityName}>{city}</span>
                    </button>
                  ))
                ) : (
                  <div className={styles.noResults}>
                    <p>검색 결과가 없습니다.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default MobileCitySelector
