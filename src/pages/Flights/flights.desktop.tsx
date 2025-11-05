'use client'

import React, { useEffect, useState, useRef } from 'react'
import { searchFlights, getFlightPrices, SearchFlightsParams } from '../../api/flights'
import DestinationCard from '../../components/DestinationCard'
import { RiSearchLine, RiArrowLeftRightLine, RiCustomerService2Line, RiPlaneLine, RiMapPinLine, RiStarFill, RiSearch2Line } from 'react-icons/ri'
import useScrollAnimation from '../../utils/hooks/useScrollAnimation'
import styles from './FlightsDesktop.module.scss'
import { useFlightContext } from '../../contexts/FlightContext'
import type { FlightSearchParams } from '../../contexts/FlightContext'

import CalendarMonth from '@/components/CalendarMonth'
import cx from 'classnames'
import { FlightOffer, FlightOffersSearchResponse } from '@/api/types'
import { ASIAN_AIRLINES, CITY_IATA_MAP } from '../../../server/type'

const FlightsDesktop = () => {
    const {
        searchParams,
        setSearchParams,
        searchResults,
        setSearchResults,
        loading,
        setLoading,
        filters,
        setFilters,
        passengers,
        setPassengers
    } = useFlightContext()

    // Context에서 상태 추출
    const {
        departureCity,
        arrivalCity,
        departureDate,
        returnDate,
        adultCount,
        childCount,
        infantCount,
        selectedSeatClass,
        activeTab
    } = searchParams

    // 로컬 상태들 (UI 전용)
    const [showDepartureModal, setShowDepartureModal] = useState(false)
    const [showArrivalModal, setShowArrivalModal] = useState(false)
    const [activeInfoPanel, setActiveInfoPanel] = useState<'none' | 'departure' | 'arrival' | 'calendar' | 'passenger'>('none')
    const [selectedCategory, setSelectedCategory] = useState('domestic')
    
    // 캐러셀 스와이핑을 위한 state
    const [scrollPosition, setScrollPosition] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)

    // Context 상태 업데이트 헬퍼 함수들
    const updateSearchParams = (updates: Partial<FlightSearchParams>) => {
        setSearchParams(prev => ({ ...prev, ...updates }))
    }

    const setDepartureCity = (city: string) => updateSearchParams({ departureCity: city })
    const setArrivalCity = (city: string) => updateSearchParams({ arrivalCity: city })
    const setDepartureDate = (date: Date | null) => updateSearchParams({ departureDate: date })
    const setReturnDate = (date: Date | null) => updateSearchParams({ returnDate: date })
    const setActiveTab = (tab: 'oneway' | 'round') => updateSearchParams({ activeTab: tab })
    const setAdultCount = (count: number) => updateSearchParams({ adultCount: count })
    const setChildCount = (count: number) => updateSearchParams({ childCount: count })
    const setInfantCount = (count: number) => updateSearchParams({ infantCount: count })
    const setSelectedSeatClass = (seatClass: string) => updateSearchParams({ selectedSeatClass: seatClass })
    const getCityCode = (cityName: string): string => {
        return CITY_IATA_MAP[cityName as keyof typeof CITY_IATA_MAP] || cityName
    }

    // 항공사 코드를 한국어 이름으로 변환하는 함수
    const getAirlineName = (airlineCode: string | null | undefined): string => {
        if (!airlineCode) return '알 수 없음'
        
        // HR은 에어프레미아(YP)의 다른 코드로 매핑
        const normalizedCode = airlineCode === 'HR' ? 'YP' : airlineCode
        
        const airline = ASIAN_AIRLINES[normalizedCode as keyof typeof ASIAN_AIRLINES]
        return airline ? airline.nameKo : airlineCode
    }

    // 비행 시간 계산 함수
    const calculateDuration = (departureTime: string | null | undefined, arrivalTime: string | null | undefined): string => {
        if (!departureTime || !arrivalTime) return '--시간 --분'
        
        const depTime = new Date(departureTime)
        const arrTime = new Date(arrivalTime)
        const diffMs = arrTime.getTime() - depTime.getTime()
        
        const hours = Math.floor(diffMs / (1000 * 60 * 60))
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
        
        return `${hours}시간 ${minutes}분`
    }

    // 필터 초기화 함수
    const resetFilters = () => {
        setFilters({
            stops: {
                direct: false,
                oneStop: false,
                twoPlusStops: false
            },
            baggage: {
                included: false,
                notIncluded: false
            },
            airlines: [],
            seatClass: {
                economy: true,
                business: false
            }
        })
    }
    // 연속된 2개월 캘린더를 위한 상태 (왼쪽: 현재월, 오른쪽: 다음월)
    const [leftMonth, setLeftMonth] = useState(new Date())
    
    // 오른쪽 달 계산 (왼쪽 달의 다음 달)
    const rightMonth = new Date(leftMonth.getFullYear(), leftMonth.getMonth() + 1, 1)
    
    // 도시 검색 상태
    const [citySearchTerm, setCitySearchTerm] = useState('')
    const [pricedData, setPricedData] = useState<any>(null)
    const [pricingLoading, setPricingLoading] = useState(false)
    
    const titleRef = useScrollAnimation<HTMLHeadingElement>({ threshold: 0.2 })
    const searchResultsRef = useRef<HTMLDivElement>(null)

    // 항공사 코드 정규화 함수 (HR -> YP로 통일)
    const normalizeAirlineCode = (code: string): string => {
        return code === 'HR' ? 'YP' : code
    }

    // 검색 결과에서 항공사 데이터 추출
    const getAirlinesFromResults = () => {
        if (!searchResults?.data) return []
        
        const airlinesMap = new Map<string, { name: string, minPrice: number, originalCodes: Set<string> }>()
        
        searchResults.data.forEach((flight: any) => {
            const price = flight.price?.total ? parseFloat(flight.price.total) : 0
            
            // 출발편 항공사들 처리
            const outboundAirlineCode = flight.itineraries?.[0]?.segments?.[0]?.carrierCode
            if (outboundAirlineCode) {
                const normalizedCode = normalizeAirlineCode(outboundAirlineCode)
                const airlineName = getAirlineName(normalizedCode)
                const existing = airlinesMap.get(normalizedCode)
                if (!existing || price < existing.minPrice) {
                    airlinesMap.set(normalizedCode, { 
                        name: airlineName, 
                        minPrice: price,
                        originalCodes: new Set([outboundAirlineCode])
                    })
                } else {
                    existing.originalCodes.add(outboundAirlineCode)
                }
            }
            
            // validatingAirlineCodes 처리 (여러 항공사가 있을 수 있음)
            if (flight.validatingAirlineCodes && Array.isArray(flight.validatingAirlineCodes)) {
                flight.validatingAirlineCodes.forEach((airlineCode: string) => {
                    const normalizedCode = normalizeAirlineCode(airlineCode)
                    const airlineName = getAirlineName(normalizedCode)
                    const existing = airlinesMap.get(normalizedCode)
                    if (!existing || price < existing.minPrice) {
                        airlinesMap.set(normalizedCode, { 
                            name: airlineName, 
                            minPrice: price,
                            originalCodes: new Set([airlineCode])
                        })
                    } else {
                        existing.originalCodes.add(airlineCode)
                        // 최소 가격 업데이트
                        if (price < existing.minPrice) {
                            existing.minPrice = price
                        }
                    }
                })
            }
        })
        
        return Array.from(airlinesMap.entries()).map(([code, info]) => ({
            code,
            name: info.name,
            minPrice: info.minPrice,
            originalCodes: Array.from(info.originalCodes) // 필터링 시 사용할 원본 코드들
        })).sort((a, b) => a.minPrice - b.minPrice)
    }

    // 여행지 데이터
    const destinations = [
        {
            title: '인기 여행지',
            image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&h=200&fit=crop&crop=center',
            isPromotional: true
        },
        {
            title: '오사카',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&crop=center',
            rating: '★ 4.8',
            reviewCount: '리뷰 104개',
            price: '80,000'
        },
        {
            title: '도쿄',
            image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=200&fit=crop&crop=center',
            rating: '★ 4.9',
            reviewCount: '리뷰 234개',
            price: '120,000'
        },
        {
            title: '삿포로',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop&crop=center',
            rating: '★ 4.6',
            reviewCount: '리뷰 89개',
            price: '95,000'
        },
        {
            title: '제주도',
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop&crop=center',
            rating: '★ 4.9',
            reviewCount: '리뷰 892개',
            price: '65,000'
        },
        {
            title: '부산',
            image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&h=200&fit=crop&crop=center',
            rating: '★ 4.7',
            reviewCount: '리뷰 456개',
            price: '45,000'
        },
        {
            title: '후쿠오카',
            image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300&h=200&fit=crop&crop=center',
            rating: '★ 4.5',
            reviewCount: '리뷰 78개',
            price: '75,000'
        },
        {
            title: '오키나와',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&crop=center',
            rating: '★ 4.8',
            reviewCount: '리뷰 156개',
            price: '110,000'
        },
        {
            title: '나고야',
            image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=200&fit=crop&crop=center',
            rating: '★ 4.3',
            reviewCount: '리뷰 45개',
            price: '85,000'
        },
        {
            title: '대구',
            image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&h=200&fit=crop&crop=center',
            rating: '★ 4.4',
            reviewCount: '리뷰 123개',
            price: '35,000'
        }
    ]

    // // 검색 결과가 로드되면 스크롤 (API 응답 후 추가 스크롤 방지)
    // useEffect(() => {
    //     if (searchResults && !loading && searchResultsRef.current) {
    //         // 이미 스크롤이 시작되었으므로 추가 스크롤은 하지 않음
    //         // 필요시 여기서 추가 조정 가능
    //     }
    // }, [searchResults, loading])

    // 한국 공휴일 데이터 (2025년)
    const holidays = [
        { date: '2025-01-01', name: '신정' },
        { date: '2025-01-28', name: '설날연휴' },
        { date: '2025-01-29', name: '설날' },
        { date: '2025-01-30', name: '설날연휴' },
        { date: '2025-03-01', name: '삼일절' },
        { date: '2025-05-05', name: '어린이날' },
        { date: '2025-05-12', name: '부처님오신날' },
        { date: '2025-06-06', name: '현충일' },
        { date: '2025-08-15', name: '광복절' },
        { date: '2025-10-03', name: '개천절' },
        { date: '2025-10-05', name: '추석연휴' },
        { date: '2025-10-06', name: '추석' },
        { date: '2025-10-07', name: '추석연휴' },
        { date: '2025-10-09', name: '한글날' },
        { date: '2025-12-25', name: '성탄절' }
    ]

    // 공휴일 체크 함수
    const isHoliday = (date: Date): { date: string; name: string } | null => {
        const dateString = date.toISOString().split('T')[0]
        const found = holidays.find(holiday => holiday.date === dateString)
        return found ?? null
    }

    const categories = {
        domestic: {
            name: '국내',
            cities: ['서울(인천)', '인천', '김포', '청주', '제주도', '제주', '부산', '대구', '광주', '울산', '무안']
        },
        japan: {
            name: '일본',
            cities: ['도쿄', '오사카', '후쿠오카', '삿포로', '오키나와', '나고야', '다카마쓰', '고베', '기타큐슈']
        },
        // vietnam: {
        //     name: '베트남',
        //     cities: ['호치민', '하노이', '다낭']
        // },
        // thailand: {
        //     name: '태국',
        //     cities: ['방콕', '치앙마이', '푸켓']
        // }
    }

    // 모든 도시 목록
    const allCities = Object.values(categories).flatMap(category => category.cities)

    // 도시 검색 함수
    const getFilteredCities = () => {
        if (!citySearchTerm) return allCities
        return allCities.filter(city => 
            city.toLowerCase().includes(citySearchTerm.toLowerCase())
        )
    }

    const handleSearch = async () => {
        setLoading(true)
        
        // 검색 버튼 클릭 즉시 스크롤
        setTimeout(() => {
            if (searchResultsRef.current) {
                const target = searchResultsRef.current
                const offset = -140 // 결과 상단이 화면 상단에서 약간 아래에 위치하도록
                const y = target.getBoundingClientRect().top + window.pageYOffset + offset
                window.scrollTo({ top: y, behavior: 'smooth' })
            }
        }, 100)
        
        try {

            // 날짜 포맷팅 함수
            const formatDate = (date: Date | null): string => {
                if (!date) return ''
                return date.toISOString().split('T')[0]
            }

            const searchParams: SearchFlightsParams = {
                origin: getCityCode(departureCity),
                destination: getCityCode(arrivalCity),
                departureDate: formatDate(departureDate),
                adults: adultCount,
                children: childCount > 0 ? childCount : undefined,
                infants: infantCount > 0 ? infantCount : undefined,
                max: 20,
                currencyCode: 'KRW',
                travelClass: selectedSeatClass === '일반석' ? 'ECONOMY' : 
                           selectedSeatClass === '프리미엄 일반석' ? 'PREMIUM_ECONOMY' :
                           selectedSeatClass === '비즈니스석' ? 'BUSINESS' : 'FIRST'
            }

            // 왕복인 경우 returnDate 추가
            if (activeTab === 'round' && returnDate) {
                searchParams.returnDate = formatDate(returnDate)
            }

            console.log('검색 파라미터:', searchParams)
            const result: FlightOffersSearchResponse = await searchFlights(searchParams)
            console.log('검색 결과:', result)
            setSearchResults(result)
        } catch (error) {
            console.error('Error fetching flights:', error)
            alert('항공권 검색 중 오류가 발생했습니다. 다시 시도해주세요.')
        } finally {
            setLoading(false)
        }
    }

    const handleGetPrices = async () => {
        if (!searchResults?.data) return
        
        setPricingLoading(true)
        try {
            const limitedOffers = searchResults.data.slice(0, 6)
            const result = await getFlightPrices(limitedOffers)
            setPricedData(result)
        } catch (error) {
            console.error('Error getting flight prices:', error)
        } finally {
            setPricingLoading(false)
        }
    }

    const handleCitySelect = (city: string, type: 'departure' | 'arrival') => {
        if (type === 'departure') {
            setDepartureCity(city)
        } else {
            setArrivalCity(city)
        }
        setCitySearchTerm('')
        setActiveInfoPanel('none')
    }

    const swapCities = () => {
        const temp = departureCity
        setDepartureCity(arrivalCity)
        setArrivalCity(temp)
    }

    const formatDate = (date: Date | null) => {
        if (!date) return ''
        const month = date.getMonth() + 1
        const day = date.getDate()
        const weekdays = ['일', '월', '화', '수', '목', '금', '토']
        const weekday = weekdays[date.getDay()]
        return `${month}.${day.toString().padStart(2, '0')} (${weekday})`
    }

    const formatCombinedDate = (departure: Date | null, returnDate: Date | null): string => {
        if (!departure) return ''
        if (!returnDate) return formatDate(departure)
        return `${formatDate(departure)} ~ ${formatDate(returnDate)}`
    }


    // 월 네비게이션 함수들 - 연속된 2개월 캘린더용
    const navigateMonth = (direction: 'prev' | 'next') => {
        const newMonth = new Date(leftMonth)
            if (direction === 'prev') {
                newMonth.setMonth(newMonth.getMonth() - 1)
            } else {
                newMonth.setMonth(newMonth.getMonth() + 1)
            }
        setLeftMonth(newMonth)
    }

    // 다른 달로 이동하는 함수
    const navigateToMonth = (targetMonth: Date) => {
        setLeftMonth(targetMonth)
    }

    // 승객 수 업데이트 함수
    const updatePassengerText = () => {
        const totalPassengers = adultCount + childCount + infantCount
        const hasChildren = childCount > 0 || infantCount > 0
        
        if (hasChildren) {
            setPassengers(`승객 ${totalPassengers}, ${selectedSeatClass}`)
        } else {
            setPassengers(`성인 ${adultCount}, ${selectedSeatClass}`)
        }
    }

    // 캐러셀 스와이핑 이벤트 핸들러
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true)
        const target = e.currentTarget as HTMLDivElement
        setStartX(e.pageX - target.offsetLeft)
        setScrollLeft(target.scrollLeft)
    }

    const handleMouseLeave = () => {
        setIsDragging(false)
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return
        e.preventDefault()
        const target = e.currentTarget as HTMLDivElement
        const x = e.pageX - target.offsetLeft
        const walk = (x - startX) * 2
        target.scrollLeft = scrollLeft - walk
    }

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setIsDragging(true)
        const target = e.currentTarget as HTMLDivElement
        setStartX(e.touches[0].pageX - target.offsetLeft)
        setScrollLeft(target.scrollLeft)
    }

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging) return
        const target = e.currentTarget as HTMLDivElement
        const x = e.touches[0].pageX - target.offsetLeft
        const walk = (x - startX) * 2
        target.scrollLeft = scrollLeft - walk
    }

    // 승객 수 변경 함수
    const handlePassengerChange = (type: 'adult' | 'child' | 'infant', delta: number) => {
        if (type === 'adult') {
            const newCount = Math.max(1, adultCount + delta) // 최소 1명
            setAdultCount(newCount)
        } else if (type === 'child') {
            const newCount = Math.max(0, childCount + delta)
            setChildCount(newCount)
        } else if (type === 'infant') {
            const newCount = Math.max(0, infantCount + delta)
            setInfantCount(newCount)
        }
    }

    // 승객 텍스트 업데이트
    React.useEffect(() => {
        updatePassengerText()
    }, [adultCount, childCount, infantCount, selectedSeatClass])

    // 날짜 선택 로직 - 선택 순서에 따라 자동으로 출발/도착 구분 및 순서 조정
    const handleDateSelect = (day: Date) => {
        if (activeTab === 'oneway') {
            // 편도인 경우 출발일만 설정
            setDepartureDate(day)
            setReturnDate(null)
        } else {
            // 왕복인 경우 - 선택 순서에 따라 자동 구분
            if (!departureDate && !returnDate) {
                // 첫 번째 선택: 출발일로 설정
                setDepartureDate(day)
            } else if (departureDate && !returnDate) {
                // 두 번째 선택: 도착일로 설정하되, 출발일보다 앞이면 자동으로 바꿈
                if (day < departureDate) {
                    setDepartureDate(day)
                    setReturnDate(departureDate)
                } else {
                    setReturnDate(day)
                }
            } else {
                // 세 번째 선택부터: 새로운 출발일로 설정하고 도착일 초기화
                    setDepartureDate(day)
                setReturnDate(null)
            }
        }
    }

    // 달력 날짜 생성 함수
    const generateCalendarDays = (month: Date) => {
        const year = month.getFullYear()
        const monthIndex = month.getMonth()
        const firstDay = new Date(year, monthIndex, 1)
        const startDate = new Date(firstDay)
        startDate.setDate(startDate.getDate() - firstDay.getDay())
        
        const days = []
        const currentDate = new Date(startDate)
        const maxDate = new Date()
        maxDate.setFullYear(maxDate.getFullYear() + 1) // 1년 후
        
        for (let i = 0; i < 42; i++) {
            const dayDate = new Date(currentDate)
            // 1년 후를 넘는 날짜는 표시하지 않음
            if (dayDate <= maxDate) {
                days.push(dayDate)
            }
            currentDate.setDate(currentDate.getDate() + 1)
        }
        
        return days
    }

    // 수하물 정보 추출 함수
    const getBaggageInfo = (flight: FlightOffer) => {
        // travelerPricings에서 수하물 정보 추출
        const travelerPricings = flight.travelerPricings || []
        
        for (const traveler of travelerPricings) {
            const fareDetailsBySegment = traveler.fareDetailsBySegment || []
            
            for (const fareDetail of fareDetailsBySegment) {
                const includedCheckedBags = fareDetail.includedCheckedBags
                
                // 위탁 수하물 정보가 있으면 반환
                if (includedCheckedBags && ((includedCheckedBags.quantity ?? 0) > 0 || (includedCheckedBags.weight ?? 0) > 0)) {
                    return {
                        type: 'checked',
                        quantity: includedCheckedBags.quantity ?? 1,
                        weight: includedCheckedBags.weight ?? 0,
                        weightUnit: includedCheckedBags.weightUnit ?? 'KG'
                    }
                }
            }
        }
        
        // 위탁수하물이 없으면 null 반환 (기내수하물은 기본이므로 표시하지 않음)
        return null
    }

    // 필터링된 항공편 반환 함수
    const getFilteredFlights = () => {
        if (!searchResults?.data) return []
        
        return searchResults.data.filter((flight: FlightOffer) => {
            // 경유지 필터
            const outboundSegments = flight.itineraries?.[0]?.segments || []
            const stopCount = outboundSegments.length - 1
            
            if (filters.stops.direct && stopCount !== 0) return false
            if (filters.stops.oneStop && stopCount !== 1) return false
            if (filters.stops.twoPlusStops && stopCount < 2) return false
            
            // 수하물 필터
            const baggageInfo = getBaggageInfo(flight)
            if (filters.baggage.included && !baggageInfo) return false
            if (filters.baggage.notIncluded && baggageInfo) return false
            
            // 항공사 필터
            if (filters.airlines.length > 0) {
                const outboundAirlineCode = flight.itineraries?.[0]?.segments?.[0]?.carrierCode
                const validatingAirlines = flight.validatingAirlineCodes || []
                const allAirlines = [...new Set([outboundAirlineCode, ...validatingAirlines].filter(Boolean))]
                
                // 항공사 필터: 정규화된 코드와 원본 코드 모두 확인
                const hasMatchingAirline = filters.airlines.some(selectedCode => {
                    // 선택된 항공사의 모든 원본 코드 가져오기
                    const airlineData = getAirlinesFromResults().find(a => a.code === selectedCode)
                    const codesToMatch = airlineData?.originalCodes || [selectedCode]
                    const normalizedSelected = normalizeAirlineCode(selectedCode)
                    
                    return allAirlines.some(airlineCode => {
                        const normalized = normalizeAirlineCode(airlineCode || '')
                        return codesToMatch.includes(airlineCode || '') || normalized === normalizedSelected
                    })
                })
                if (!hasMatchingAirline) return false
            }
            
            // 좌석 등급 필터
            const travelerPricings = flight.travelerPricings || []
            let cabin = 'ECONOMY' // 기본값
            
            for (const traveler of travelerPricings) {
                const fareDetailsBySegment = traveler.fareDetailsBySegment || []
                for (const fareDetail of fareDetailsBySegment) {
                    if (fareDetail.cabin) {
                        cabin = fareDetail.cabin
                        break
                    }
                }
                if (cabin !== 'ECONOMY') break
            }
            
            if (filters.seatClass.economy && cabin !== 'ECONOMY') return false
            if (filters.seatClass.business && cabin !== 'BUSINESS') return false
            
            return true
        })
    }

    console.log('searchResults-----', searchResults)

    return (
        <div className={styles.container}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
                <h1 
                    ref={titleRef.ref}
                    className={`${styles.pageTitle} ${titleRef.isVisible ? styles.animateIn : styles.animateOut}`}
                >
                    항공권 검색
                </h1>
            </div>

            {/* 티켓 컨테이너 */}
            <div className={styles.ticketContainer}>
                {/* 왼쪽 검색 카드 */}
                <div className={styles.searchCard}>
                    {/* 여행 유형 탭 */}
                    <div className={styles.tabs}>
                        <div className={styles.tabGroup}>
                            <button 
                                className={`${styles.tab} ${activeTab === 'round' ? styles.active : ''}`}
                                onClick={() => {
                                    setActiveTab('round')
                                    // 왕복으로 변경 시 도착일이 없으면 출발일 기준으로 7일 후 설정
                                    if (departureDate && !returnDate) {
                                        const newReturnDate = new Date(departureDate)
                                        newReturnDate.setDate(newReturnDate.getDate() + 7)
                                        setReturnDate(newReturnDate)
                                    }
                                }}
                            >
                                왕복
                            </button>
                            <button 
                                className={`${styles.tab} ${activeTab === 'oneway' ? styles.active : ''}`}
                                onClick={() => {
                                    setActiveTab('oneway')
                                    // 편도로 변경 시 왕복 날짜 초기화
                                    if (departureDate && returnDate) {
                                        // 출발일만 유지하고 도착일은 null로 설정
                                        setReturnDate(null)
                                    }
                                }}
                            >
                                편도
                            </button>
                        </div>
                    </div>

                    {/* 입력 필드들 */}
                    <div className={`${styles.inputFields} ${activeTab === 'oneway' ? styles.oneway : ''}`}>
                    {/* 출발도시 */}
                    <div className={styles.inputGroup}>
                        <label>출발</label>
                        <input
                            type="text"
                            value={departureCity}
                            readOnly
                            onClick={() => setActiveInfoPanel('departure')}
                            className={styles.cityInput}
                        />
                    </div>

                    {/* 도시 교환 버튼 */}
                    <button className={styles.swapButton} onClick={swapCities}>
                        <RiArrowLeftRightLine />
                    </button>

                    {/* 도착도시 */}
                    <div className={styles.inputGroup}>
                        <label>도착</label>
                        <input
                            type="text"
                            value={arrivalCity}
                            readOnly
                            onClick={() => setActiveInfoPanel('arrival')}
                            className={styles.cityInput}
                        />
                    </div>

                    {/* 날짜 */}
                    <div className={styles.inputGroup}>
                        <label>{activeTab === 'oneway' ? '출발 날짜' : '여행 날짜'}</label>
                        <input
                            type="text"
                            value={activeTab === 'oneway' 
                                ? formatDate(departureDate)
                                : formatCombinedDate(departureDate, returnDate)
                            }
                            readOnly
                            onClick={() => setActiveInfoPanel('calendar')}
                            className={styles.dateInput}
                        />
                    </div>

                    {/* 승객 및 좌석 */}
                    <div className={styles.inputGroup}>
                        <label>승객</label>
                        <input
                            type="text"
                            value={passengers}
                            readOnly
                            onClick={() => setActiveInfoPanel('passenger')}
                            className={styles.passengerInput}
                        />
                    </div>
                    </div>
                </div>

                {/* 티켓 구분선 */}
                <div className={styles.ticketDivider}></div>

                {/* 오른쪽 정보 카드 */}
                <div className={styles.infoCard}>
                    {activeInfoPanel === 'none' && (
                        <div className={styles.infoContent}>
                            <div className={styles.planeIcon}>
                                <RiPlaneLine />
                            </div>
                            <p className={styles.instructionText}>옵션들을 선택 후, 항공권을 검색하세요.</p>
                            
                            {/* 검색 버튼 */}
                            <button 
                                className={styles.searchButton} 
                                onClick={handleSearch}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className={styles.loadingSpinner}></div>
                                        검색 중...
                                    </>
                                ) : (
                                    <>
                                        <RiSearchLine className={styles.searchIcon} />
                                        항공권 검색
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {activeInfoPanel === 'departure' && (
                        <div className={styles.citySelector}>
                            <div className={styles.selectorHeader}>
                                <h3>출발도시명을 검색하거나 아래 주요도시에서 선택하세요.</h3>
                                <button 
                                    className={styles.closeButton}
                                    onClick={() => setActiveInfoPanel('none')}
                                >
                                    ×
                                </button>
                            </div>

                            {/* 검색 입력창 */}
                            <div className={styles.searchInputContainer}>
                                <RiSearchLine className={styles.searchInputIcon} />
                                <input
                                    type="text"
                                    placeholder="도시명을 입력하세요..."
                                    value={citySearchTerm}
                                    onChange={(e) => setCitySearchTerm(e.target.value)}
                                    className={styles.searchInput}
                                />
                            </div>

                            {/* 최근 출발도시 */}
                            {!citySearchTerm && (
                            <div className={styles.recentSection}>
                                <h4>최근 출발도시</h4>
                                <div 
                                    className={styles.recentTag}
                                    onClick={() => handleCitySelect('서울(인천)', 'departure')}
                                >
                                    서울(인천)
                                </div>
                            </div>
                            )}

                            {/* 카테고리 탭 - 검색어가 없을 때만 표시 */}
                            {!citySearchTerm && (
                            <div className={styles.categoryTabs}>
                                {Object.entries(categories).map(([key, category]) => (
                                    <button
                                        key={key}
                                        className={`${styles.categoryTab} ${selectedCategory === key ? styles.active : ''}`}
                                        onClick={() => setSelectedCategory(key)}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                            )}

                            {/* 도시 목록 - 검색어가 있으면 전체에서 필터링, 없으면 선택된 탭의 도시만 표시 */}
                            <div className={styles.cityGrid}>
                                {(citySearchTerm
                                    ? allCities.filter(city =>
                                        city.toLowerCase().includes(citySearchTerm.toLowerCase())
                                    )
                                    : categories[selectedCategory as keyof typeof categories].cities
                                ).map((city) => {
                                    return (
                                        <button
                                            key={city}
                                            className={cx(styles.cityItem, {
                                                [styles.selected]: departureCity === city
                                            })}
                                            onClick={() => handleCitySelect(city, 'departure')}
                                        >
                                            {city}
                                        </button>
                                    )
                                })}
                            </div>
                            
                            {/* 검색 버튼 */}
                            <button 
                                className={styles.searchButton} 
                                onClick={handleSearch}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className={styles.loadingSpinner}></div>
                                        검색 중...
                                    </>
                                ) : (
                                    <>
                                        <RiSearchLine className={styles.searchIcon} />
                                        항공권 검색
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {activeInfoPanel === 'arrival' && (
                        <div className={styles.citySelector}>
                            <div className={styles.selectorHeader}>
                                <h3>도착도시명을 검색하거나 아래 주요도시에서 선택하세요.</h3>
                                <button 
                                    className={styles.closeButton}
                                    onClick={() => setActiveInfoPanel('none')}
                                >
                                    ×
                                </button>
                            </div>

                            {/* 검색 입력창 */}
                            <div className={styles.searchInputContainer}>
                                <RiSearchLine className={styles.searchInputIcon} />
                                <input
                                    type="text"
                                    placeholder="도시명을 입력하세요..."
                                    value={citySearchTerm}
                                    onChange={(e) => setCitySearchTerm(e.target.value)}
                                    className={styles.searchInput}
                                />
                            </div>

                            {/* 카테고리 탭 - 검색어가 없을 때만 표시 */}
                            {!citySearchTerm && (
                            <div className={styles.categoryTabs}>
                                {Object.entries(categories).map(([key, category]) => (
                                    <button
                                        key={key}
                                        className={`${styles.categoryTab} ${selectedCategory === key ? styles.active : ''}`}
                                        onClick={() => setSelectedCategory(key)}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                            )}

                            {/* 도시 목록 - 검색어가 있으면 전체에서 필터링, 없으면 선택된 탭의 도시만 표시 */}
                            <div className={styles.cityGrid}>
                                {(citySearchTerm
                                    ? allCities.filter(city =>
                                        city.toLowerCase().includes(citySearchTerm.toLowerCase())
                                    )
                                    : categories[selectedCategory as keyof typeof categories].cities
                                ).map((city) => (
                                    <button
                                        key={city}
                                        className={cx(styles.cityItem, {
                                            [styles.selected]: arrivalCity === city
                                        })}
                                        onClick={() => handleCitySelect(city, 'arrival')}
                                    >
                                        {city}
                                    </button>
                                ))}
                            </div>
                            
                            {/* 검색 버튼 */}
                            <button 
                                className={styles.searchButton} 
                                onClick={handleSearch}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className={styles.loadingSpinner}></div>
                                        검색 중...
                                    </>
                                ) : (
                                    <>
                                        <RiSearchLine className={styles.searchIcon} />
                                        항공권 검색
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {activeInfoPanel === 'calendar' && (
                    <div className={styles.calendarSelector}>
                        <div className={styles.selectorHeader}>
                        <h3>날짜를 선택하세요</h3>
                        <button
                            className={styles.closeButton}
                            onClick={() => setActiveInfoPanel('none')}
                        >
                            ×
                        </button>
                        </div>

                        <div className={styles.calendarContainer}>
                        {/* 왼쪽 달력 (현재 월) */}
                        <CalendarMonth
                            role="departure"
                            month={leftMonth}
                            selectedDate={departureDate}
                            otherSelectedDate={returnDate}
                            rangeStart={departureDate}
                            rangeEnd={returnDate}
                            onSelect={handleDateSelect}
                            onPrev={() => navigateMonth('prev')}
                            onNext={() => navigateMonth('next')}
                            onNavigateToMonth={navigateToMonth}
                            generateCalendarDays={generateCalendarDays}
                            isHoliday={isHoliday}
                        />

                        {/* 오른쪽 달력 (다음 월) */}
                            <CalendarMonth
                                role="return"
                            month={rightMonth}
                                selectedDate={returnDate}
                                otherSelectedDate={departureDate}
                                rangeStart={departureDate}
                                rangeEnd={returnDate}
                                onSelect={handleDateSelect}
                            onPrev={() => navigateMonth('prev')}
                            onNext={() => navigateMonth('next')}
                            onNavigateToMonth={navigateToMonth}
                                generateCalendarDays={generateCalendarDays}
                                isHoliday={isHoliday}
                            showNavigation={false}
                        />
                        </div>
                        
                        {/* 검색 버튼 */}
                        <button 
                            className={styles.searchButton} 
                            onClick={handleSearch}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className={styles.loadingSpinner}></div>
                                    검색 중...
                                </>
                            ) : (
                                <>
                                    <RiSearchLine className={styles.searchIcon} />
                                    항공권 검색
                                </>
                            )}
                        </button>
                    </div>
                    )}

                    {activeInfoPanel === 'passenger' && (
                        <div className={styles.passengerSelector}>
                            <div className={styles.selectorHeader}>
                                <h3>승객 및 좌석 등급을 선택하세요</h3>
                                <button 
                                    className={styles.closeButton}
                                    onClick={() => setActiveInfoPanel('none')}
                                >
                                    ×
                                </button>
                            </div>

                            {/* 승객 수 선택 */}
                            <div className={styles.passengerSection}>
                                {/* 성인 */}
                                <div className={styles.passengerRow}>
                                    <div className={styles.passengerLabel}>
                                        <span>성인</span>
                                        <button className={styles.infoButton}>?</button>
                                    </div>
                                    <div className={styles.counter}>
                                        <button 
                                            className={styles.counterButton}
                                            onClick={() => handlePassengerChange('adult', -1)}
                                            disabled={adultCount <= 1}
                                        >
                                            -
                                        </button>
                                        <span className={styles.counterValue}>{adultCount}</span>
                                        <button 
                                            className={styles.counterButton}
                                            onClick={() => handlePassengerChange('adult', 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* 아동 */}
                                <div className={styles.passengerRow}>
                                    <div className={styles.passengerLabel}>
                                        <span>아동</span>
                                        <button className={styles.infoButton}>?</button>
                                    </div>
                                    <div className={styles.counter}>
                                        <button 
                                            className={styles.counterButton}
                                            onClick={() => handlePassengerChange('child', -1)}
                                            disabled={childCount <= 0}
                                        >
                                            -
                                        </button>
                                        <span className={styles.counterValue}>{childCount}</span>
                                        <button 
                                            className={styles.counterButton}
                                            onClick={() => handlePassengerChange('child', 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* 유아 */}
                                <div className={styles.passengerRow}>
                                    <div className={styles.passengerLabel}>
                                        <span>유아</span>
                                        <button className={styles.infoButton}>?</button>
                                    </div>
                                    <div className={styles.counter}>
                                        <button 
                                            className={styles.counterButton}
                                            onClick={() => handlePassengerChange('infant', -1)}
                                            disabled={infantCount <= 0}
                                        >
                                            -
                                        </button>
                                        <span className={styles.counterValue}>{infantCount}</span>
                                        <button 
                                            className={styles.counterButton}
                                            onClick={() => handlePassengerChange('infant', 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* 안내 문구 */}
                            <div className={styles.passengerNote}>
                                성인, 아동, 유아의 나이는 탑승일 기준입니다.
                            </div>

                            {/* 좌석 등급 선택 */}
                            <div className={styles.seatClassSection}>
                                <div className={styles.seatClassGrid}>
                                    <button 
                                        className={cx(styles.seatClassButton, {
                                            [styles.selected]: selectedSeatClass === '일반석'
                                        })}
                                        onClick={() => setSelectedSeatClass('일반석')}
                                    >
                                        일반석
                                    </button>
                                    <button 
                                        className={cx(styles.seatClassButton, {
                                            [styles.selected]: selectedSeatClass === '프리미엄 일반석'
                                        })}
                                        onClick={() => setSelectedSeatClass('프리미엄 일반석')}
                                    >
                                        프리미엄 일반석
                                    </button>
                                    <button 
                                        className={cx(styles.seatClassButton, {
                                            [styles.selected]: selectedSeatClass === '비즈니스석'
                                        })}
                                        onClick={() => setSelectedSeatClass('비즈니스석')}
                                    >
                                        비즈니스석
                                    </button>
                                    <button 
                                        className={cx(styles.seatClassButton, {
                                            [styles.selected]: selectedSeatClass === '일등석'
                                        })}
                                        onClick={() => setSelectedSeatClass('일등석')}
                                    >
                                        일등석
                                    </button>
                                </div>
                            </div>
                            
                            {/* 검색 버튼 */}
                            <button 
                                className={styles.searchButton} 
                                onClick={handleSearch}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className={styles.loadingSpinner}></div>
                                        검색 중...
                                    </>
                                ) : (
                                    <>
                                        <RiSearchLine className={styles.searchIcon} />
                                        항공권 검색
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* 출발도시 선택 모달 */}
            {showDepartureModal && (
                <div className={styles.modalOverlay} onClick={() => setShowDepartureModal(false)}>
                    <div className={styles.cityModal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>출발도시명을 검색하거나 아래 주요도시에서 선택하세요.</h3>
                            <button 
                                className={styles.closeButton}
                                onClick={() => setShowDepartureModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        {/* 최근 출발도시 */}
                        <div className={styles.recentSection}>
                            <h4>최근 출발도시</h4>
                            <div className={styles.recentTag}>서울(인천)</div>
                        </div>

                        {/* 카테고리 탭 */}
                        <div className={styles.categoryTabs}>
                            {Object.entries(categories).map(([key, category]) => (
                                <button
                                    key={key}
                                    className={`${styles.categoryTab} ${selectedCategory === key ? styles.active : ''}`}
                                    onClick={() => setSelectedCategory(key)}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>

                        {/* 도시 목록 */}
                        <div className={styles.cityGrid}>
                            {categories[selectedCategory as keyof typeof categories].cities.map((city) => (
                                <button
                                    key={city}
                                    className={styles.cityItem}
                                    onClick={() => handleCitySelect(city, 'departure')}
                                >
                                    {city}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 도착도시 선택 모달 */}
            {showArrivalModal && (
                <div className={styles.modalOverlay} onClick={() => setShowArrivalModal(false)}>
                    <div className={styles.cityModal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>도착도시명을 검색하거나 아래 주요도시에서 선택하세요.</h3>
                            <button 
                                className={styles.closeButton}
                                onClick={() => setShowArrivalModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        {/* 카테고리 탭 */}
                        <div className={styles.categoryTabs}>
                            {Object.entries(categories).map(([key, category]) => (
                                <button
                                    key={key}
                                    className={`${styles.categoryTab} ${selectedCategory === key ? styles.active : ''}`}
                                    onClick={() => setSelectedCategory(key)}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>

                        {/* 도시 목록 */}
                        <div className={styles.cityGrid}>
                            {categories[selectedCategory as keyof typeof categories].cities.map((city) => (
                                <button
                                    key={city}
                                    className={cx(styles.cityItem, {
                                        [styles.selected]: arrivalCity === city
                                    })}
                                    onClick={() => handleCitySelect(city, 'arrival')}
                                >
                                    {city}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 로딩 상태 */}
            {loading && (
                <div ref={searchResultsRef} className={styles.searchResults}>
                    {/* 로딩 헤더 */}
                    <div className={styles.resultsHeader}>
                        <div className={styles.resultsCount}>
                            검색결과: 총 0건
                </div>
                        <div className={styles.routeInfo}>
                            {departureDate && (
                                <span>
                                    {new Date(departureDate).toLocaleDateString('ko-KR', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric',
                                        weekday: 'long'
                                    })} {departureCity}({getCityCode(departureCity)}) → {arrivalCity}({getCityCode(arrivalCity)})
                                </span>
                            )}
                        </div>
                    </div>

                    {/* 가격 정렬 옵션 */}
                    <div className={styles.priceSortOptions}>
                        <button className={`${styles.sortOption} ${styles.recommended}`}>추천</button>
                        <button className={`${styles.sortOption} ${styles.lowestPrice} ${styles.active}`}>최저가</button>
                        <button className={styles.sortOption}>최단시간</button>
                        <button className={styles.sortOption}>이른출발</button>
                        <button className={styles.sortOption}>이른도착</button>
                </div>

                    <div className={styles.resultsContainer}>
                        {/* 좌측 필터 패널 - 로딩 placeholder */}
                        <div className={styles.filtersPanel}>
                            <div className={styles.loadingFilterSection}>
                                <div className={styles.loadingFilterTitle}></div>
                            </div>
                            
                            <div className={styles.loadingFilterSection}>
                                <div className={styles.loadingFilterSubtitle}></div>
                                <div className={styles.loadingFilterOptions}>
                                    <div className={styles.loadingFilterOption}></div>
                                    <div className={styles.loadingFilterOption}></div>
                                    <div className={styles.loadingFilterOption}></div>
                                </div>
                            </div>

                            <div className={styles.loadingFilterSection}>
                                <div className={styles.loadingFilterSubtitle}></div>
                                <div className={styles.loadingFilterOptions}>
                                    <div className={styles.loadingFilterOption}></div>
                                    <div className={styles.loadingFilterOption}></div>
                                </div>
                            </div>

                            <div className={styles.loadingFilterSection}>
                                <div className={styles.loadingFilterSubtitle}></div>
                                <div className={styles.loadingFilterOptions}>
                                    <div className={styles.loadingFilterOption}></div>
                                    <div className={styles.loadingFilterOption}></div>
                                    <div className={styles.loadingFilterOption}></div>
                        </div>
                                <div className={styles.loadingMoreButton}></div>
                            </div>

                            <div className={styles.loadingFilterSection}>
                                <div className={styles.loadingFilterSubtitle}></div>
                                <div className={styles.loadingFilterOptions}>
                                    <div className={styles.loadingFilterOption}></div>
                                    <div className={styles.loadingFilterOption}></div>
                            </div>
                        </div>
                    </div>

                        {/* 우측 로딩 플레이스홀더 */}
                        <div className={styles.flightsList}>
                            {[...Array(8)].map((_, index) => (
                                <div key={index} className={styles.loadingCard}>
                                    <div className={styles.loadingLogo}></div>
                                    <div className={styles.loadingContent}>
                                        <div className={styles.loadingTitle}></div>
                                        <div className={styles.loadingTimes}>
                                            <div className={styles.loadingTime}></div>
                                            <div className={styles.loadingDuration}></div>
                                            <div className={styles.loadingTime}></div>
                        </div>
                                        <div className={styles.loadingBaggage}></div>
                            </div>
                                    <div className={styles.loadingPrice}>
                                        <div className={styles.loadingPriceText}></div>
                                        <div className={styles.loadingButton}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 검색 결과 */}
            {searchResults && !loading && (
                <div ref={searchResultsRef} className={styles.searchResults}>
                    {/* 검색 결과 헤더 */}
                    <div className={styles.resultsHeader}>
                        <div className={styles.resultsCount}>
                            검색결과: 총 {searchResults.data?.length || 0}건 
                            {(() => {
                                const filteredCount = getFilteredFlights().length
                                const totalCount = searchResults.data?.length || 0
                                return filteredCount !== totalCount ? (
                                    <span className={styles.filteredCount}> (조건에 맞는 데이터 {filteredCount}개)</span>
                                ) : ''
                            })()}
                        </div>
                        <div className={styles.routeInfo}>
                            {departureDate && (
                                <span>
                                    {new Date(departureDate).toLocaleDateString('ko-KR', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric',
                                        weekday: 'long'
                                    })} {departureCity}({getCityCode(departureCity)}) → {arrivalCity}({getCityCode(arrivalCity)})
                                </span>
                            )}
                            </div>
                        </div>

                    {/* 가격 정렬 옵션 */}
                    <div className={styles.priceSortOptions}>
                        <button className={`${styles.sortOption} ${styles.recommended}`}>추천</button>
                        <button className={`${styles.sortOption} ${styles.lowestPrice} ${styles.active}`}>최저가</button>
                        <button className={styles.sortOption}>최단시간</button>
                        <button className={styles.sortOption}>이른출발</button>
                        <button className={styles.sortOption}>이른도착</button>
                    </div>

                    <div className={styles.resultsContainer}>
                        {/* 좌측 필터 패널 */}
                        <div className={styles.filtersPanel}>
                            <div className={styles.filterSection}>
                                <h3>
                                    결과 내 상세 검색
                                    <button className={styles.resetButton} onClick={resetFilters}>초기화</button>
                                </h3>
                        </div>
                            
                            <div className={styles.filterSection}>
                                <h4>경유</h4>
                                <label className={styles.filterOption}>
                                    <input 
                                        type="checkbox" 
                                        checked={filters.stops.direct}
                                        onChange={(e) => setFilters(prev => ({
                                            ...prev,
                                            stops: { 
                                                direct: e.target.checked,
                                                oneStop: e.target.checked ? false : prev.stops.oneStop,
                                                twoPlusStops: e.target.checked ? false : prev.stops.twoPlusStops
                                            }
                                        }))}
                                    /> 직항
                                </label>
                                <label className={styles.filterOption}>
                                    <input 
                                        type="checkbox" 
                                        checked={filters.stops.oneStop}
                                        onChange={(e) => setFilters(prev => ({
                                            ...prev,
                                            stops: { 
                                                direct: e.target.checked ? false : prev.stops.direct,
                                                oneStop: e.target.checked,
                                                twoPlusStops: e.target.checked ? false : prev.stops.twoPlusStops
                                            }
                                        }))}
                                    /> 1회
                                </label>
                                <label className={styles.filterOption}>
                                    <input 
                                        type="checkbox" 
                                        checked={filters.stops.twoPlusStops}
                                        onChange={(e) => setFilters(prev => ({
                                            ...prev,
                                            stops: { 
                                                direct: e.target.checked ? false : prev.stops.direct,
                                                oneStop: e.target.checked ? false : prev.stops.oneStop,
                                                twoPlusStops: e.target.checked
                                            }
                                        }))}
                                    /> 2회 이상
                                </label>
                            </div>

                            <div className={styles.filterSection}>
                                <h4>무료 수하물</h4>
                                <label className={styles.filterOption}>
                                    <input 
                                        type="checkbox" 
                                        checked={filters.baggage.included}
                                        onChange={(e) => setFilters(prev => ({
                                            ...prev,
                                            baggage: { 
                                                included: e.target.checked,
                                                notIncluded: e.target.checked ? false : prev.baggage.notIncluded
                                            }
                                        }))}
                                    /> 포함
                                </label>
                                <label className={styles.filterOption}>
                                    <input 
                                        type="checkbox" 
                                        checked={filters.baggage.notIncluded}
                                        onChange={(e) => setFilters(prev => ({
                                            ...prev,
                                            baggage: { 
                                                included: e.target.checked ? false : prev.baggage.included,
                                                notIncluded: e.target.checked
                                            }
                                        }))}
                                    /> 불포함
                                </label>
                            </div>

                            {getAirlinesFromResults().length > 0 && (
                                <div className={styles.filterSection}>
                                    <h4>
                                        항공사
                                        <button className={styles.resetButton} onClick={() => setFilters(prev => ({ ...prev, airlines: [] }))}>초기화</button>
                                    </h4>
                                    <div className={styles.airlineList}>
                                        {getAirlinesFromResults().map((airline) => (
                                            <label key={airline.code} className={styles.airlineOption}>
                                                <div className={styles.airlineLeft}>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={filters.airlines.includes(airline.code)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setFilters(prev => ({
                                                                    ...prev,
                                                                    airlines: [...prev.airlines, airline.code]
                                                                }))
                                                            } else {
                                                                setFilters(prev => ({
                                                                    ...prev,
                                                                    airlines: prev.airlines.filter(code => code !== airline.code)
                                                                }))
                                                            }
                                                        }}
                                                    />
                                                    <span className={styles.airlineName}>{airline.name}</span>
                                                </div>
                                                <span className={styles.airlinePrice}>
                                                    {airline.minPrice.toLocaleString()}원~
                                </span>
                                            </label>
                                        ))}
                            </div>
                                    {getAirlinesFromResults().length > 3 && (
                                        <button className={styles.moreButton}>더보기 ↓</button>
                                    )}
                        </div>
                            )}

                            {/* <div className={styles.filterSection}>
                                <h4>좌석 등급</h4>
                                <label className={styles.filterOption}>
                                    <input 
                                        type="checkbox" 
                                        checked={filters.seatClass.economy}
                                        onChange={(e) => setFilters(prev => ({
                                            ...prev,
                                            seatClass: { ...prev.seatClass, economy: e.target.checked }
                                        }))}
                                    /> 일반석
                                </label>
                                <label className={styles.filterOption}>
                                    <input 
                                        type="checkbox" 
                                        checked={filters.seatClass.business}
                                        onChange={(e) => setFilters(prev => ({
                                            ...prev,
                                            seatClass: { ...prev.seatClass, business: e.target.checked }
                                        }))}
                                    /> 비즈니스석
                                </label>
                            </div> */}
                    </div>

                        {/* 우측 항공편 목록 */}
                            <div className={styles.flightsList}>
                                {searchResults.data && searchResults.data.length > 0 && getFilteredFlights().length > 0 ? (
                                    getFilteredFlights().slice(0, 20).map((flight: FlightOffer, index: number) => {
                                    const outboundSegments = flight.itineraries?.[0]?.segments || []
                                    const returnSegments = flight.itineraries?.[1]?.segments || []
                                    const isRoundTrip = returnSegments.length > 0
                                    
                                    const outboundFirstSegment = outboundSegments[0]
                                    const outboundLastSegment = outboundSegments[outboundSegments.length - 1]
                                    const returnFirstSegment = returnSegments[0]
                                    const returnLastSegment = returnSegments[returnSegments.length - 1]
                                    
                                    const outboundAirlineCode = flight.itineraries?.[0]?.segments?.[0]?.carrierCode || 'UNKNOWN'
                                    const returnAirlineCode = isRoundTrip ? (flight.itineraries?.[1]?.segments?.[0]?.carrierCode || 'UNKNOWN') : null
                                    
                                    // validatingAirlineCodes에서 모든 항공사 추출
                                    const validatingAirlines = flight.validatingAirlineCodes || []
                                    const allAirlines = [...new Set([outboundAirlineCode, returnAirlineCode, ...validatingAirlines].filter(Boolean))]
                                    
                                    const price = flight.price?.total ? parseInt(flight.price.total).toLocaleString() : '0'
                                    const currency = flight.price?.currency || 'KRW'
                                    
                                    return (
                                        <div key={index} className={styles.flightCard}>
                                            <div className={styles.airlineLogo}>
                                                <div className={styles.logoPlaceholder}>
                                                    {outboundAirlineCode.charAt(0)}
                        </div>
                            </div>
                                            <div className={styles.flightInfo}>
                                                <div className={styles.airlineName}>
                                                    {getAirlineName(outboundAirlineCode)}
                                                    {outboundSegments.length > 1 && <span className={styles.codeshare}>공동운항</span>}
                                                    {allAirlines.length > 1 && (
                                                        <span className={styles.codeshare}>
                                                            {allAirlines.slice(1).map(code => getAirlineName(code)).join(', ')}
                                </span>
                                                    )}
                            </div>
                                                
                                                {/* 출발편 (가는편) */}
                                                <div className={styles.flightRoute}>
                                                    <div className={styles.routeLabel}>
                                                        가는편
                                                        {outboundSegments.length > 1 && (
                                                            <span className={styles.routeAirline}> ({getAirlineName(outboundAirlineCode)})</span>
                                                        )}
                                                    </div>
                                                    <div className={styles.flightTimes}>
                                                        <div className={styles.departure}>
                                                            <span className={styles.airport}>{outboundFirstSegment?.departure?.iataCode}</span>
                                                            <span className={styles.time}>
                                                                {outboundFirstSegment?.departure?.at ? 
                                                                    new Date(outboundFirstSegment.departure.at).toLocaleTimeString('ko-KR', { 
                                                                        hour: '2-digit', 
                                                                        minute: '2-digit',
                                                                        hour12: false 
                                                                    }) : '--:--'
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className={styles.flightPath}>
                                                            <div className={styles.pathLine}>
                                                                <div className={styles.pathDot}></div>
                                                            </div>
                                                            <div className={styles.duration}>
                                                                {calculateDuration(outboundFirstSegment?.departure?.at, outboundLastSegment?.arrival?.at)}
                                                            </div>
                                                        </div>
                                                        <div className={styles.arrival}>
                                                            <span className={styles.airport}>{outboundLastSegment?.arrival?.iataCode}</span>
                                                            <span className={styles.time}>
                                                                {outboundLastSegment?.arrival?.at ? 
                                                                    new Date(outboundLastSegment.arrival.at).toLocaleTimeString('ko-KR', { 
                                                                        hour: '2-digit', 
                                                                        minute: '2-digit',
                                                                        hour12: false 
                                                                    }) : '--:--'
                                                                }
                                                            </span>
                                                        </div>
                        </div>
                    </div>

                                                {/* 복귀편 (오는편) - 왕복일 경우에만 표시 */}
                                                {isRoundTrip && (
                                                    <div className={styles.flightRoute}>
                                                        <div className={styles.routeLabel}>
                                                            오는편
                                                            {returnSegments.length > 1 && (
                                                                <span className={styles.routeAirline}> ({getAirlineName(returnAirlineCode)})</span>
                                                            )}
                        </div>
                                                        <div className={styles.flightTimes}>
                                                            <div className={styles.departure}>
                                                                <span className={styles.airport}>{returnFirstSegment?.departure?.iataCode}</span>
                                                                <span className={styles.time}>
                                                                    {returnFirstSegment?.departure?.at ? 
                                                                        new Date(returnFirstSegment.departure.at).toLocaleTimeString('ko-KR', { 
                                                                            hour: '2-digit', 
                                                                            minute: '2-digit',
                                                                            hour12: false 
                                                                        }) : '--:--'
                                                                    }
                                                                </span>
                            </div>
                                                            <div className={styles.flightPath}>
                                                                <div className={styles.pathLine}>
                                                                    <div className={styles.pathDot}></div>
                                                                </div>
                                                                <div className={styles.duration}>
                                                                    {calculateDuration(returnFirstSegment?.departure?.at, returnLastSegment?.arrival?.at)}
                                                                </div>
                                                            </div>
                                                            <div className={styles.arrival}>
                                                                <span className={styles.airport}>{returnLastSegment?.arrival?.iataCode}</span>
                                                                <span className={styles.time}>
                                                                    {returnLastSegment?.arrival?.at ? 
                                                                        new Date(returnLastSegment.arrival.at).toLocaleTimeString('ko-KR', { 
                                                                            hour: '2-digit', 
                                                                            minute: '2-digit',
                                                                            hour12: false 
                                                                        }) : '--:--'
                                                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                                                )}
                                                <div className={styles.baggageInfo}>
                                                    {(() => {
                                                        const baggageInfo = getBaggageInfo(flight)
                                                        
                                                        if (baggageInfo) {
                                                            return `무료 위탁수하물 ${baggageInfo.quantity}개${(baggageInfo.weight ?? 0) > 0 ? ` (${baggageInfo.weight}${baggageInfo.weightUnit})` : ''}`
                                                        } else {
                                                            return '무료 위탁수하물 불포함'
                                                        }
                                                    })()}
                        </div>
                        </div>
                                            <div className={styles.priceSection}>
                                                <div className={styles.price}>
                                                    {price}원
                    </div>
                                                <button className={styles.selectButton}>선택</button>
                </div>
            </div>
                                    )
                                })
                            ) : searchResults.data && searchResults.data.length > 0 ? (
                                <div className={styles.noResults}>
                                    <RiSearch2Line className={styles.noResultsIcon} />
                                    <p>조건에 맞는 데이터가 없습니다</p>
                                </div>
                            ) : (
                                <div className={styles.noResults}>
                                    <RiSearch2Line className={styles.noResultsIcon} />
                                    <p>검색 결과가 없습니다.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 가격 결과 */}
            {pricedData && (
                <div className={styles.pricingResults}>
                    <h2>Priced Flight Offers</h2>
                    <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '400px' }}>
                        {JSON.stringify(pricedData, null, 2)}
                    </pre>
                </div>
            )}


            {/* 추천 여행지 섹션 - 검색 결과가 없고 로딩 중이 아닐 때만 표시 */}
            {!searchResults && !loading && (
                <div className={styles.recommendedSection}>
                    <h2 className={styles.sectionTitle}>
                        <RiMapPinLine className={styles.titleIcon} />
                        추천 여행지
                    </h2>
                
                {/* 필터 탭 */}
                {/* <div className={styles.filterTabs}>
                    <button className={`${styles.filterTab} ${styles.active}`}>오사카</button>
                    <button className={styles.filterTab}>도쿄</button>
                    <button className={styles.filterTab}>삿포로</button>
                </div> */}

                {/* 여행지 카드들 */}
                <div 
                    className={styles.destinationCards}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleMouseUp}
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                >
                    {destinations.map((destination, index) => (
                        <DestinationCard
                            key={index}
                            title={destination.title}
                            image={destination.image}
                            rating={destination.rating}
                            reviewCount={destination.reviewCount}
                            price={destination.price}
                            isPromotional={destination.isPromotional}
                            onClick={() => {
                                if (destination.isPromotional) {
                                    // 인기 여행지 클릭 시 특별한 동작
                                    console.log('인기 여행지 클릭')
                                } else {
                                    // 일반 여행지 클릭 시 해당 도시로 검색 조건 설정
                                    setArrivalCity(destination.title)
                                }
                            }}
                        />
                    ))}
                </div>
            </div>
            )}

            {/* 플로팅 상담 버튼 */}
            {/* <div className={styles.floatingButton}>
                <RiCustomerService2Line />
                <span>상담</span>
            </div> */}
        </div>
    )
}

export default FlightsDesktop   