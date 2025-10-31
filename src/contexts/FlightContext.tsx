'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { FlightOffersSearchResponse } from '../api/types'

export interface FlightSearchParams {
  departureCity: string
  arrivalCity: string
  departureDate: Date | null
  returnDate: Date | null
  adultCount: number
  childCount: number
  infantCount: number
  selectedSeatClass: string
  activeTab: 'oneway' | 'round'
}

interface FlightContextType {
  // 검색 조건
  searchParams: FlightSearchParams
  setSearchParams: React.Dispatch<React.SetStateAction<FlightSearchParams>>
  
  // 검색 결과
  searchResults: FlightOffersSearchResponse | null
  setSearchResults: React.Dispatch<React.SetStateAction<FlightOffersSearchResponse | null>>
  
  // 로딩 상태
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  
  // 필터 상태
  filters: {
    stops: {
      direct: boolean
      oneStop: boolean
      twoPlusStops: boolean
    }
    baggage: {
      included: boolean
      notIncluded: boolean
    }
    airlines: string[]
    seatClass: {
      economy: boolean
      business: boolean
    }
  }
  setFilters: React.Dispatch<React.SetStateAction<{
    stops: {
      direct: boolean
      oneStop: boolean
      twoPlusStops: boolean
    }
    baggage: {
      included: boolean
      notIncluded: boolean
    }
    airlines: string[]
    seatClass: {
      economy: boolean
      business: boolean
    }
  }>>
  
  // 기타 상태
  passengers: string
  setPassengers: React.Dispatch<React.SetStateAction<string>>
}

const FlightContext = createContext<FlightContextType | undefined>(undefined)

interface FlightProviderProps {
  children: ReactNode
}

export const FlightProvider: React.FC<FlightProviderProps> = ({ children }) => {
  // 검색 조건 초기값
  const [searchParams, setSearchParams] = useState<FlightSearchParams>({
    departureCity: '서울(인천)',
    arrivalCity: '도쿄',
    departureDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 14) // 2주 후
      return date
    })(),
    returnDate: (() => {
      const date = new Date()
      date.setDate(date.getDate() + 21) // 3주 후
      return date
    })(),
    adultCount: 1,
    childCount: 0,
    infantCount: 0,
    selectedSeatClass: '일반석',
    activeTab: 'round'
  })

  // 검색 결과
  const [searchResults, setSearchResults] = useState<FlightOffersSearchResponse | null>(null)
  
  // 로딩 상태
  const [loading, setLoading] = useState(false)
  
  // 필터 상태
  const [filters, setFilters] = useState({
    stops: {
      direct: false,
      oneStop: false,
      twoPlusStops: false
    },
    baggage: {
      included: false,
      notIncluded: false
    },
    airlines: [] as string[],
    seatClass: {
      economy: true,
      business: false
    }
  })
  
  // 승객 텍스트
  const [passengers, setPassengers] = useState('성인 1, 일반석')

  const value: FlightContextType = {
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
  }

  return (
    <FlightContext.Provider value={value}>
      {children}
    </FlightContext.Provider>
  )
}

export const useFlightContext = () => {
  const context = useContext(FlightContext)
  if (context === undefined) {
    throw new Error('useFlightContext must be used within a FlightProvider')
  }
  return context
}
