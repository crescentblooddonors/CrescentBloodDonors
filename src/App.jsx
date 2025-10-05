import { Route, Routes } from 'react-router-dom'
import './App.css'
import BecomeADonor from './pages/BecomeADonor'
import ComingSoon from './pages/ComingSoon'
import Home from './pages/Home'

function App() {
  return (
    <>
      {/* <ComingSoon /> */}
      {/* <BecomeADonor /> */}
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/donate' element={<BecomeADonor />}/>
      </Routes>

    </>
  )
}

export default App
