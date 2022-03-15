/* eslint-disable @typescript-eslint/no-unused-expressions */

import { LoopAuthority } from "loop/loop_authority";
import { SimpleLoopModule } from "loop/loop_module_simple";
import { expect } from "chai";

describe("loop authority", function () {
  it("invokes all registered modules", function () {
    let module1Invoked = false;
    let module2Invoked = false;

    const authority = new LoopAuthority([
      new SimpleLoopModule(() => {
        module1Invoked = true;
      }),
      new SimpleLoopModule(() => {
        module2Invoked = true;
      })
    ]);

    authority.invoke();

    expect(module1Invoked).to.be.true;
    expect(module2Invoked).to.be.true;
  });
});
