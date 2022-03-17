/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable max-classes-per-file */

import { IMiddleware } from "infrastructure/middleware.interface";
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

class ComplexMiddleware {
  private secretIngredient = "chemical-x";

  public toMiddleware(): IMiddleware<TestContext> {
    return (context: TestContext, next: () => void) => {
      context.source.ingredient = context.source.ingredient.concat(`,${this.secretIngredient}`);

      next();

      context.result.products = context.source.ingredient.split(",");
      context.result.ops.push("split");
    };
  }
}

describe("middleware", function () {
  describe("simple", function () {
    let middleware: IMiddleware<TestContext>;

    before(() => {
      middleware = (context: TestContext, next: () => void): void => {
        context.source.ingredient = context.source.ingredient.concat(",added-by-middleware");

        next();

        context.result.products = context.source.ingredient.split(",");
        context.result.ops.push("split");
      };
    });

    it("modifies source context", function () {
      const testNext = () => {};

      const source = new TestSource("a,b,c");
      const sourceRef = source;
      const sourceCopy = new TestSource("a,b,c,added-by-middleware");

      middleware({ source, result: new TestResult() }, testNext);

      expect(source).to.equal(sourceRef);
      expect(source).to.not.equal(sourceCopy);
      expect(source).to.eql(sourceCopy);
    });

    it("modifies result context", function () {
      const testNext = () => {};

      const result = new TestResult();
      const resultRef = result;

      middleware({ source: new TestSource("a,b,c"), result }, testNext);

      expect(result).to.equal(resultRef);
    });

    it("next() can be invoked amidst context modifications", function () {
      const source = new TestSource("a");
      const result = new TestResult();

      const testNext = () => {
        expect(source.ingredient).to.equal("a,added-by-middleware");
        expect(result.ops).to.not.contain("split");
      };

      middleware({ source, result }, testNext);

      expect(result.ops).to.contain("split");
    });
  });

  describe("complex", function () {
    let complexMiddlewareHost: ComplexMiddleware;
    let middleware: IMiddleware<TestContext>;

    before(() => {
      complexMiddlewareHost = new ComplexMiddleware();
      middleware = complexMiddlewareHost.toMiddleware();
    });

    it("middleware has access to private members", function () {
      const testNext = () => {};

      const source = new TestSource("a,b,c");
      const sourceRef = source;
      const sourceCopy = new TestSource("a,b,c,chemical-x");

      middleware({ source, result: new TestResult() }, testNext);

      expect(source).to.equal(sourceRef);
      expect(source).to.not.equal(sourceCopy);
      expect(source).to.eql(sourceCopy);
    });
  });
});
