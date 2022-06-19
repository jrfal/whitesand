import execFlow from "./execFlow";
import simpleBranch from "./defs/simpleBranch";

const defs = {
  pass: (payload, context, props) =>
    new Promise((resolve, reject) => {
      resolve(payload);
    }),
  execute: (payload, context, props) =>
    new Promise((resolve, reject) => {
      payload();
      resolve();
    }),
  executeContext: (payload, context = {}, props) =>
    new Promise((resolve, reject) => {
      if (context.fn) {
        context.fn();
      }
      resolve();
    }),
  simpleBranch
};

it("should execute the function sent through the flow", async (done) => {
  const fn = jest.fn();

  await execFlow(
    defs,
    {
      first: {
        next: "second",
        def: "pass"
      },
      second: {
        next: "third",
        def: "pass"
      },
      third: {
        def: "execute"
      }
    },
    "first",
    fn
  );

  expect(fn).toBeCalled();
  done();
});

it("should execute the function sent through with context", async (done) => {
  const fn = jest.fn();

  await execFlow(
    defs,
    {
      first: {
        next: "second",
        def: "pass"
      },
      second: {
        next: "third",
        def: "pass"
      },
      third: {
        def: "executeContext"
      }
    },
    "first",
    null,
    {
      fn
    }
  );

  expect(fn).toBeCalled();
  done();
});

it("should only execute the function based on the branch", async (done) => {
  const fn = jest.fn();

  const flow = {
    first: {
      next: "second",
      def: "pass"
    },
    second: {
      def: "pass",
      branches: {
        third: "third",
        fourth: "fourth"
      }
    },
    third: {
      def: "pass"
    },
    fourth: {
      def: "executeContext"
    }
  };

  await execFlow(defs, flow, "first", "third", {
    fn
  });

  expect(fn).not.toBeCalled();

  await execFlow(defs, flow, "first", "fourth", {
    fn
  });

  expect(fn).toBeCalled();

  done();
});
