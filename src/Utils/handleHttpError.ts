const handleHttpError = (status: number, statustext: string) => {
    switch (status) {
        case 400:
            return `Bad request ${statustext}`
        case 401:
            return `Unauthorized ${statustext}`
        case 403:
            return `Forbidden ${statustext}`
        case 404:
            return `Not Found ${statustext}`
        case 429:
            return `Too Mant Request ${statustext}`
        case 500:
            return `Internal Server Error ${statustext}`
        case 502:
            return `Bad Gateway ${statustext}`
        case 503:
            return `Service Unavailable ${statustext}`
        default:
            return `HTTP Error ${statustext}`
    }
}

export { handleHttpError }