import { Route, Routes } from 'react-router-dom'
import './assets/global.css'
import OrderPage from './pages/OrderPage'
import DetailOrder from './pages/DetailOrder'
import Dashboard from './pages/Dashboard'
import AdminPage from './pages/AdminPage'

export default function App() {
  return (
    <Routes>
      {/* <Route path='/' element={  }/> */}
      <Route path='/' element={ <Dashboard /> } />
      <Route path='/admin' element={ <AdminPage />} />
    </Routes>
  )
}
