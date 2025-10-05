import { Route, Routes } from 'react-router-dom'
import './App.css'
import BecomeADonor from './pages/BecomeADonor'
import ComingSoon from './pages/ComingSoon'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { useCookies } from 'react-cookie'
import AdminDashboard from './pages/Admin'

function App() {
  const [cookie] = useCookies()
  return (
    <>
      {/* <ComingSoon /> */}
      {/* <BecomeADonor /> */}
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/donate' element={<BecomeADonor />}/>
        <Route path='/auth' element={<Auth />}/>
        <Route path='/admin' element={<AdminDashboard />}/>
      </Routes>

    </>
  )
}

export default App
