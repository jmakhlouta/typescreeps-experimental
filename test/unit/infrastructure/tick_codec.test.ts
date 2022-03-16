import { TickCodec } from "infrastructure/tick_codec";
import { expect } from "chai";

describe("tick codec", function () {
  it("encodes and decodes", function () {
    const testVal = 24315;
    const encodeValue = TickCodec.encode(testVal);
    const decodeValue = TickCodec.decode(encodeValue);

    expect(decodeValue).to.eql(testVal);
  });

  it("shortens numbers", function () {
    for (let i = 0; i < 5; i++) {
      const testVal = Math.pow(10, 2 + i);
      expect(testVal.toString().length).to.be.greaterThan(TickCodec.encode(testVal).length);
    }
  });
});
