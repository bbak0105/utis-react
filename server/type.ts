export const ASIAN_AIRLINES = {
  // 🇰🇷 한국
  'KE': { name: 'KOREAN AIR', nameKo: '대한항공', country: 'KR' },
  'OZ': { name: 'ASIANA AIRLINES', nameKo: '아시아나항공', country: 'KR' },
  '7C': { name: 'JEJU AIR', nameKo: '제주항공', country: 'KR' },
  'TW': { name: "T'WAY AIR", nameKo: '티웨이항공', country: 'KR' },
  'LJ': { name: 'JIN AIR', nameKo: '진에어', country: 'KR' },
  'BX': { name: 'AIR BUSAN', nameKo: '에어부산', country: 'KR' },
  'RS': { name: 'AIR SEOUL', nameKo: '에어서울', country: 'KR' },
  'YP': { name: 'AIR PREMIA', nameKo: '에어프레미아', country: 'KR' },
  'RF': { name: 'AERO K AIRLINES', nameKo: '에어로케이', country: 'KR' },
  '4V': { name: 'FLY GANGWON', nameKo: '플라이강원', country: 'KR' },
  'ZE': { name: 'EASTAR JET', nameKo: '이스타항공', country: 'KR' },

  // 🇯🇵 일본
  'JL': { name: 'JAPAN AIRLINES', nameKo: '일본항공', country: 'JP' },
  'NH': { name: 'ALL NIPPON AIRWAYS', nameKo: '전일본공수(ANA)', country: 'JP' },
  'MM': { name: 'PEACH AVIATION', nameKo: '피치항공', country: 'JP' },
  'BC': { name: 'SKYMARK AIRLINES', nameKo: '스카이마크항공', country: 'JP' },
  'GK': { name: 'JETSTAR JAPAN', nameKo: '젯스타 재팬', country: 'JP' },
  '7G': { name: 'STAR FLYER', nameKo: '스타플라이어', country: 'JP' },
  'ZG': { name: 'ZIPAIR TOKYO', nameKo: '지퍼에어 도쿄', country: 'JP' },
  'NQ': { name: 'AIR JAPAN', nameKo: '에어재팬', country: 'JP' },
  'IJ': { name: 'SPRING JAPAN', nameKo: '스프링 재팬', country: 'JP' },
  'EH': { name: 'ANA WINGS', nameKo: 'ANA 윙즈', country: 'JP' },

  // 🇻🇳 베트남
  'VN': { name: 'VIETNAM AIRLINES', nameKo: '베트남항공', country: 'VN' },
  'VJ': { name: 'VIETJET AIR', nameKo: '비엣젯항공', country: 'VN' },
  'QH': { name: 'BAMBOO AIRWAYS', nameKo: '밤부항공', country: 'VN' },
  'BL': { name: 'JETSTAR PACIFIC', nameKo: '젯스타 퍼시픽', country: 'VN' },

  // 🇹🇭 태국
  'TG': { name: 'THAI AIRWAYS', nameKo: '타이항공', country: 'TH' },
  'FD': { name: 'THAI AIRASIA', nameKo: '타이 에어아시아', country: 'TH' },
  'DD': { name: 'NOK AIR', nameKo: '녹에어', country: 'TH' },
  'PG': { name: 'BANGKOK AIRWAYS', nameKo: '방콕항공', country: 'TH' },
  'WE': { name: 'THAI SMILE', nameKo: '타이스마일', country: 'TH' },
  'SL': { name: 'THAI LION AIR', nameKo: '타이 라이온에어', country: 'TH' },

  // 🌏 기타 (한일 노선 코드셰어/경유)
  'ET': { name: 'ETHIOPIAN AIRLINES', nameKo: '에티오피아항공', country: 'ET' },
  'CA': { name: 'AIR CHINA', nameKo: '중국국제항공', country: 'CN' },
  'MU': { name: 'CHINA EASTERN AIRLINES', nameKo: '중국동방항공', country: 'CN' },
  'CZ': { name: 'CHINA SOUTHERN AIRLINES', nameKo: '중국남방항공', country: 'CN' },
  'CI': { name: 'CHINA AIRLINES', nameKo: '중화항공', country: 'TW' },
  'BR': { name: 'EVA AIR', nameKo: '에바항공', country: 'TW' },
  'CX': { name: 'CATHAY PACIFIC', nameKo: '캐세이퍼시픽항공', country: 'HK' },
  'SQ': { name: 'SINGAPORE AIRLINES', nameKo: '싱가포르항공', country: 'SG' },
  'MH': { name: 'MALAYSIA AIRLINES', nameKo: '말레이시아항공', country: 'MY' },
  'PR': { name: 'PHILIPPINE AIRLINES', nameKo: '필리핀항공', country: 'PH' },
  '5J': { name: 'CEBU PACIFIC AIR', nameKo: '세부퍼시픽항공', country: 'PH' },
  'BI': { name: 'ROYAL BRUNEI AIRLINES', nameKo: '로열브루나이항공', country: 'BN' },
  'TN': { name: 'AIR TAHITI NUI', nameKo: '에어타히티누이', country: 'PF' },
  'EK': { name: 'EMIRATES', nameKo: '에미레이트항공', country: 'AE' },
  'QR': { name: 'QATAR AIRWAYS', nameKo: '카타르항공', country: 'QA' },
  'AY': { name: 'FINNAIR', nameKo: '핀에어', country: 'FI' },
  'LH': { name: 'LUFTHANSA', nameKo: '루프트한자', country: 'DE' },
} as const;

