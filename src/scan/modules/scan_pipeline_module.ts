import { ILoopModule } from "loop/loop_module.interface";
import { ISourceProvider } from "resources/contacts/source_provider.interface";
import { ScanArtifact } from "scan/pipeline/scan_context";
import { ScanPipeline } from "../pipeline/scan_pipeline";

export class ScanPipelineModule implements ILoopModule {
  private pipeline = new ScanPipeline();

  public constructor(private sourceProviders: ISourceProvider[]) {
  }

  public invoke(): void {
    for (const sourceProvider of this.sourceProviders) {
      for (const source of sourceProvider.sources) {
        const scanContext = new ScanArtifact(source);
        this.pipeline.invoke(scanContext);
      }
    }
  }
}
