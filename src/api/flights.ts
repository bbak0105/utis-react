import type { FlightOffersSearchResponse, FlightOffer } from './types'

// API Base URL 설정
// 개발 환경: Vite 프록시를 사용하기 위해 window.location.origin 사용
// 프로덕션: VITE_API_URL 환경 변수 또는 window.location.origin 사용
const getApiBaseUrl = () => {
  // 환경 변수가 설정되어 있으면 그것을 사용 (프로덕션 배포용)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // 브라우저 환경에서는 window.location.origin 사용
  // 개발 환경에서는 Vite 프록시가 /api를 localhost:3001로 전달
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // SSR 환경의 경우 (필요시)
  return ''
}

export interface SearchFlightsParams {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  adults?: number
  children?: number
  infants?: number
  max?: number
  currencyCode?: string
  travelClass?: string
  maxPrice?: number
  includedAirlineCodes?: string
  excludedAirlineCodes?: string
  nonStop?: boolean
}

export async function searchFlights(params: SearchFlightsParams): Promise<FlightOffersSearchResponse> {
  const url = new URL('/api/flights', getApiBaseUrl())
  Object.entries(params).forEach(([k, v]) => {
    // null, undefined, 빈 문자열이 아닌 경우에만 파라미터 추가
    if (v != null && v !== '' && v !== undefined) {
      url.searchParams.set(k, String(v))
    }
  })
  const r = await fetch(url.toString())
  if (!r.ok) throw new Error(await r.text())
  return r.json() as Promise<FlightOffersSearchResponse>
}

export async function getFlightPrices(flightOffers: FlightOffer[]): Promise<FlightOffersSearchResponse> {
  const url = new URL('/api/flight-prices', getApiBaseUrl())
  const r = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ flightOffers })
  })
  if (!r.ok) throw new Error(await r.text())
  return r.json() as Promise<FlightOffersSearchResponse>
}