/**
 * KOREA_IATA
 * ICN: 인천 (Incheon)  
 * GMP: 김포 (Gimpo)
 * PUS: 부산 (Busan)
 * CJU: 제주 (Jeju)
 */
type KOREA_IATA  = 'ICN' | 'GMP' | 'PUS' | 'CJU'

/**
 * JAPAN_IATA
 * NRT: 도쿄 나리타 (Tokyo Narita)
 * HND: 도쿄 하네다 (Tokyo Haneda)
 * KIX: 간사이 (Osaka)  
 * NGO: 나고야 (Nagoya)
 * FUK: 후쿠오카 (Fukuoka)
 * CTS: 신치토세 (Sapporo)
 */
type JAPAN_IATA = 'NRT' | 'HND' | 'KIX' | 'NGO' | 'FUK' | 'CTS'

/**
 * VIETNAM_IATA
 * SGN: 호치민 (Ho Chi Minh City)
 * HAN: 하노이 (Hanoi)
 * DAD: 다낭 (Danang)
 */
type VIETNAM_IATA = 'SGN' | 'HAN' | 'DAD'

/**
 * THAILAND_IATA
 * BKK: 수완나품/방콕 (Bangkok)
 * DMK: 돈므앙/방콕 (Don Mueang)
 * CNX: 치앙마이 (Chiang Mai)
 * HKT: 푸켓 (Phuket)
 */
type Thailand_IATA = 'BKK' | 'DMK' | 'CNX' | 'HKT'

/**
 * 여행 클래스
 * ECONOMY: 이코노미
 * PREMIUM_ECONOMY: 프리미엄 이코노미
 * BUSINESS: 비즈니스
 * FIRST: 퍼스트 클래스
 */
type TravelClass = 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST'

/** 
 * IATA 공항 코드 
 */
export type IATA = KOREA_IATA | JAPAN_IATA | VIETNAM_IATA | Thailand_IATA

/**
 * 도시명을 IATA 코드로 매핑하는 객체
 */
export const CITY_IATA_MAP = {
  // 한국
  '서울(인천)': 'ICN',
  '인천': 'ICN',
  '김포': 'GMP',
  '제주도': 'CJU',
  '제주': 'CJU',
  '부산': 'PUS',
  '대구': 'TAE',
  '광주': 'KWJ',
  '울산': 'USN',
  '무안': 'MWX',
  
  // 일본
  '도쿄': 'NRT',
  '오사카': 'KIX',
  '후쿠오카': 'FUK',
  '삿포로': 'CTS',
  '오키나와': 'OKA',
  '나고야': 'NGO',
  '다카마쓰': 'TAK',
  '고베': 'UKB',
  '기타큐슈': 'KKJ',
  
  // 베트남
  '호치민': 'SGN',
  '하노이': 'HAN',
  '다낭': 'DAD',
  
  // 태국
  '방콕': 'BKK',
  '치앙마이': 'CNX',
  '푸켓': 'HKT'
} as const

