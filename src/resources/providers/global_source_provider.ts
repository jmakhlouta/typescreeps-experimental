import { ISourceProvider } from "resources/contacts/source_provider.interface";

export class GlobalSourceProvider implements ISourceProvider {
  public get sources(): Source[] {
    const allSources = _.flatten(Object.values(Game.rooms).map(r => r.find(FIND_SOURCES)));
    return allSources;
  }
}
