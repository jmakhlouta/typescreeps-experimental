/* eslint-disable max-classes-per-file */
import { Pipeline } from "infrastructure/pipeline";
import { expect } from "chai";

interface TestContext {
  source: TestSource;
  result: TestResult;
}

class TestSource {
  public ingredient: string;

  public constructor(ingredient = "") {
    this.ingredient = ingredient;
  }
}

class TestResult {
  public ops: string[] = [];
  public products: string[] = [];
  public get quantity(): number {
    return this.products.length;
  }
}

describe("pipeline", function () {
  describe("multi-stage pipeline (append-to-source, split, reverse)", function () {
    let pipeline: Pipeline<TestContext>;

    before(() => {
      pipeline = new Pipeline<TestContext>(
        (context, next) => {
          context.source.ingredient = context.source.ingredient.concat(",added-by-pipeline");
          context.result.ops.push("secret-ingredient");
          next();
        },
        (context, next) => {
          context.result.products.push(...context.source.ingredient.split(","));
          context.result.ops.push("split");
          next();
        },
        (context, next) => {
          context.result.products.reverse();
          context.result.ops.push("reverse");
          next();
        }
      );
    });

    it("applies middleware (append, split, reverse)", function () {
      const context = { source: new TestSource("a,b,c"), result: new TestResult() } as TestContext;
      pipeline.invoke(context);

      expect(context.result.ops).to.contain("secret-ingredient");
      expect(context.result.ops).to.contain("split");
      expect(context.result.ops).to.contain("reverse");
      expect(context.result.quantity).to.equal(4);
      expect(context.result.products).to.eql(["added-by-pipeline", "c", "b", "a"]);
    });
  });

  describe("single-stage pipeline (split string pipeline)", function () {
    let pipeline: Pipeline<TestContext>;

    before(() => {
      pipeline = new Pipeline<TestContext>((context, next) => {
        context.result.products.push(...context.source.ingredient.split(","));
        context.result.ops.push("split");
        next();
      });
    });

    it("applies middleware (split)", function () {
      const context = { source: new TestSource("a,b,c"), result: new TestResult() } as TestContext;
      pipeline.invoke(context);

      expect(context.result.ops).to.contain("split");
      expect(context.result.quantity).to.equal(3);
      expect(context.result.products).to.eql(["a", "b", "c"]);
    });
  });
});
