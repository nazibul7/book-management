// class Apierror extends Error {
//     statusCode: number
//     success: boolean
//     error: any[]
//     constructor(
//         message: string = "Something went wrong",
//         statusCode: number = 500,
//         success: boolean = false,
//         error = []
//     ) {
//         super(message)
//         this.statusCode = statusCode
//         this.error = error
//         this.success = success
//         if(this.stack){
//             Error.captureStackTrace(this,this.constructor)
//         }
//     }
// }

// export default Apierror


interface ApierrorOptions {
    message: string
    statusCode: number
    success: boolean
    errors?: string[]
}

class Apierror extends Error {
    statusCode: number
    success: boolean
    errors?: string[]
    constructor(options: ApierrorOptions = {
        message: "Something went wrong",
        statusCode: 500,
        success: false,
        errors: []
    }) {
        const { message, statusCode, success, errors } = options
        super(message)
        this.statusCode = statusCode
        this.success = success
        this.errors = errors
        if (this.stack) {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default Apierror