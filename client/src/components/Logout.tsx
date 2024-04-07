import axios from "axios"
import Cookie from 'js-cookie'
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const Logout = () => {
    const [message, setMessage] = useState('')
    const navigate = useNavigate()
    useEffect(() => {
        const logoutUser = async () => {
            const token = Cookie.get('accessToken')
            if(token){
                console.log(true);
            }
            else{
                console.log(false);
                
            }
            const response = await axios.post('http://localhost:5000/api/v1/users/logout',token,{withCredentials:true})
            // setMessage(response)
            console.log(response.data.message);
            setMessage(response.data.message)
            // alert(response.data.message)
            navigate('/signin')
        }
        logoutUser()
    }, [])
    // backend call for logout to clear token
    return (
        <div>{message}</div>
    )
}

export default Logout