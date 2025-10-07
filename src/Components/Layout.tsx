import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

export default function Layout() {
  return (<>
      <Navbar/>
      <div className='min-h-dvh'>
        <Outlet></Outlet>
      </div>
      <Footer/>
  </>
  )
}
