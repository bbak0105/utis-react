import React, { useState, useEffect } from 'react'
import styles from './CalendarMonth.module.scss' 

type Role = 'departure' | 'return'
type Holiday = { name: string } | null

interface CalendarMonthProps {
  role: Role
  month: Date
  selectedDate?: Date | null           // 이 달력의 선택일(출발/복귀)
  otherSelectedDate?: Date | null      // 반대쪽 달력의 선택일(범위 표시에 필요)
  rangeStart?: Date | null
  rangeEnd?: Date | null
  onSelect: (day: Date) => void
  onPrev: () => void
  onNext: () => void
  onNavigateToMonth: (month: Date) => void  // 다른 달로 이동하는 함수
  generateCalendarDays: (month: Date) => Date[]
  isHoliday: (day: Date) => Holiday
  showNavigation?: boolean             // 네비게이션 버튼 표시 여부
}

const sameDay = (a?: Date | null, b?: Date | null) =>
  !!a && !!b && a.toDateString() === b.toDateString()

const inSameMonth = (day: Date, month: Date) =>
  day.getFullYear() === month.getFullYear() && day.getMonth() === month.getMonth()

const CalendarMonth: React.FC<CalendarMonthProps> = ({
  role,
  month,
  selectedDate,
  otherSelectedDate,
  rangeStart,
  rangeEnd,
  onSelect,
  onPrev,
  onNext,
  onNavigateToMonth,
  generateCalendarDays,
  isHoliday,
  showNavigation = true,
}) => {
  const weekLabels = ['일', '월', '화', '수', '목', '금', '토']
  
  // 다른 달로 이동 후 선택할 날짜를 저장하는 상태
  const [pendingSelection, setPendingSelection] = useState<Date | null>(null)
  
  // 달이 변경되면 대기 중인 날짜 선택을 실행
  useEffect(() => {
    if (pendingSelection) {
      onSelect(pendingSelection)
      setPendingSelection(null)
    }
  }, [month, pendingSelection, onSelect])

  return (
    <div className={styles.calendarWrapper}>
      <div className={`${styles.calendarHeader} ${!showNavigation ? styles.calendarHeaderNoNav : ''}`}>
        {showNavigation && (
          <button className={styles.navButton} onClick={onPrev} aria-label="이전 달">
            ‹
          </button>
        )}
        <h3>
          {month.getFullYear()}년 {month.getMonth() + 1}월
        </h3>
        {showNavigation && (
          <button className={styles.navButton} onClick={onNext} aria-label="다음 달">
            ›
          </button>
        )}
      </div>

      <div className={styles.calendarGrid}>
        <div className={styles.weekDays}>
          {weekLabels.map((w) => (
            <div key={w} className={styles.weekDay}>
              {w}
            </div>
          ))}
        </div>

        <div className={styles.daysGrid}>
          {generateCalendarDays(month).map((day) => {
            const currentMonth = inSameMonth(day, month)
            const today = sameDay(day, new Date())
            const holiday = isHoliday(day)

            const dayOfWeek = day.getDay() // 0=일, 6=토
            const isSunday = dayOfWeek === 0
            const isSaturday = dayOfWeek === 6

            const isSelectedThis = sameDay(day, selectedDate)
            const isSelectedOther = sameDay(day, otherSelectedDate)

            // 날짜 레이블 결정 - 더 간단한 로직
            let dateLabel = ''
            if (isSelectedThis) {
              // 현재 달력에서 선택된 날짜
              if (role === 'departure') {
                dateLabel = '출발'
              } else {
                dateLabel = '도착'
              }
            } else if (isSelectedOther) {
              // 다른 달력에서 선택된 날짜
              if (role === 'departure') {
                dateLabel = '도착'
              } else {
                dateLabel = '출발'
              }
            }

            const inRange =
              !!rangeStart &&
              !!rangeEnd &&
              day > (rangeStart as Date) &&
              day < (rangeEnd as Date) &&
              !isSelectedThis &&
              !isSelectedOther // 선택된 날짜는 범위 스타일 적용하지 않음

            // 과거 날짜 체크 (오늘보다 이전 날짜는 선택 불가)
            const todayDate = new Date()
            todayDate.setHours(0, 0, 0, 0) // 시간을 00:00:00으로 설정
            const dayDate = new Date(day)
            dayDate.setHours(0, 0, 0, 0) // 시간을 00:00:00으로 설정
            const isPastDate = dayDate < todayDate

            const className = [
              styles.dayButton,
              !currentMonth && styles.otherMonth,
              today && currentMonth && styles.today, // 오늘 날짜이면서 현재 월일 때만 today 스타일 적용
              (isSelectedThis || isSelectedOther) && styles.selectedDay,
              inRange && styles.inRange,
              holiday && styles.holiday,
              isSunday && styles.sunday,
              isSaturday && styles.saturday,
              isPastDate && styles.pastDate
            ]
              .filter(Boolean)
              .join(' ')

            // key는 index 대신 날짜 ISO를 사용 (Sonar S6479 회피)
            const key = `${role}-${day.toISOString().slice(0, 10)}`

            const handleDayClick = () => {
              // 과거 날짜는 선택 불가
              if (isPastDate) {
                return
              }

              if (currentMonth) {
                // 현재 달의 날짜는 바로 선택
                onSelect(day)
              } else {
                // 다른 달의 날짜는 해당 달로 이동 후 선택
                const targetMonth = new Date(day.getFullYear(), day.getMonth(), 1)
                setPendingSelection(day) // 선택할 날짜를 상태에 저장
                onNavigateToMonth(targetMonth) // 달 이동
              }
            }

            return (
              <button
                key={key}
                className={className}
                onClick={handleDayClick}
                disabled={isPastDate}
                title={holiday ? holiday.name : ''}
                aria-label={`${day.getMonth() + 1}월 ${day.getDate()}일${
                  holiday ? `, ${holiday.name}` : ''
                }`}
              >
                <span className={styles.dayNumber}>{day.getDate()}</span>
                {dateLabel && <span className={styles.dateLabel}>{dateLabel}</span>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CalendarMonth
