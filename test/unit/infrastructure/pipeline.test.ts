/* eslint-disable max-classes-per-file */
import { Pipeline } from "infrastructure/pipeline";
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

describe("pipeline", function () {
  describe("empty pipeline", function () {
    let factory: () => TestResult;
    let pipeline: Pipeline<TestSource, TestResult>;

    before(() => {
      factory = () => {
        return new TestResult();
      };
      pipeline = new Pipeline<TestSource, TestResult>(factory);
    });

    it("uses factory and preserves result context", function () {
      const testResultReference = new TestResult();
      const pseudofactory = () => {
        return testResultReference;
      };
      const testPipeline = new Pipeline<TestSource, TestResult>(pseudofactory);
      const pipelineReuslt = testPipeline.post(new TestSource("a,b,c"));

      expect(pipelineReuslt).to.equal(testResultReference);
      expect(pipelineReuslt).to.not.equal(new TestResult());
      expect(pipelineReuslt).to.eql(new TestResult());
    });

    it("does not modify source", function () {
      const source = new TestSource();
      const sourceRef = source;
      const matchingSource = new TestSource();

      pipeline.post(source);

      expect(source).to.equal(sourceRef);
      expect(source).to.not.equal(matchingSource);
      expect(source).to.eql(matchingSource);
    });

    it("emits distinct results", function () {
      const source = new TestSource("a,b");
      const result1 = pipeline.post(source);
      const result2 = pipeline.post(source);

      expect(result1).to.not.equal(result2);
      expect(result1).to.deep.equal(result2);
    });
  });

  describe("multi-stage pipeline (append-to-source, split, reverse)", function () {
    let pipeline: Pipeline<TestSource, TestResult>;

    before(() => {
      pipeline = new Pipeline<TestSource, TestResult>(
        () => new TestResult(),
        (source, result, next) => {
          source.ingredient = source.ingredient.concat(",added-by-pipeline");
          result.ops.push("secret-ingredient");
          next();
        },
        (source, result, next) => {
          result.products.push(...source.ingredient.split(","));
          result.ops.push("split");
          next();
        },
        (source, result, next) => {
          result.products.reverse();
          result.ops.push("reverse");
          next();
        }
      );
    });

    it("does not modify source", function () {
      const source = new TestSource();
      const sourceRef = source;
      const matchingSource = new TestSource();

      pipeline.post(source);

      expect(source).to.equal(sourceRef);
      expect(source).to.not.equal(matchingSource);
      expect(source).to.eql(matchingSource);
    });

    it("emits distinct results", function () {
      const source = new TestSource("a,b");
      const result1 = pipeline.post(source);
      const result2 = pipeline.post(source);

      expect(result1).to.not.equal(result2);
      expect(result1).to.deep.equal(result2);
    });

    it("applies middleware (append, split, reverse)", function () {
      const result = pipeline.post(new TestSource("a,b,c"));

      expect(result.ops).to.contain("secret-ingredient");
      expect(result.ops).to.contain("split");
      expect(result.ops).to.contain("reverse");
      expect(result.quantity).to.equal(4);
      expect(result.products).to.eql(["added-by-pipeline", "c", "b", "a"]);
    });
  });

  describe("single-stage pipeline (split string pipeline)", function () {
    let pipeline: Pipeline<TestSource, TestResult>;

    before(() => {
      pipeline = new Pipeline<TestSource, TestResult>(
        () => new TestResult(),
        (source, result, next) => {
          result.products.push(...source.ingredient.split(","));
          result.ops.push("split");
          next();
        }
      );
    });

    it("applies middleware (split)", function () {
      const result = pipeline.post(new TestSource("a,b,c"));

      expect(result.ops).to.contain("split");
      expect(result.quantity).to.equal(3);
      expect(result.products).to.eql(["a", "b", "c"]);
    });
  });
});
