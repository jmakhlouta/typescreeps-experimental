import { IMiddleware } from "infrastructure/middleware.interface";
import { ScanContext } from "../scan_context";

export type IScanMiddleware = IMiddleware<ScanContext>;
