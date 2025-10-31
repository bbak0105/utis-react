import { ASIAN_AIRLINES, CITY_IATA_MAP, type FlightOffer } from '../../api/types'

export const getTravelClass = (korean: string): string => {
  switch (korean) {
    case '일반석':
      return 'ECONOMY'
    case '프리미엄 일반석':
      return 'PREMIUM_ECONOMY'
    case '비즈니스석':
      return 'BUSINESS'
    case '퍼스트석':
      return 'FIRST'
    default:
      return 'ECONOMY'
  }
}

export const getCityCode = (cityName: string): string => {
  return (CITY_IATA_MAP as Record<string, string>)[cityName] ?? cityName
}

export const normalizeAirlineCode = (code: string | undefined | null): string => {
  if (!code) return ''
  return code === 'HR' ? 'YP' : code
}

export const getAirlineName = (code: string | undefined | null): string => {
  if (!code) return ''
  const normalized = normalizeAirlineCode(code)
  const entry = (ASIAN_AIRLINES as any)[normalized]
  return entry?.nameKo ?? normalized
}

export const calculateDuration = (
  departureAt?: string | null,
  arrivalAt?: string | null
): string => {
  if (!departureAt || !arrivalAt) return ''
  const start = new Date(departureAt)
  const end = new Date(arrivalAt)
  const diffMs = Math.max(0, end.getTime() - start.getTime())
  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}시간 ${mins}분`
}

export const getBaggageInfo = (flight: FlightOffer) => {
  // travelerPricings[].fareDetailsBySegment[] 에 포함된 수하물 정보를 모읍니다.
  const travelerPricings = flight.travelerPricings ?? []
  let includedPieces: number | null = null
  let includedWeight: number | null = null

  travelerPricings.forEach(tp => {
    const details = tp.fareDetailsBySegment ?? []
    details.forEach(d => {
      const checked = d.includedCheckedBags as
        | { weight?: number; weightUnit?: string; quantity?: number }
        | undefined
      if (checked?.quantity != null) {
        includedPieces = Math.max(includedPieces ?? 0, checked.quantity)
      }
      if (checked?.weight != null) {
        includedWeight = Math.max(includedWeight ?? 0, checked.weight)
      }
    })
  })

  if (includedPieces == null && includedWeight == null) return null
  return { pieces: includedPieces ?? 0, weightKg: includedWeight ?? undefined }
}

export const formatCombinedDate = (departure: Date | null, returnDate: Date | null): string => {
  const format = (date: Date) =>
    date.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit', weekday: 'short' })
  if (!departure) return ''
  if (!returnDate) return format(departure)
  return `${format(departure)} ~ ${format(returnDate)}`
}


