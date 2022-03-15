import { CleanCreepsMemory } from "memory/modules/clean_creeps_memory";
import { assert } from "chai";

describe("modules", function () {
  beforeEach("resetting game context", function () {
    ResetGlobalGameContext();
  });

  describe("CleanCreepsMemory", function () {
    it("should delete memory of missing creeps", function () {
      const module = new CleanCreepsMemory();

      Memory.creeps.persistValue = {} as CreepMemory;
      Memory.creeps.notPersistValue = {} as CreepMemory;
      Game.creeps.persistValue = {} as Creep;

      module.invoke();

      assert.isDefined(Memory.creeps.persistValue);
      assert.isUndefined(Memory.creeps.notPersistValue);
    });
  });
});
