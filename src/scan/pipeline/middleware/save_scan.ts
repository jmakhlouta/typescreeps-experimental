import { FactMemory, FactMemoryEntry } from "scan/scan_memory";
import { IScanMiddleware } from "./scan_middleware.interface";

export class SaveScan {
  public get middleware(): IScanMiddleware {
    return (context, next) => {
      next();

      if ("key" in context.facts && typeof context.facts.key === "string") {
        if (!("facts" in Memory)) {
          Memory.facts = {} as FactMemory;
        }

        const key = context.facts.key;
        if (Memory.facts[key] === undefined) {
          Memory.facts[key] = {} as FactMemoryEntry;
        }

        _.merge(Memory.facts[key], context.facts);
      }
    };
  }
}
