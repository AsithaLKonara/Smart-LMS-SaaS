
import { NextResponse } from "next/server";

export type ApiResponse<T = any> = {
    success: boolean;
    data?: T;
    error?: string;
    code?: string;
};

export class ApiError extends Error {
    constructor(
        public message: string,
        public status: number = 400,
        public code?: string
    ) {
        super(message);
    }
}

export function apiResponse<T>(data: T, status: number = 200) {
    return NextResponse.json(
        {
            success: true,
            data,
        },
        { status }
    );
}

export function apiError(message: string, status: number = 400, code?: string) {
    return NextResponse.json(
        {
            success: false,
            error: message,
            code,
        },
        { status }
    );
}

export function handleApiError(error: any) {
    console.error("[API_ERROR]", error);

    if (error instanceof ApiError) {
        return apiError(error.message, error.status, error.code);
    }

    return apiError("Internal Server Error", 500, "INTERNAL_ERROR");
}