/**
 * 항공편 검색 쿼리 파라미터
 */
export interface FlightSearchQuery {
  /** 출발지 IATA 코드 */
  origin: string
  /** 도착지 IATA 코드 */
  destination: string
  /** 출발 날짜 (YYYY-MM-DD) */
  departureDate: string
  /** 귀국 날짜 (YYYY-MM-DD) */
  returnDate?: string
  /** 성인 수 (12세 이상) */
  adults: string
  /** 어린이 수 (2세 이상 12세 미만) */
  children?: string
  /** 유아 수 (2세 미만) */
  infants?: string
  /** 최대 검색 결과 수 */
  max?: string
  /** 통화 코드 (예: KRW, USD) */
  currencyCode?: string
  /** 여행 클래스 */
  travelClass?: TravelClass
  /** 최대 가격 */
  maxPrice?: string
  /** 포함할 항공사 코드 (쉼표로 구분) */
  includedAirlineCodes?: string
  /** 제외할 항공사 코드 (쉼표로 구분) */
  excludedAirlineCodes?: string
  /** 직항 여부 */
  nonStop?: string | boolean
}

/**
 * 항공편 가격 조회 요청
 */
export interface FlightPricesRequest {
  /** 가격을 조회할 항공편 제안 목록 (최대 6개) */
  flightOffers: unknown[]
}

/**
 * Amadeus API 에러
 */
export interface AmadeusError {
  /** 에러 메시지 */
  message: string
  /** 에러 상세 설명 */
  description?: unknown
  /** 에러 코드 */
  code?: string | number
  /** HTTP 상태 코드 */
  status?: number
  /** API 응답 정보 */
  response?: {
    data?: unknown
  }
  /** 스택 트레이스 */
  stack?: string
}

// ============= Flight Offers Search API Response Types =============

/**
 * 에러 발생 위치 정보
 */
export interface IssueSource {
  /** JSON 포인터 경로 */
  pointer?: string
  /** 문제가 된 파라미터 */
  parameter?: string
  /** 올바른 값의 예시 */
  example?: string
}

/**
 * API 경고/에러 정보
 */
export interface Issue {
  /** HTTP 상태 코드 */
  status?: number
  /** 애플리케이션 에러 코드 */
  code?: number
  /** 에러 제목 */
  title?: string
  /** 에러 상세 설명 */
  detail?: string
  /** 에러 발생 위치 */
  source?: IssueSource
}

/**
 * 페이지네이션 링크
 */
export interface CollectionLinks {
  /** 현재 페이지 URL */
  self?: string
  /** 다음 페이지 URL */
  next?: string
  /** 이전 페이지 URL */
  previous?: string
  /** 마지막 페이지 URL */
  last?: string
  /** 첫 페이지 URL */
  first?: string
  /** 상위 레벨 URL */
  up?: string
}

/**
 * 검색 결과 메타데이터
 */
export interface CollectionMeta {
  /** 검색 결과 총 개수 */
  count?: number
  /** 페이지네이션 링크 */
  links?: CollectionLinks
}

/**
 * 출발/도착 정보
 */
export interface FlightEndPoint {
  /** 공항 IATA 코드 (예: ICN, NRT) */
  iataCode?: string
  /** 터미널 번호/이름 */
  terminal?: string
  /** 출발/도착 시간 (ISO 8601: YYYY-MM-DDThh:mm:ss) */
  at?: string
}

/**
 * 항공기 정보
 */
export interface AircraftEquipment {
  /** IATA 항공기 코드 (예: 738 = Boeing 737-800) */
  code?: string
}

/**
 * 운항 항공사 정보
 */
export interface OperatingFlight {
  /** 실제 운항하는 항공사 코드 */
  carrierCode?: string
}

/**
 * CO2 배출량 정보
 */
export interface Co2Emission {
  /** CO2 배출량 */
  weight?: number
  /** 무게 단위 (KG 또는 LB) */
  weightUnit?: string
  /** 해당 좌석 등급 */
  cabin?: TravelClass
}

/**
 * 기술적 경유지 정보
 */
export interface FlightStop {
  /** 경유지 공항 IATA 코드 */
  iataCode?: string
  /** 경유 시간 (ISO 8601 duration) */
  duration?: string
  /** 경유지 도착 시간 */
  arrivalAt?: string
  /** 경유지 출발 시간 */
  departureAt?: string
}

