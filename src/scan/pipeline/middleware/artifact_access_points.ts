import { IFactFinder } from "scan/contacts/fact_finder.interface";
import { IScanMiddleware } from "./scan_middleware.interface";
import { Property } from "../../../infrastructure/property.type";
import { ScanArtifact } from "../scan_context";

type Harvestable = Source | Deposit;

export class ArtifactAccessPoints implements IFactFinder<Harvestable> {
  public get middleware(): IScanMiddleware {
    return (unknownScanContext, next) => {
      if (!(unknownScanContext instanceof ScanArtifact)) {
        next();
        return;
      }

      const context = unknownScanContext as ScanArtifact<Harvestable>;
      if (!ArtifactAccessPoints.IsApplicableType(context.artifact)) {
        next();
        return;
      }

      _.merge(context.facts, this.evaluate(context.artifact));

      next();
    };
  }

  public evaluate(artifact: Harvestable): Property {
    const facts = {} as Property;

    const room = artifact.room ?? Game.rooms[artifact.pos.roomName];
    const surroundings = this.evaluateSurroundings(room, artifact.pos);
    const accessibleTerrain = ["plain"];
    const accessPoints = _.filter(surroundings, t => t.type === "terrain" && _.contains(accessibleTerrain, t.terrain));

    facts.accessPoints = accessPoints;

    return facts;
  }

  public evaluateSurroundings(room: Room, pos: RoomPosition): LookForAtAreaResultArray<Terrain, LOOK_TERRAIN> {
    return room.lookForAtArea(LOOK_TERRAIN, pos.y - 1, pos.x - 1, pos.y + 1, pos.x + 1, true);
  }

  private static IsApplicableType(artifact: Harvestable) {
    // Must be kept in sync with the aliased types in Harvestable
    return artifact instanceof Source || artifact instanceof Deposit;
  }
}
