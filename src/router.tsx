import { createBrowserRouter } from 'react-router-dom'
import { JSX, lazy, Suspense } from 'react'
import AppLayout from '@/layouts/AppLayout'
import NotFound from './pages/NotFound'
import Flights from './pages/Flights'
import Pillow from './pages/Pillow'
import Esim from './pages/Esim'
import Tour from './pages/Tour'

const Home = lazy(() => import('@/pages/Home'))
const Login = lazy(() => import('@/pages/Login'))
const Shower = lazy(() => import('@/pages/Shower'))            
const Adapter = lazy(() => import('@/pages/Adapter'))
const Travel = lazy(() => import('@/pages/Travel'))
const Carrier = lazy(() => import('@/pages/Carrier'))
const ProductDetail = lazy(() => import('@/pages/ProductDetail'))

const withSuspense = (el: JSX.Element) => (
  <Suspense fallback={<div>Loading...</div>}>{el}</Suspense>
)

export const router = createBrowserRouter([
  {
    element: <AppLayout />,        
    children: [
      { index: true, element: withSuspense(<Home />) },
      { path: '/shower', element: withSuspense(<Shower />) },
      { path: '/adapter', element: withSuspense(<Adapter />) },
      { path: '/travel', element: withSuspense(<Travel />) },
      { path: '/carrier', element: withSuspense(<Carrier />) },
      { path: '/product/:id', element: withSuspense(<ProductDetail />) },
      { path: '/flights', element: withSuspense(<Flights />) },
      { path: '/pillow', element: withSuspense(<Pillow />) },
      { path: '/esim', element: withSuspense(<Esim />) },
      { path: '/tour', element: withSuspense(<Tour />) },
      { path: '*', element: withSuspense(<NotFound/>)}
    ],
  },
  {
    path: '/login', 
    element: <Login />
  }
])