import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Delete from './Delete'

const AllBooks = () => {
    const [allBooks, setAllBooks] = useState([])
    useEffect(()=>{

    },[])
    return (
        <div className='w-11/12 mx-auto h-screen bg-neutral-300 p-2'>
            <div className='py-2'>
                <h2 className='text-3xl font-semibold text-center'>Book Store Management</h2>
            </div>
            <div className='mt-3'>
                <nav className='flex justify-between'>
                    <Link to={'/books/new'}><button className='border mx-1 capitalize bg-blue-500 text-white px-3 py-2 rounded-xl shadow-2xl'>register new book</button></Link>
                    <Link to='/logout'><button className='border mx-1 capitalize bg-blue-500 text-white px-3 py-2 rounded-xl shadow-2xl'>logout</button></Link>
                </nav>
            </div>
            <div>
                {/* // Render all books */}
                <Delete/>
            </div>
        </div>
    )
}

export default AllBooks