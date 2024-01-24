import {
  createMiddlewareStack,
  Middleware,
  MiddlewareFinalizer,
  MiddlewareHandler,
  MiddlewareInitializer,
} from "../src";

const mockMiddleware = {
  initializer: jest.fn(),
  handler: jest.fn(),
  finalizer: jest.fn(),
};

const mockPrototypeMiddleware = Object.assign(Object.create({
  initializer: jest.fn(),
  handler: jest.fn(),
  finalizer: jest.fn(),
}), {
  initializer: undefined,
  handler: undefined,
  finalizer: undefined,
});

beforeEach(() => {
  mockMiddleware.initializer.mockClear();
  mockMiddleware.handler.mockClear();
  mockMiddleware.finalizer.mockClear();
  Object.getPrototypeOf(mockPrototypeMiddleware).initializer.mockClear();
  Object.getPrototypeOf(mockPrototypeMiddleware).handler.mockClear();
  Object.getPrototypeOf(mockPrototypeMiddleware).finalizer.mockClear();
});

const middlewareStack = createMiddlewareStack();

test("add middleware to default stack", () => {
  expect(middlewareStack.add(mockMiddleware)).toEqual(1);
});

test("add prototype middleware to default stack", () => {
  expect(middlewareStack.add(mockPrototypeMiddleware)).toEqual(2);
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
  expect(customMiddlewareStack.add(mockMiddleware, "primary")).toEqual(1);
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
  expect(customMiddlewareStack.add(mockMiddleware, "secondary")).toEqual(1);
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
  expect(customMiddlewareStack.add(mockMiddleware)).toBeUndefined();
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
