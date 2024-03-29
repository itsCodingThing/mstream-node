import { NextFunction, Request, Response } from "express";

export default function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
    // log it
    if (process.env.NODE_ENV === "development") console.error(error);

    res.status(200).json({ ok: false, error: error.message });
}
