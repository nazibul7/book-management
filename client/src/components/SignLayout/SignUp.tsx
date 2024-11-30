import axios from "axios"
import React, { useState } from "react"
import { z, ZodError, ZodType } from "zod"
import { handleHttpError } from "../../Utils/handleHttpError"
interface SignupType {
  name: string
  age: number
  email: string
  password: string
}
interface FormErrors {
  name?: string
  age?: string
  email?: string
  password?: string
}
const signUpSchema: ZodType<SignupType> = z.object({
  name: z.string().trim().min(3).max(25),
  age: z.number().min(18).max(50),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long")
})
const SignUp = () => {
  const [formData, setFormData] = useState<SignupType>({ name: "", age: 0, email: "", password: "" })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [errorMessage, setErrorMessage] = useState('')

  const onHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    const newvalue = name == 'age' ? Number(value) : value
    setFormData({ ...formData, [name]: newvalue })
    setFormErrors({ ...formErrors, [name]: '' })
    setErrorMessage('')
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const data = signUpSchema.parse(formData)
      const response = await axios.post('http://localhost:4000/api/v1/users/register', data)
      // console.log(response.data.message);
      setErrorMessage("")
      setFormErrors({})
      if (response.status >= 200 && response.status < 300) {
        // alert(response.data.message)
        
      }
      setFormData({ name: "", age: 0, email: "", password: "" })
    } catch (error) {
      if (error instanceof ZodError) {
        setFormErrors(error.errors.reduce(
          (acc, curr) => ({
            ...acc, [curr.path[0]]: curr.message
          }), {}
        ))
      }
      else if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorMessage = handleHttpError(error.response.status, error.response.data.message || error.response.statusText)
          setErrorMessage(errorMessage)
          // console.log(error.response.status);
          // console.log(error.response.statusText);
          // console.log(error.message);

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
        <div className="text-center text-2xl mt-2 font-bold">Sign Up</div>
        <div className="flex flex-col gap-1 my-2">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" value={formData.name} className="p-2 rounded-md"
            onChange={onHandleChange}
          />
          {formErrors.name && <span>{formErrors.name}</span>}
        </div>
        <div className="flex flex-col gap-1 my-2">
          <label htmlFor="age">Age</label>
          <input type="number" id="age" name="age" value={formData.age} className="p-2 rounded-md"
            onChange={onHandleChange}
          />
          {formErrors.age && <span>{formErrors.age}</span>}
        </div>
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

export default SignUp