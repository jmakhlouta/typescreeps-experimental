import { ArtifactAccessPoints } from "scan/pipeline/middleware/artifact_access_points";
import { ArtifactId } from "scan/pipeline/middleware/artifact_id";
import { ArtifactPosition } from "scan/pipeline/middleware/artifact_position";
import { ILoopModule } from "loop/loop_module.interface";
import { ISourceProvider } from "resources/contacts/source_provider.interface";
import { SaveScan } from "scan/pipeline/middleware/save_scan";
import { ScanArtifact } from "scan/pipeline/scan_context";
import { ScanPipeline } from "../pipeline/scan_pipeline";

export class ScanPipelineModule implements ILoopModule {
  private pipeline = new ScanPipeline();

  public constructor(private sourceProviders: ISourceProvider[]) {
    this.setupPipeline();
  }

  public invoke(): void {
    for (const sourceProvider of this.sourceProviders) {
      for (const source of sourceProvider.sources) {
        const scanContext = new ScanArtifact(source);
        this.pipeline.invoke(scanContext);
      }
    }
  }

  private setupPipeline() {
    const middleware = [new SaveScan(), new ArtifactId(), new ArtifactPosition(), new ArtifactAccessPoints()];
    this.pipeline.use(...middleware.map(m => m.middleware));
  }
}
