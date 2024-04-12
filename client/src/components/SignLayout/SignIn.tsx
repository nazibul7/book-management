import axios from "axios"
import React, { useState } from "react"
import { ZodError, ZodType, z } from "zod"
import { handleHttpError } from "../../Utils/handleHttpError"
import { useNavigate } from "react-router-dom"

interface SignInType {
  email: string
  password: string
}
interface FormErrors {
  email?: string
  password?: string
}
const loginSchema: ZodType<SignInType> = z.object({
  email: z.string().email("Invalid email address").trim(),
  password: z.string().min(6)
})
const SignIn = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<SignInType>({ email: "", password: "" })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [errorMessage, setErrorMessage] = useState('')

  const onHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
    setFormErrors({ ...formErrors, [name]: '' })
    setErrorMessage('')
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const data = loginSchema.parse(formData)
      const response = await axios.post('http://localhost:4000/api/v1/users/login', data, { withCredentials: true })
      setErrorMessage("")
      setFormErrors({})
      if (response.status >= 200 && response.status < 300) {
        setFormData({ email: "", password: "" })
        navigate('/books')
        alert(response.data.message)
      }
    } catch (error) {
      if (error instanceof ZodError) {
        setFormErrors(
          Object.fromEntries(
            error.errors.map((error) => {
              return [error.path[0], error.message]
            })
          )
        )
      }
      else if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorMessage = handleHttpError(error.response.status, error.response.data.message || error.response.statusText)
          setErrorMessage(errorMessage)
        }
        else if (error.request) {
          setErrorMessage("No response received")
        }
        else {
          setErrorMessage(error.message)
        }
      }
    }
  }
  return (
    <div className="w-96 bg-slate-300 px-5 pb-5 mb-3 pt-2 rounded-2xl shadow-2xl">
      {errorMessage && <div className="text-center text-red-600">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="text-center text-2xl mt-2 font-bold">Sign In</div>
        <div className="flex flex-col gap-1 my-2">
          <label htmlFor="email">Email</label>
          <input type="text" id="email" name="email" value={formData.email} className="py-2 px-2 rounded-md"
            onChange={onHandleChange}
          />
          {formErrors.email && <span>{formErrors.email}</span>}
        </div>
        <div className="flex flex-col gap-1 my-2">
          <label htmlFor="password">Password</label>
          <input type="text" id="password" name="password" value={formData.password} className="py-2 px-2 rounded-md mb-2"
            onChange={onHandleChange}
          />
          {formErrors.password && <span>{formErrors.password}</span>}
        </div>
        <div className="text-center">
          <button className="border px-4 py-2 rounded-xl bg-white font-semibold">Submit</button>
        </div>
      </form>
    </div>
  )
}

export default SignIn