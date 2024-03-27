import { Request, Response, NextFunction } from "express"
import { ZodError } from "zod"
// const asyncHandler = (fn: any) => {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             await fn(req, res, next)
//         } catch (error: any) {
//             const statusCode = error.statusCode || 500
//             const message = error.message || "Something went wrong"
//             res.status(statusCode).json({
//                 success: false,
//                 message: message
//             })
//         }
//     }
// }


const asyncHandler = (requestHandler: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        return Promise.resolve(requestHandler(req, res, next))
            .catch((error: any) => {
                if (error instanceof ZodError) {
                    res.status(400).json({
                        success:false,
                        message:error.errors[0].message
                    })
                }
                else {
                    const statusCode: number = error.statusCode || 500
                    const message: string = error.message || "Something went wrong"
                    const stack = error.stack
                    res.status(statusCode).json({
                        success: false,
                        message: message,
                        stack: stack
                    })
                }
            })
    }
}

export { asyncHandler }