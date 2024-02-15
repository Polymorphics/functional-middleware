import {
  createMiddlewareStack,
  Middleware,
  MiddlewareFinalizer,
  MiddlewareHandler,
  MiddlewareInitializer,
} from "../src";

const mockMiddlewareA = {
  initializer: jest.fn(),
  handler: jest.fn(),
  finalizer: jest.fn(),
};

const mockMiddlewareB = {
  initializer: jest.fn(),
  handler: jest.fn(),
  finalizer: jest.fn(),
};

beforeEach(() => {
  mockMiddlewareA.initializer.mockClear();
  mockMiddlewareA.handler.mockClear();
  mockMiddlewareA.finalizer.mockClear();
  mockMiddlewareB.initializer.mockClear();
  mockMiddlewareB.handler.mockClear();
  mockMiddlewareB.finalizer.mockClear();
});

const middlewareStack = createMiddlewareStack();

test("add middleware to default stack", () => {
  expect(middlewareStack.add(mockMiddlewareA)).toEqual(1);
});

test("add prototype middleware to default stack", () => {
  expect(middlewareStack.add(mockMiddlewareB)).toEqual(2);
});

test("get middleware list from stack", () => {
  const middlewareList = middlewareStack.middleware();
  expect(middlewareList).toHaveLength(2);
});

test("get initializer list from stack", () => {
  const initializerList = middlewareStack.initializer();
  expect(initializerList).toHaveLength(2);
});

test("get handler list from stack", () => {
  const handlerList = middlewareStack.handler();
  expect(handlerList).toHaveLength(2);
});

test("get finalizer list from stack", () => {
  const finalizerList = middlewareStack.finalizer();
  expect(finalizerList).toHaveLength(2);
});

test("remove middleware from stack", () => {
  const result = middlewareStack.remove(mockMiddlewareA);
  expect(result).toEqual(1);
  const middlewareList = middlewareStack.middleware();
  expect(middlewareList).toHaveLength(1);
});

test("retry remove same middleware from stack", () => {
  const result = middlewareStack.remove(mockMiddlewareA);
  expect(result).toEqual(0);
  const middlewareList = middlewareStack.middleware();
  expect(middlewareList).toHaveLength(1);
});

test("clear middleware stack", () => {
  const result = middlewareStack.clear();
  expect(result).toEqual(1);
  const middlewareList = middlewareStack.middleware();
  expect(middlewareList).toHaveLength(0);
});

test("remove middleware from invalid stack", () => {
  const result = middlewareStack.remove(mockMiddlewareA, "invalid");
  expect(result).toEqual(0);
});

test("clear invalid middleware stack", () => {
  const result = middlewareStack.clear("invalid");
  expect(result).toEqual(0);
});

const customMiddlewareStack = createMiddlewareStack({
  primary:
    Array<
      Middleware<
        MiddlewareInitializer<any>,
        MiddlewareHandler<any, any>,
        MiddlewareFinalizer<any>
      >
    >(),
  secondary:
    Array<
      Middleware<
        MiddlewareInitializer<any>,
        MiddlewareHandler<any, any>,
        MiddlewareFinalizer<any>
      >
    >(),
});

test("add middleware to primary stack", () => {
  expect(customMiddlewareStack.add(mockMiddlewareA, "primary")).toEqual(1);
});

test("get middleware list from primary stack", () => {
  const middlewareList = customMiddlewareStack.middleware("primary");
  expect(middlewareList).toHaveLength(1);
});

test("get initializer list from primary stack", () => {
  const initializerList = customMiddlewareStack.initializer("primary");
  expect(initializerList).toHaveLength(1);
});

test("get handler list from primary stack", () => {
  const handlerList = customMiddlewareStack.handler("primary");
  expect(handlerList).toHaveLength(1);
});

test("get finalizer list from primary stack", () => {
  const finalizerList = customMiddlewareStack.finalizer("primary");
  expect(finalizerList).toHaveLength(1);
});

test("add middleware to secondary stack", () => {
  expect(customMiddlewareStack.add(mockMiddlewareA, "secondary")).toEqual(1);
});

test("get middleware list from secondary stack", () => {
  const middlewareList = customMiddlewareStack.middleware("secondary");
  expect(middlewareList).toHaveLength(1);
});

test("get initializer list from secondary stack", () => {
  const initializerList = customMiddlewareStack.initializer("secondary");
  expect(initializerList).toHaveLength(1);
});

test("get handler list from secondary stack", () => {
  const handlerList = customMiddlewareStack.handler("secondary");
  expect(handlerList).toHaveLength(1);
});

test("get finalizer list from secondary stack", () => {
  const finalizerList = customMiddlewareStack.finalizer("secondary");
  expect(finalizerList).toHaveLength(1);
});

test("can not add middleware to default stack", () => {
  expect(customMiddlewareStack.add(mockMiddlewareA)).toBeUndefined();
});

test("get empty middleware list from default stack", () => {
  const middlewareList = customMiddlewareStack.middleware("default");
  expect(middlewareList).toHaveLength(0);
});

test("get empty initializer list from default stack", () => {
  const initializerList = customMiddlewareStack.initializer("default");
  expect(initializerList).toHaveLength(0);
});

test("get empty handler list from default stack", () => {
  const handlerList = customMiddlewareStack.handler("default");
  expect(handlerList).toHaveLength(0);
});

test("get empty finalizer list from default stack", () => {
  const finalizerList = customMiddlewareStack.finalizer("default");
  expect(finalizerList).toHaveLength(0);
});