/**
 * 항공편 구간 정보 (한 번의 비행)
 */
export interface Segment {
  /** 구간 ID */
  id?: string
  /** 경유 횟수 (0 = 직항) */
  numberOfStops?: number
  /** EU 블랙리스트 항공사 여부 */
  blacklistedInEU?: boolean
  /** CO2 배출량 정보 */
  co2Emissions?: Co2Emission[]
  /** 출발 정보 */
  departure?: FlightEndPoint
  /** 도착 정보 */
  arrival?: FlightEndPoint
  /** 마케팅 항공사 코드 */
  carrierCode?: string
  /** 항공편 번호 */
  number?: string
  /** 항공기 정보 */
  aircraft?: AircraftEquipment
  /** 실제 운항 항공사 정보 */
  operating?: OperatingFlight
  /** 비행 시간 (ISO 8601 duration) */
  duration?: string
  /** 경유지 목록 */
  stops?: FlightStop[]
}

/**
 * 여정 정보 (편도 또는 왕복의 한 방향)
 */
export interface Itinerary {
  /** 총 소요 시간 (ISO 8601 duration, 예: PT2H10M = 2시간 10분) */
  duration?: string
  /** 항공편 구간 목록 */
  segments?: Segment[]
}

/**
 * 수하물 허용량
 */
export interface BaggageAllowance {
  /** 수하물 개수 */
  quantity?: number
  /** 수하물 무게 */
  weight?: number
  /** 무게 단위 (KG 또는 LB) */
  weightUnit?: string
}

/**
 * 유료 수하물 정보
 */
export interface ChargeableCheckedBags {
  /** 수하물 개수 */
  quantity?: number
  /** 수하물 무게 */
  weight?: number
  /** 무게 단위 */
  weightUnit?: string
  /** 수하물 ID */
  id?: string
}

/**
 * 유료 좌석 정보
 */
export interface ChargeableSeat {
  /** 좌석 ID */
  id?: string
  /** 좌석 번호 (예: 33D) */
  number?: string
}

/**
 * 추가 서비스 유형
 * CHECKED_BAGS: 수하물
 * MEALS: 기내식
 * SEATS: 좌석 선택
 * OTHER_SERVICES: 기타 서비스
 */
export type AdditionalServiceType = 'CHECKED_BAGS' | 'MEALS' | 'SEATS' | 'OTHER_SERVICES'

/**
 * 기타 서비스명
 * PRIORITY_BOARDING: 우선 탑승
 * AIRPORT_CHECKIN: 공항 체크인
 */
export type ServiceName = 'PRIORITY_BOARDING' | 'AIRPORT_CHECKIN'

/**
 * 추가 서비스 항목
 */
export interface AdditionalService {
  /** 서비스 가격 */
  amount?: string
  /** 서비스 유형 */
  type?: AdditionalServiceType
}

/**
 * 추가 서비스 요청
 */
export interface AdditionalServicesRequest {
  /** 유료 수하물 */
  chargeableCheckedBags?: ChargeableCheckedBags
  /** 유료 좌석 */
  chargeableSeat?: ChargeableSeat
  /** 좌석 번호 (deprecated) */
  chargeableSeatNumber?: string
  /** 기타 서비스 목록 */
  otherServices?: ServiceName[]
}

/**
 * 단체 여행 할당 정보
 */
export interface AllotmentDetails {
  /** 투어 이름 */
  tourName?: string
  /** 투어 참조 번호 */
  tourReference?: string
}

/**
 * 가용성 표시자
 * LOCAL_AVAILABILITY: 지역 가용성
 * SUB_OD_AVAILABILITY_1: 하위 구간 가용성 1
 * SUB_OD_AVAILABILITY_2: 하위 구간 가용성 2
 */
export type SliceDiceIndicator = 'LOCAL_AVAILABILITY' | 'SUB_OD_AVAILABILITY_1' | 'SUB_OD_AVAILABILITY_2'

/**
 * 구간별 운임 상세 정보
 */
