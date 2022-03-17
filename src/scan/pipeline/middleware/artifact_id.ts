import { IFactFinder } from "scan/contacts/fact_finder.interface";
import { IScanMiddleware } from "./scan_middleware.interface";
import { Property } from "../../../infrastructure/property.type";
import { ScanArtifact } from "../scan_context";

export class ArtifactId implements IFactFinder<{ id: string }> {
  public get middleware(): IScanMiddleware {
    return (unqualifiedContext, next) => {
      if (!(unqualifiedContext instanceof ScanArtifact)) {
        next();
        return;
      }

      const context = unqualifiedContext as ScanArtifact<{ id: string }>;
      if (!("id" in context.artifact)) {
        next();
        return;
      }

      _.merge(context.facts, this.evaluate(context.artifact));

      next();
    };
  }

  public evaluate(artifact: { id: string }): Property {
    const facts = {} as Property;

    facts.id = artifact.id;
    facts.key = artifact.id;

    return facts;
  }
}
