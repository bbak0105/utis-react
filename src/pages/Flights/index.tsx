
'use client'

import useBreakpoint from '../../utils/hooks/useBreakpoint'
import FlightsDesktop from './flights.desktop'
import FlightsMobile from './flights.mobile'
import { FlightProvider } from '../../contexts/FlightContext'

const Flights = () => {
    const { bp } = useBreakpoint()
    // 모바일: md(768px) 미만
    const isMobile = bp === 'xs' || bp === 'sm'
    
    return (
        <FlightProvider>
            {isMobile ? <FlightsMobile /> : <FlightsDesktop />}
        </FlightProvider>
    )
}

export default Flights



// 'use client'

// import { useEffect, useState } from 'react'
// import { searchFlights, getFlightPrices } from '../../api/flights'
// // @ts-ignore: Fix import when types are available
// // TODO: Replace 'any' with actual FlightOffersSearchResponse type when available
// type FlightOffersSearchResponse = any

// const Flights = () => {
//     const [data, setData] = useState<FlightOffersSearchResponse | null>(null)
//     const [pricedData, setPricedData] = useState<FlightOffersSearchResponse | null>(null)
//     const [loading, setLoading] = useState(true)
//     const [pricingLoading, setPricingLoading] = useState(false)

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 // 현재 날짜로부터 30일 후의 날짜 생성
//                 const departureDate = new Date()
//                 departureDate.setDate(departureDate.getDate() + 30)
//                 const formattedDate = departureDate.toISOString().split('T')[0] // YYYY-MM-DD 형식
                
//                 const result = await searchFlights({
//                     origin: 'ICN',
//                     destination: 'NGO',
//                     departureDate: formattedDate,
//                     adults: 1,
//                     currencyCode: 'KRW',
//                 })
//                 setData(result)
//                 console.log('Flight search result:', result)
//             } catch (error) {
//                 console.error('Error fetching flights:', error)
//                 console.error('Error details:', error)
//             } finally {
//                 setLoading(false)
//             }
//         }

//         fetchData()
//     }, [])

//     const handleGetPrices = async () => {
//         if (!data?.data) return
        
//         setPricingLoading(true)
//         try {
//             // Amadeus API는 최대 6개의 flightOffers만 허용
//             const limitedOffers = data.data.slice(0, 6)
//             const result = await getFlightPrices(limitedOffers)
//             setPricedData(result)
//             console.log('Priced data (세금 세부내역 포함):', result)
//         } catch (error) {
//             console.error('Error getting flight prices:', error)
//         } finally {
//             setPricingLoading(false)
//         }
//     }

//     if (loading) {
//         return <div>Loading...</div>
//     }

//     return (
//         <div style={{ padding: '20px' }}>
//             <h1>Flight Search Results</h1>
            
//             {data && (
//                 <div>
//                     <p>Found {data.data?.length || 0} flights</p>
//                     <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
//                         💡 검색 결과에는 세금 세부내역(taxes)이 없습니다. 
//                         "Get Accurate Prices" 버튼을 눌러 유류할증료, 공항세 등 세부 내역을 확인하세요!
//                     </p>
//                     <button 
//                         onClick={handleGetPrices}
//                         disabled={pricingLoading}
//                         style={{
//                             padding: '10px 20px',
//                             backgroundColor: pricingLoading ? '#ccc' : '#007bff',
//                             color: 'white',
//                             border: 'none',
//                             borderRadius: '5px',
//                             cursor: pricingLoading ? 'not-allowed' : 'pointer',
//                             marginTop: '10px',
//                             fontSize: '14px',
//                             fontWeight: 'bold'
//                         }}
//                     >
//                         {pricingLoading ? '가격 조회 중...' : '🔍 Get Accurate Prices (세금 세부내역 확인)'}
//                     </button>
//                 </div>
//             )}

//             {pricedData && (
//                 <div style={{ marginTop: '20px', border: '2px solid #28a745', padding: '15px', borderRadius: '5px' }}>
//                     <h2 style={{ color: '#28a745' }}>✅ Priced Flight Offers (세금 세부내역 포함)</h2>
//                     <p style={{ fontSize: '14px', color: '#666' }}>
//                         이제 taxes 배열에서 유류할증료(YQ/YR), 공항세(BP), 보안세(SW) 등을 확인할 수 있습니다!
//                     </p>
//                     <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '600px', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
//                         {JSON.stringify(pricedData, null, 2)}
//                     </pre>
//                 </div>
//             )}

//             {data && !pricedData && (
//                 <div style={{ marginTop: '20px' }}>
//                     <h2>Flight Search Results (기본 검색 결과)</h2>
//                     <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '600px', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
//                         {JSON.stringify(data, null, 2)}
//                     </pre>
//                 </div>
//             )}
//         </div>
//     )
// }

// export default Flights