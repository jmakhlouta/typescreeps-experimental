import { Pipeline } from "infrastructure/pipeline";
import { ScanContext } from "./scan_context";

export class ScanPipeline extends Pipeline<ScanContext> {
  public constructor() {
    super();
  }
}
