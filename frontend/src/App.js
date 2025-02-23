import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Mood from './pages/Mood'
import Signup from './pages/Signup'
import './App.css'
import Administrator from './pages/Administrator'


export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mood" element={<Mood />} />
          <Route path="/administrator" element={<Administrator/>} />
=======
          <Route path="/signup" element={<Signup />} />
          
>>>>>>> Stashed changes
        </Routes>
      </BrowserRouter>
    </div>
  )
}