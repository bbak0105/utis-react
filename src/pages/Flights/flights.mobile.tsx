'use client'

import React, { useRef } from 'react'
import { useFlightContext } from '../../contexts/FlightContext'
import styles from './FlightsMobile.module.scss'
import { RiSearchLine, RiSuitcaseLine, RiArrowDownSLine } from 'react-icons/ri'
import useScrollAnimation from '../../utils/hooks/useScrollAnimation'
import MobileCitySelector from '../../components/MobileCitySelector'
import MobileDateSelector from '../../components/MobileDateSelector'
import MobilePassengerSelector from '../../components/MobilePassengerSelector'
import { type FlightOffersSearchResponse } from '../../api/types'
import { searchFlights, SearchFlightsParams } from '../../api/flights'
import { 
    getAirlineName, 
    calculateDuration, 
    getBaggageInfo, 
    getCityCode,
    getTravelClass
} from './shared'

const FlightsMobile = () => {
    const { 
        searchParams, 
        searchResults, 
        loading, 
        passengers,
        setSearchParams,
        setSearchResults,
        setLoading 
    } = useFlightContext()
    
    const titleRef = useScrollAnimation<HTMLHeadingElement>({ threshold: 0.2 })
    const searchResultsRef = useRef<HTMLDivElement>(null)
    
    // 도시 목록
    const cities = [
        '서울(인천)', '김포', '제주도', '부산', '대구', '광주', '울산', '무안',
        '도쿄', '오사카', '후쿠오카', '삿포로', '오키나와', '나고야', '다카마쓰', '고베', '기타큐슈',
        '호치민', '하노이', '다낭',
        '방콕', '치앙마이', '푸켓'
    ]

    // 헬퍼들은 shared에서 사용
    
    // 검색 함수
    const handleSearch = async () => {
        setLoading(true)
        // 검색 버튼 클릭 시 바로 결과 영역으로 스크롤(약간의 상단 여백 포함)
        setTimeout(() => {
            if (searchResultsRef.current) {
                const target = searchResultsRef.current
                const offset = -120
                const y = target.getBoundingClientRect().top + window.pageYOffset + offset
                window.scrollTo({ top: y, behavior: 'smooth' })
            }
        }, 100)
        
        try {
            const formatDate = (date: Date | null): string => {
                if (!date) return ''
                return date.toISOString().split('T')[0]
            }

            const apiParams: SearchFlightsParams = {
                origin: getCityCode(searchParams.departureCity),
                destination: getCityCode(searchParams.arrivalCity),
                departureDate: formatDate(searchParams.departureDate),
                adults: searchParams.adultCount,
                children: searchParams.childCount > 0 ? searchParams.childCount : undefined,
                infants: searchParams.infantCount > 0 ? searchParams.infantCount : undefined,
                max: 20,
                currencyCode: 'KRW',
                travelClass: getTravelClass(searchParams.selectedSeatClass)
            }

            if (searchParams.activeTab === 'round' && searchParams.returnDate) {
                apiParams.returnDate = formatDate(searchParams.returnDate)
            }

            console.log('모바일 검색 파라미터:', apiParams)
            
            // 필수 파라미터 확인
            if (!apiParams.origin || !apiParams.destination || !apiParams.departureDate) {
                throw new Error('필수 검색 조건이 누락되었습니다.')
            }
            
            if (!apiParams.adults || apiParams.adults < 1) {
                throw new Error('성인 승객 수를 확인해주세요.')
            }
            
            const result: FlightOffersSearchResponse = await searchFlights(apiParams)
            console.log('모바일 검색 결과:', result)
            setSearchResults(result)
        } catch (error) {
            console.error('모바일 검색 에러:', error)
            const errorMessage = error instanceof Error ? error.message : '항공권 검색 중 오류가 발생했습니다.'
            console.error('에러 상세:', error)
            alert(`항공권 검색 오류: ${errorMessage}`)
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <h1 
                    ref={titleRef.ref}
                    className={`${styles.pageTitle} ${titleRef.isVisible ? styles.animateIn : styles.animateOut}`}
                >
                    항공권 검색
                </h1>
            </div>
            
            {/* 모바일용 검색 폼 */}
            <div className={styles.searchCard}>
                <div className={styles.tabContainer}>
                    <button 
                        className={`${styles.tab} ${searchParams.activeTab === 'round' ? styles.active : ''}`}
                        onClick={() => setSearchParams(prev => ({ ...prev, activeTab: 'round' }))}
                    >
                        왕복
                    </button>
                    <button 
                        className={`${styles.tab} ${searchParams.activeTab === 'oneway' ? styles.active : ''}`}
                        onClick={() => setSearchParams(prev => ({ ...prev, activeTab: 'oneway' }))}
                    >
                        편도
                    </button>
                </div>
                
                <div className={styles.inputFields}>
                    <MobileCitySelector
                        label="출발"
                        value={searchParams.departureCity}
                        onChange={(city) => setSearchParams(prev => ({ ...prev, departureCity: city }))}
                        cities={cities}
                    />
                    
                    <MobileCitySelector
                        label="도착"
                        value={searchParams.arrivalCity}
                        onChange={(city) => setSearchParams(prev => ({ ...prev, arrivalCity: city }))}
                        cities={cities}
                    />
                    
                    <MobileDateSelector
                        label={searchParams.activeTab === 'oneway' ? '출발 날짜' : '여행 날짜'}
                        departureDate={searchParams.departureDate}
                        returnDate={searchParams.returnDate}
                        activeTab={searchParams.activeTab}
                        onDateChange={(departure, returnDate) => setSearchParams(prev => ({ 
                            ...prev, 
                            departureDate: departure, 
                            returnDate: returnDate 
                        }))}
                    />
                    
                    <MobilePassengerSelector
                        label="승객"
                        adultCount={searchParams.adultCount}
                        childCount={searchParams.childCount}
                        infantCount={searchParams.infantCount}
                        selectedSeatClass={searchParams.selectedSeatClass}
                        onPassengerChange={(adults, children, infants, seatClass) => setSearchParams(prev => ({ 
                            ...prev, 
                            adultCount: adults, 
                            childCount: children, 
                            infantCount: infants, 
                            selectedSeatClass: seatClass 
                        }))}
                    />
                </div>
                
                <button className={styles.searchButton} onClick={handleSearch} disabled={loading}>
                    <RiSearchLine className={styles.searchIcon} />
                    {loading ? '검색 중...' : '항공권 검색'}
                </button>
            </div>
            
            {/* 로딩 상태 */}
            {loading && (
                <div className={styles.searchResults} ref={searchResultsRef}>
                    <div className={styles.loadingPlaceholder}>
                        <div className={styles.loadingCard}>
                            <div className={styles.loadingContent}>
                                <div className={styles.loadingLine}></div>
                                <div className={styles.loadingLine}></div>
                                <div className={styles.loadingLine}></div>
                            </div>
                            <div className={styles.loadingPrice}>
                                <div className={styles.loadingLine}></div>
                            </div>
                        </div>
                        <div className={styles.loadingCard}>
                            <div className={styles.loadingContent}>
                                <div className={styles.loadingLine}></div>
                                <div className={styles.loadingLine}></div>
                                <div className={styles.loadingLine}></div>
                            </div>
                            <div className={styles.loadingPrice}>
                                <div className={styles.loadingLine}></div>
                            </div>
                        </div>
                        <div className={styles.loadingCard}>
                            <div className={styles.loadingContent}>
                                <div className={styles.loadingLine}></div>
                                <div className={styles.loadingLine}></div>
                                <div className={styles.loadingLine}></div>
                            </div>
                            <div className={styles.loadingPrice}>
                                <div className={styles.loadingLine}></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 검색 결과 */}
            {searchResults && !loading && (
                <div className={styles.searchResults} ref={searchResultsRef}>
                    <h2>검색 결과: {searchResults.data?.length || 0}건</h2>
                    {searchResults.data && searchResults.data.length > 0 ? (
                        <div className={styles.flightsList}>
                            {searchResults.data.slice(0, 20).map((flight: any, index: number) => {
                                const outboundSegments = flight.itineraries?.[0]?.segments || []
                                const returnSegments = flight.itineraries?.[1]?.segments || []
                                const airlineCode = outboundSegments[0]?.carrierCode || flight.validatingAirlineCodes?.[0]
                                const returnAirlineCode = returnSegments[0]?.carrierCode || flight.validatingAirlineCodes?.[0]
                                
                                const baggageInfo = getBaggageInfo(flight)
                                const baggageText = baggageInfo
                                    ? (() => {
                                        const count = baggageInfo.pieces ?? 0
                                        if (count <= 0) return '무료 위탁수하물 불포함'
                                        return `무료 위탁수하물 ${count}개${baggageInfo.weightKg && baggageInfo.weightKg > 0 ? ` (${baggageInfo.weightKg}KG)` : ''}`
                                      })()
                                    : '무료 위탁수하물 불포함'

                                return (
                                    <div key={index} className={styles.flightCard}>
                                        <div className={styles.flightCardRow}>
                                        {/* 출발 정보 */}
                                        <div className={styles.departureInfo}>
                                            <div className={styles.time}>{outboundSegments[0]?.departure?.at?.split('T')[1]?.substring(0, 5)}</div>
                                            <div className={styles.airport}>{outboundSegments[0]?.departure?.iataCode}</div>
                                            <div className={styles.baggageInfo}>
                                                <RiSuitcaseLine className={styles.baggageIcon} />
                                                <span>{baggageText}</span>
                                            </div>
                                            <div className={styles.paymentMethod}>신한카드</div>
                                        </div>

                                        {/* 비행 경로 및 시간 */}
                                        <div className={styles.flightPath}>
                                            <div className={styles.pathLine}>
                                                <div className={styles.pathDot}></div>
                                            </div>
                                            <div className={styles.duration}>
                                                {calculateDuration(
                                                    outboundSegments[0]?.departure?.at,
                                                    outboundSegments[outboundSegments.length - 1]?.arrival?.at
                                                )}
                                            </div>
                                        </div>

                                        {/* 도착 정보 */}
                                        <div className={styles.arrivalInfo}>
                                            <div className={styles.time}>
                                                {outboundSegments[outboundSegments.length - 1]?.arrival?.at?.split('T')[1]?.substring(0, 5)}
                                            </div>
                                            <div className={styles.airport}>
                                                {outboundSegments[outboundSegments.length - 1]?.arrival?.iataCode}
                                            </div>
                                            <div className={styles.airlineInfo}>
                                                <span className={styles.airlineName}>
                                                    {getAirlineName(airlineCode)}
                                                </span>
                                                {outboundSegments.length > 1 && (
                                                    <span className={styles.layover}>
                                                        {outboundSegments.length - 1}회 경유
                                                    </span>
                                                )}
                                                {flight.validatingAirlineCodes && flight.validatingAirlineCodes.length > 1 && (
                                                    <span className={styles.codeshare}>공동운항</span>
                                                )}
                                            </div>
                                        </div>
                                        </div>

                                        {/* 가격 정보 */}
                                        <div className={styles.priceSection}>
                                            <div className={styles.priceContainer}>
                                                <div className={styles.price}>
                                                    ₩{flight.price?.total ? parseInt(flight.price.total).toLocaleString() : 'N/A'}
                                                </div>
                                                <RiArrowDownSLine className={styles.priceArrow} />
                                            </div>
                                            <button className={styles.selectButton}>선택</button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <p>검색 결과가 없습니다.</p>
                    )}
                </div>
            )}
        </div>
    )
}

export default FlightsMobile