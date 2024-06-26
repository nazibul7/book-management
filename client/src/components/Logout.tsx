import axios from "axios"
import Cookie from 'js-cookie'
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const Logout = () => {
    const [message, setMessage] = useState('')
    const navigate = useNavigate()
    useEffect(() => {
        const logoutUser = async () => {
            const token = Cookie.get('checkToken')
            if (token) {
                const response = await axios.post('http://localhost:4000/api/v1/users/logout', token, { withCredentials: true })
                // setMessage(response)
                console.log(response.data.message);
                setMessage(response.data.message)
                // alert(response.data.message)
                navigate('/signin')
            }
            else {
                console.log(false);
            }
        }
        logoutUser()
    }, [])
    // backend call for logout to clear token
    return (
        <div>{message}</div>
    )
}

export default Logout