import './App.css'
import { Join } from './components/Join'
import { Messages } from './components/Messages'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SpeedInsights } from "@vercel/speed-insights/next";

function App() {
  return (
    <>
      <div className='bg-[#13151A] min-h-screen flex justify-center items-center'>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Join/>}/>
            <Route path='/messages' element={<Messages/>}/>
          </Routes>
        </BrowserRouter>
      </div>
      <SpeedInsights />
    </>
  )
}

export default App
