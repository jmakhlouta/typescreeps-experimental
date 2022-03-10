/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable max-classes-per-file */

import { IMiddleware } from "infrastructure/middleware.interface";
import { expect } from "chai";

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

  public toMiddleware(): IMiddleware<TestSource, TestResult> {
    return (source: TestSource, result: TestResult, next: () => void) => {
      source.ingredient = source.ingredient.concat(`,${this.secretIngredient}`);

      next();

      result.products = source.ingredient.split(",");
      result.ops.push("split");
    };
  }
}

describe("middleware", function () {
  describe("simple", function () {
    let middleware: IMiddleware<TestSource, TestResult>;

    before(() => {
      middleware = (source: TestSource, result: TestResult, next: () => void): void => {
        source.ingredient = source.ingredient.concat(",added-by-middleware");

        next();

        result.products = source.ingredient.split(",");
        result.ops.push("split");
      };
    });

    it("modifies source context", function () {
      const testNext = () => {};

      const source = new TestSource("a,b,c");
      const sourceRef = source;
      const sourceCopy = new TestSource("a,b,c,added-by-middleware");

      middleware(source, new TestResult(), testNext);

      expect(source).to.equal(sourceRef);
      expect(source).to.not.equal(sourceCopy);
      expect(source).to.eql(sourceCopy);
    });

    it("modifies result context", function () {
      const testNext = () => {};

      const result = new TestResult();
      const resultRef = result;

      middleware(new TestSource("a,b,c"), result, testNext);

      expect(result).to.equal(resultRef);
    });

    it("next() can be invoked amidst context modifications", function () {
      const source = new TestSource("a");
      const result = new TestResult();

      const testNext = () => {
        expect(source.ingredient).to.equal("a,added-by-middleware");
        expect(result.ops).to.not.contain("split");
      };

      middleware(source, result, testNext);

      expect(result.ops).to.contain("split");
    });
  });

  describe("complex", function () {
    let complexMiddlewareHost: ComplexMiddleware;
    let middleware: IMiddleware<TestSource, TestResult>;

    before(() => {
      complexMiddlewareHost = new ComplexMiddleware();
      middleware = complexMiddlewareHost.toMiddleware();
    });

    it("middleware has access to private members", function () {
      const testNext = () => {};

      const source = new TestSource("a,b,c");
      const sourceRef = source;
      const sourceCopy = new TestSource("a,b,c,chemical-x");

      middleware(source, new TestResult(), testNext);

      expect(source).to.equal(sourceRef);
      expect(source).to.not.equal(sourceCopy);
      expect(source).to.eql(sourceCopy);
    });
  });
});
