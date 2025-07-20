import './App.css'
import { Join } from './components/Join'
import { Messages } from './components/Messages'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
   
    <div className='bg-cyan-700 min-h-screen flex justify-center items-center'>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Join/>}/>
        <Route path='/messages' element={<Messages/>}/>
      </Routes>
    </BrowserRouter>
      
    </div>
      
      
    </>
  )
}

export default App
