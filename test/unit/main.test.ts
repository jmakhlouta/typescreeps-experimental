import { assert } from "chai";
import { loop } from "../../src/main";

describe("main", () => {
  it("should export a loop function", () => {
    assert.isTrue(typeof loop === "function");
  });

  it("should return void when called with no context", () => {
    assert.isUndefined(loop());
  });
});
