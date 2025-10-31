import type { FlightOffersSearchResponse, FlightOffer, FlightSearchQuery } from '../type'

const API_BASE_URL = 'http://localhost:3001'

export async function searchFlights(params: FlightSearchQuery): Promise<FlightOffersSearchResponse> {
  const url = new URL('/api/flights', API_BASE_URL)
  Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.set(k, String(v)))
  const r = await fetch(url.toString())
  if (!r.ok) throw new Error(await r.text())
  return r.json() as Promise<FlightOffersSearchResponse>
}

export async function getFlightPrices(flightOffers: FlightOffer[]): Promise<FlightOffersSearchResponse> {
  const url = new URL('/api/flight-prices', API_BASE_URL)
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