export interface FareDetailsBySegment {
  /** 해당 구간 ID */
  segmentId?: string
  /** 좌석 등급 */
  cabin?: TravelClass
  /** 운임 기준 코드 */
  fareBasis?: string
  /** 브랜드 운임명 (항공사별 운임 상품명) */
  brandedFare?: string
  /** 예약 클래스 코드 */
  class?: string
  /** 단체 할당 여부 */
  isAllotment?: boolean
  /** 단체 할당 상세 정보 */
  allotmentDetails?: AllotmentDetails
  /** 구간 가용성 표시자 */
  sliceDiceIndicator?: SliceDiceIndicator
  /** 포함된 수하물 */
  includedCheckedBags?: BaggageAllowance
  /** 추가 서비스 */
  additionalServices?: AdditionalServicesRequest
}

/**
 * 수수료 유형
 * TICKETING: 발권 수수료
 * FORM_OF_PAYMENT: 결제 수단 수수료
 * SUPPLIER: 공급자 수수료
 */
export type FeeType = 'TICKETING' | 'FORM_OF_PAYMENT' | 'SUPPLIER'

/**
 * 수수료 정보
 */
export interface Fee {
  /** 수수료 금액 */
  amount?: string
  /** 수수료 유형 */
  type?: FeeType
}

/**
 * 세금 정보
 */
export interface Tax {
  /** 세금 금액 */
  amount?: string
  /** 세금 코드 */
  code?: string
}

/**
 * 가격 정보
 */
export interface Price {
  /** 통화 코드 (예: KRW, USD) */
  currency?: string
  /** 총 금액 (기본 요금 + 세금) */
  total?: string
  /** 기본 요금 (세금 제외) */
  base?: string
  /** 수수료 목록 */
  fees?: Fee[]
  /** 세금 목록 */
  taxes?: Tax[]
  /** 환불 가능한 세금 */
  refundableTaxes?: string
  /** 최종 총 금액 (수수료 포함) */
  grandTotal?: string
  /** 결제 통화 */
  billingCurrency?: string
  /** 추가 서비스 목록 */
  additionalServices?: AdditionalService[]
  /** 가격 마진 (예약 단계에서 사용) */
  margin?: string
}

/**
 * 운임 유형
 * PUBLISHED: 공개 운임
 * NEGOTIATED: 협상 운임
 * CORPORATE: 기업 운임
 */
export type PricingOptionsFareType = 'PUBLISHED' | 'NEGOTIATED' | 'CORPORATE'

/**
 * 가격 옵션
 */
export interface PricingOptions {
  /** 운임 유형 목록 */
  fareType?: PricingOptionsFareType[]
  /** 수하물 포함 운임만 표시 */
  includedCheckedBagsOnly?: boolean
  /** 환불 가능 운임만 표시 */
  refundableFare?: boolean
  /** 제한 없는 운임만 표시 */
  noRestrictionFare?: boolean
  /** 위약금 없는 운임만 표시 */
  noPenaltyFare?: boolean
}

/**
 * 여행자 운임 옵션
 * STANDARD: 일반
 * INCLUSIVE_TOUR: 패키지 투어
 * SPANISH_MELILLA_RESIDENT: 스페인 멜리야 거주자
 * SPANISH_CEUTA_RESIDENT: 스페인 세우타 거주자
 * SPANISH_CANARY_RESIDENT: 스페인 카나리아 거주자
 * SPANISH_BALEARIC_RESIDENT: 스페인 발레아레스 거주자
 * AIR_FRANCE_METROPOLITAN_DISCOUNT_PASS: 에어프랑스 본토 할인 패스
 * AIR_FRANCE_DOM_DISCOUNT_PASS: 에어프랑스 DOM 할인 패스
 * AIR_FRANCE_COMBINED_DISCOUNT_PASS: 에어프랑스 통합 할인 패스
 * AIR_FRANCE_FAMILY: 에어프랑스 가족 할인
 * ADULT_WITH_COMPANION: 동반 성인
 * COMPANION: 동반자
 */
export type TravelerPricingFareOption = 
  | 'STANDARD'
  | 'INCLUSIVE_TOUR'
  | 'SPANISH_MELILLA_RESIDENT'
  | 'SPANISH_CEUTA_RESIDENT'
  | 'SPANISH_CANARY_RESIDENT'
  | 'SPANISH_BALEARIC_RESIDENT'
  | 'AIR_FRANCE_METROPOLITAN_DISCOUNT_PASS'
  | 'AIR_FRANCE_DOM_DISCOUNT_PASS'
  | 'AIR_FRANCE_COMBINED_DISCOUNT_PASS'
  | 'AIR_FRANCE_FAMILY'
  | 'ADULT_WITH_COMPANION'
  | 'COMPANION'

