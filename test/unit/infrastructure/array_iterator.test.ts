/* eslint-disable @typescript-eslint/no-unused-expressions */

import { assert, expect } from "chai";
import { ArrayIterator } from "infrastructure/array_iterator";

describe("array iterator", function () {
  let referenceArray: number[];
  let iterator: ArrayIterator<number>;

  before(function () {
    referenceArray = [1, 2, 3, 4];
    iterator = new ArrayIterator(referenceArray);
  });

  it("iterator.done", function () {
    expect(new ArrayIterator([0]).done).to.be.false;
    expect(new ArrayIterator([]).done).to.be.true;
  });

  it("iterator.next() (iteration)", function () {
    let i = 0;
    while (!iterator.done) {
      // Paranoid defense against infinite loop
      if (i >= referenceArray.length) {
        assert.fail("Excess enumeration");
      }

      expect(iterator.current).to.equal(referenceArray[i]);

      i++;
      iterator.next();
    }
  });

  it("iteration.reset()", function () {
    iterator.reset();
    expect(iterator.current).to.equal(referenceArray[0]);
  });
});
