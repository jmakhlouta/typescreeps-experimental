import { assert } from "chai";
import { loop } from "../../src/main";

describe("main", () => {
  beforeEach("resetting game context", function () {
    ResetGlobalGameContext();
  });

  it("should export a loop function", () => {
    assert.isTrue(typeof loop === "function");
  });

  it("should return void when called with no context", () => {
    assert.isUndefined(loop());
  });

  it("delete memory of missing creeps", () => {
    Memory.creeps.persistValue = {} as CreepMemory;
    Memory.creeps.notPersistValue = {} as CreepMemory;
    Game.creeps.persistValue = {} as Creep;

    loop();

    assert.isDefined(Memory.creeps.persistValue);
    assert.isUndefined(Memory.creeps.notPersistValue);
  });
});
