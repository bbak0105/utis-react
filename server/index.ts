import 'dotenv/config'
import express, { Request, Response } from 'express'
import cors from 'cors'
import Amadeus from 'amadeus'
import { AmadeusError, FlightPricesRequest, FlightSearchQuery } from './type'

const app = express()
app.use(cors({
  origin: [
    'https://travelutis.com',        // 프로덕션 도메인 (HTTPS)
    'http://travelutis.com',         // 프로덕션 도메인 (HTTP, 필요시)
    'https://www.travelutis.com',    // www 서브도메인 (HTTPS)
    'http://www.travelutis.com',     // www 서브도메인 (HTTP, 필요시)
    // 'http://localhost:5173',         // 로컬 개발 환경
    // 'http://localhost:3000',         // 로컬 개발 환경 (대체 Never port)
    /\.netlify\.app$/,               // Netlify 미리보기 배포 (Deploy Previews)
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// API 키 유효성 검증
if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
  console.error('Amadeus API keys are missing! Please check your .env file.')
  process.exit(1)
}

console.log('Amadeus API Keys:', {
  clientId: process.env.AMADEUS_CLIENT_ID ? 'Set' : 'Missing',
  clientSecret: process.env.AMADEUS_CLIENT_SECRET ? 'Set' : 'Missing'
})

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID!,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET!,
  environment: 'TEST' // 명시적으로 TEST 환경 설정
})

app.get('/api/flights', async (req: Request<object, object, object, FlightSearchQuery>, res: Response) => {
  try {
    console.log('Flight API Request:', req.query)
    
    const defaultDate = new Date()
    defaultDate.setDate(defaultDate.getDate() + 7)
    const defaultDateString = defaultDate.toISOString().split('T')[0]

    const {
      /* required */
      origin = 'ICN',
      destination = 'NRT',
      departureDate = defaultDateString,
      adults = '1',
      /* optional */
      returnDate,
      children,
      infants,
      maxPrice,
      max,
      currencyCode,
      travelClass,
      nonStop,
    } = req.query

    console.log('Amadeus API Parameters:', req.query)

    const searchParams: any = {
      /* required */
      originLocationCode: String(origin),
      destinationLocationCode: String(destination),
      departureDate: String(departureDate),
      adults: Number(adults),
      /* optional */
      children: Number(children),
      infants: Number(infants),
      ...(maxPrice && { maxPrice: Number(maxPrice) }),
      max: Number(max),
      currencyCode: String(currencyCode),
      travelClass: String(travelClass),
      nonStop: Boolean(nonStop),
    }

    // returnDate가 있을 때만 추가
    if (returnDate) {
      searchParams.returnDate = String(returnDate)
    }

    const r = await amadeus.shopping.flightOffersSearch.get(searchParams)

    console.log('Amadeus API Response:', r.result)
    res.json(r.result) // { data, dictionaries, meta }
  } catch (error) {
    const e = error as AmadeusError
    console.error('Flight API Error Details:', {
      message: e.message,
      description: e.description,
      code: e.code,
      status: e.status,
      response: e.response?.data,
      stack: e.stack
    })
    
    // Amadeus API 에러 코드 처리
    let statusCode = 500
    if (e.code === 'ClientError' && e.description && Array.isArray(e.description)) {
      // Amadeus API 에러의 경우 첫 번째 에러의 status 사용
      const firstError = e.description[0] as { status?: number }
      statusCode = firstError?.status || 400
    } else if (typeof e.code === 'number') {
      statusCode = e.code
    }
    
    res.status(statusCode).json({ 
      message: e.description || e.message || 'Amadeus error',
      error: e.message,
      code: e.code,
      status: e.status,
      details: e.response?.data
    })
  }
})

// Flight Prices API - 특정 항공편의 정확한 가격 조회 (실제 예약 전 사용)
app.post('/api/flight-prices', async (req: Request<object, object, FlightPricesRequest>, res: Response) => {
  try {
    console.log('Flight Prices API Request:', req.body)
    
    const { flightOffers } = req.body
    
    if (!flightOffers || !Array.isArray(flightOffers) || flightOffers.length === 0) {
      return res.status(400).json({ 
        message: 'flightOffers array is required',
        error: 'Missing or invalid flightOffers data'
      })
    }

    console.log('Amadeus Flight Prices API Parameters:', {
      flightOffers: flightOffers.length + ' offers'
    })

    const r = await amadeus.shopping.flightOffers.pricing.post({
      data: {
        type: 'flight-offers-pricing',
        flightOffers: flightOffers
      }
    })

    console.log('Amadeus Flight Prices API Response:', r.result)
    res.json(r.result)
  } catch (error) {
    const e = error as AmadeusError
    console.error('Flight Prices API Error Details:', {
      message: e.message,
      description: e.description,
      code: e.code,
      status: e.status,
      response: e.response?.data,
      stack: e.stack
    })
    
    // Amadeus API 에러 코드 처리
    let statusCode = 500
    if (e.code === 'ClientError' && e.description && Array.isArray(e.description)) {
      // Amadeus API 에러의 경우 첫 번째 에러의 status 사용
      const firstError = e.description[0] as { status?: number }
      statusCode = firstError?.status || 400
    } else if (typeof e.code === 'number') {
      statusCode = e.code
    }
    
    res.status(statusCode).json({ 
      message: e.description || e.message || 'Amadeus Flight Prices error',
      error: e.message,
      code: e.code,
      status: e.status,
      details: e.response?.data
    })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`API server on http://localhost:${PORT}`))
