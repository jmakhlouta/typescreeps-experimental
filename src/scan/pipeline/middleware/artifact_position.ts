import { IFactFinder } from "scan/contacts/fact_finder.interface";
import { IScanMiddleware } from "./scan_middleware.interface";
import { Property } from "../../../infrastructure/property.type";
import { ScanArtifact } from "../scan_context";

export class ArtifactPosition implements IFactFinder<RoomPosition> {
  public get middleware(): IScanMiddleware {
    return (unknownScanContext, next) => {
      if (!(unknownScanContext instanceof ScanArtifact)) {
        next();
        return;
      }

      const context = unknownScanContext as ScanArtifact<RoomObject>;
      if (!(context.artifact instanceof RoomObject)) {
        next();
        return;
      }

      _.merge(context.facts, this.evaluate(context.artifact.pos));

      next();
    };
  }

  public evaluate(position: RoomPosition): Property {
    const facts = {} as Property;

    facts.position = {} as Property;
    facts.room = position.roomName;
    facts.position.x = position.x;
    facts.position.y = position.y;

    return facts;
  }
}
