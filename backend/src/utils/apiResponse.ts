interface ApiResponseOptions {
    statusCode: number
    message: string
    success: boolean
    data?: any
}

class ApiResponse implements ApiResponseOptions {
    statusCode: number;
    message: string;
    success: boolean;
    data: any;
    constructor(options: ApiResponseOptions={
        message:"Success",
        statusCode:200,
        success:true,
    }) {
        this.statusCode = options.statusCode
        this.message = options.message
        this.success = options.success
        this.data = options.data
    }
}

export default ApiResponse