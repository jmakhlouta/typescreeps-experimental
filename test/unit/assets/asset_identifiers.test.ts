import { AssetIdentifiers } from "assets/asset_identifiers";
import { TickCodec } from "infrastructure/tick_codec";
import { expect } from "chai";

describe("asset identifiers", function () {
  describe("names", function () {
    it("includes custom info", function () {
      const customInfo = "customInfo";
      const tick = 12345;
      expect(AssetIdentifiers.GenerateName(customInfo, tick)).to.contain(customInfo);
    });

    it("encodes the provided tick number", function () {
      const prefix = "test";
      const tick = 12345;
      const name = AssetIdentifiers.GenerateName(prefix, tick);
      const tickPart = name.split("#")[1].split(".")[0];
      const decodedTickPart = TickCodec.decode(tickPart);
      expect(decodedTickPart).to.eql(tick);
    });

    it("automatically gets current time", function () {
      const prefix = "test";
      Game.time = 54321;
      const name = AssetIdentifiers.GenerateName(prefix);
      const tickPart = name.split("#")[1].split(".")[0];
      const decodedTickPart = TickCodec.decode(tickPart);
      expect(decodedTickPart).to.eql(Game.time);
    });

    it("unique for each call", function () {
      const prefix = "test";
      const tick = 12345;
      expect(AssetIdentifiers.GenerateName(prefix, tick)).does.not.eql(AssetIdentifiers.GenerateName(prefix, tick));
    });
  });
});