/**
 * 여행자 유형
 * ADULT: 성인 (12세 이상)
 * CHILD: 어린이 (2세 이상 12세 미만)
 * SENIOR: 경로 우대 (60세 이상)
 * YOUNG: 청소년
 * HELD_INFANT: 무릎 위 유아 (좌석 없음, 2세 미만)
 * SEATED_INFANT: 좌석 있는 유아 (2세 미만)
 * STUDENT: 학생
 */
export type TravelerType = 
  | 'ADULT'
  | 'CHILD'
  | 'SENIOR'
  | 'YOUNG'
  | 'HELD_INFANT'
  | 'SEATED_INFANT'
  | 'STUDENT'

/**
 * 여행자별 가격 정보
 */
export interface TravelerPricing {
  /** 여행자 ID */
  travelerId: string
  /** 운임 옵션 */
  fareOption: TravelerPricingFareOption
  /** 여행자 유형 */
  travelerType: TravelerType
  /** 연결된 성인 ID (유아인 경우) */
  associatedAdultId?: string
  /** 여행자별 가격 */
  price?: Price
  /** 구간별 운임 상세 */
  fareDetailsBySegment?: FareDetailsBySegment[]
}

/**
 * 항공편 제안 소스
 * GDS: Global Distribution System (글로벌 예약 시스템)
 */
export type FlightOfferSource = 'GDS'

/**
 * 항공편 제안 (하나의 항공편 옵션)
 */
export interface FlightOffer {
  /** 리소스 타입 (항상 "flight-offer") */
  type: string
  /** 항공편 제안 고유 ID */
  id: string
  /** 데이터 소스 */
  source?: FlightOfferSource
  /** 즉시 발권 필요 여부 */
  instantTicketingRequired?: boolean
  /** 가격 비활성화 여부 (예약 전용) */
  disablePricing?: boolean
  /** 비균질 예약 여부 (여러 PNR 생성) */
  nonHomogeneous?: boolean
  /** 편도 여부 */
  oneWay?: boolean
  /** 결제 카드 필수 여부 */
  paymentCardRequired?: boolean
  /** 마지막 발권 가능 날짜 (YYYY-MM-DD) */
  lastTicketingDate?: string
  /** 마지막 발권 가능 일시 (ISO 8601) */
  lastTicketingDateTime?: string
  /** 예약 가능 좌석 수 (1-9) */
  numberOfBookableSeats?: number
  /** 여정 목록 (편도 1개, 왕복 2개) */
  itineraries?: Itinerary[]
  /** 가격 정보 */
  price?: Price
  /** 가격 옵션 */
  pricingOptions?: PricingOptions
  /** 유효한 항공사 코드 목록 */
  validatingAirlineCodes?: string[]
  /** 여행자별 가격 정보 */
  travelerPricings?: TravelerPricing[]
}

/**
 * 위치 정보
 */
export interface LocationValue {
  /** 도시 코드 */
  cityCode?: string
  /** 국가 코드 */
  countryCode?: string
}

/**
 * 응답에 포함된 참조 데이터 (Dictionary)
 */
export interface Dictionaries {
  /** 위치 정보 (공항/도시 코드별) */
  locations?: Record<string, LocationValue>
  /** 항공기 정보 (기종 코드별 제조사/모델명) */
  aircraft?: Record<string, string>
  /** 통화 정보 (통화 코드별 이름) */
  currencies?: Record<string, string>
  /** 항공사 정보 (항공사 코드별 이름) */
  carriers?: Record<string, string>
}

/**
 * Flight Offers Search API 최종 응답
 */
export interface FlightOffersSearchResponse {
  /** 경고 메시지 목록 */
  warnings?: Issue[]
  /** 검색 결과 메타데이터 */
  meta?: CollectionMeta
  /** 항공편 제안 목록 */
  data?: FlightOffer[]
  /** 참조 데이터 (공항, 항공사, 항공기 정보 등) */
  dictionaries?: Dictionaries
}
