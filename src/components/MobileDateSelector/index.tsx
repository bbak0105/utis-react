'use client'

import React, { useState } from 'react'
import { RiCalendarLine, RiArrowDownSLine, RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri'
import styles from './MobileDateSelector.module.scss'

interface MobileDateSelectorProps {
  label: string
  departureDate: Date | null
  returnDate: Date | null
  activeTab: 'oneway' | 'round'
  onDateChange: (departure: Date | null, returnDate: Date | null) => void
}

const MobileDateSelector: React.FC<MobileDateSelectorProps> = ({
  label,
  departureDate,
  returnDate,
  activeTab,
  onDateChange
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const formatDate = (date: Date | null): string => {
    if (!date) return ''
    return date.toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      weekday: 'short'
    })
  }

  const getDisplayValue = (): string => {
    if (activeTab === 'oneway') {
      return departureDate ? formatDate(departureDate) : ''
    } else {
      if (!departureDate) return ''
      if (!returnDate) return formatDate(departureDate)
      return `${formatDate(departureDate)} ~ ${formatDate(returnDate)}`
    }
  }

  const handleDateSelect = (date: Date) => {
    if (activeTab === 'oneway') {
      onDateChange(date, null)
      setIsOpen(false)
    } else {
      if (!departureDate || returnDate) {
        onDateChange(date, null)
      } else {
        if (date < departureDate) {
          onDateChange(date, departureDate)
        } else {
          onDateChange(departureDate, date)
        }
        setIsOpen(false)
      }
    }
  }

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const today = new Date()
    const maxDate = new Date()
    maxDate.setFullYear(maxDate.getFullYear() + 1) // 1년 후
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      
      const isCurrentMonth = date.getMonth() === month
      const isToday = date.toDateString() === today.toDateString()
      const isPast = date < today && !isToday
      const isFuture = date > maxDate
      const isSelected = departureDate && date.toDateString() === departureDate.toDateString()
      const isReturnSelected = returnDate && date.toDateString() === returnDate.toDateString()
      const isInRange = departureDate && returnDate && 
        date > departureDate && date < returnDate
      
      days.push({
        date,
        isCurrentMonth,
        isToday,
        isPast,
        isFuture,
        isSelected,
        isReturnSelected,
        isInRange
      })
    }
    
    return days
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth)
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  const weekDays = ['일', '월', '화', '수', '목', '금', '토']


  return (
    <div className={styles.inputGroup}>
      <label>{label}</label>
      <div className={styles.selectorContainer}>
        <button 
          className={styles.selectorButton}
          onClick={() => setIsOpen(!isOpen)}
        >
          <RiCalendarLine className={styles.icon} />
          <span className={styles.selectedValue}>{getDisplayValue()}</span>
          <RiArrowDownSLine className={`${styles.arrow} ${isOpen ? styles.open : ''}`} />
        </button>
        
        {isOpen && (
          <>
            <div className={styles.overlay} onClick={() => setIsOpen(false)} />
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>
                  {activeTab === 'round' ? '여행 날짜 선택' : '출발 날짜 선택'}
                </h3>
                <button 
                  className={styles.closeButton}
                  onClick={() => setIsOpen(false)}
                >
                  ×
                </button>
              </div>
              
              <div className={styles.calendarContainer}>
                <div className={styles.calendarHeader}>
                  <button 
                    className={styles.navButton}
                    onClick={() => navigateMonth('prev')}
                  >
                    <RiArrowLeftSLine />
                  </button>
                  <h4 className={styles.monthTitle}>
                    {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
                  </h4>
                  <button 
                    className={styles.navButton}
                    onClick={() => navigateMonth('next')}
                  >
                    <RiArrowRightSLine />
                  </button>
                </div>
                
                <div className={styles.weekDays}>
                  {weekDays.map((day) => (
                    <div key={day} className={styles.weekDay}>{day}</div>
                  ))}
                </div>
                
                <div className={styles.calendarGrid}>
                  {generateCalendarDays().map((day, index) => (
                    <button
                      key={index}
                      className={`
                        ${styles.calendarDay}
                        ${!day.isCurrentMonth ? styles.otherMonth : ''}
                        ${day.isToday ? styles.today : ''}
                        ${day.isPast ? styles.past : ''}
                        ${day.isFuture ? styles.future : ''}
                        ${day.isSelected ? styles.selected : ''}
                        ${day.isReturnSelected ? styles.returnSelected : ''}
                        ${day.isInRange ? styles.inRange : ''}
                      `}
                      onClick={() => !day.isPast && !day.isFuture && handleDateSelect(day.date)}
                      disabled={day.isPast || day.isFuture}
                    >
                      {day.date.getDate()}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className={styles.modalActions}>
                <button 
                  className={styles.todayButton}
                  onClick={() => handleDateSelect(new Date())}
                >
                  오늘
                </button>
                <button 
                  className={styles.completeButton}
                  onClick={() => setIsOpen(false)}
                >
                  완료
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default MobileDateSelector
