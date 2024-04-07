import { Link, Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='w-full h-screen flex flex-col justify-center items-center'>
      <Outlet />
      <div>
        <Link to={'/signin'}><button className='border mx-1 bg-blue-500 text-white px-3 py-2 rounded-xl shadow-2xl'>Sign in</button></Link>
        <Link to='/signup'><button className='border mx-1 bg-blue-500 text-white px-3 py-2 rounded-xl shadow-2xl'>Sign Up</button></Link>
      </div>
    </div>
  )
}

export default Layout