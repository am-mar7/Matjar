import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

export default function Layout() {
  return (<>
      <Navbar/>
      <div className='min-h-dvh py-15'>
        <Outlet></Outlet>
      </div>
      <Footer/>
  </>
  )
}
