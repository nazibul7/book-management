import { Request, Response, NextFunction } from "express";
import Apierror from "./apiError";

const errorHandler = (err: Apierror | Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    
    if (err instanceof Apierror) {
        return res.status(err.statusCode).json({
            message: err.message,
            success: err.success,
            errors: err.errors || [],
        });
    }

    // Default fallback for other errors
    console.error("Unhandled error:", err);
    res.status(500).json({
        message: "Internal Server Error",
        success: false,
        errors: [err instanceof Error ? err.message : "Unexpected error occurred"],
    });
};

export default errorHandler;
