import {
  createApplication, createApplicationCaller,
  createMiddlewareStack,
  Middleware,
  MiddlewareFinalizer,
  MiddlewareHandler,
  MiddlewareInitializer
} from "../src";

const mockInitializer = jest.fn();
const mockHandler = jest.fn();
const mockFinalizer = jest.fn();
const mockMiddleware = {
  initializer: mockInitializer,
  handler: mockHandler,
  finalizer: mockFinalizer,
};

beforeEach(() => {
  mockInitializer.mockClear();
  mockHandler.mockClear();
  mockFinalizer.mockClear();
});

const application = createApplication();

test("add middleware to default stack", () => {
  expect(application.use(mockMiddleware)).toEqual(1);
  const middlewareList = application.stack.middleware();
  expect(middlewareList).toHaveLength(1);
});

test("ready to middleware in application", () => {
  application.ready();
  expect(mockInitializer.mock.calls.length).toEqual(1);
  expect(mockHandler.mock.calls.length).toEqual(0);
  expect(mockFinalizer.mock.calls.length).toEqual(0);
});

test("process to middleware in application", () => {
  application.process();
  expect(mockInitializer.mock.calls.length).toEqual(0);
  expect(mockHandler.mock.calls.length).toEqual(1);
  expect(mockFinalizer.mock.calls.length).toEqual(0);
});

test("close to middleware in application", () => {
  application.close();
  expect(mockInitializer.mock.calls.length).toEqual(0);
  expect(mockHandler.mock.calls.length).toEqual(0);
  expect(mockFinalizer.mock.calls.length).toEqual(1);
});

const stack = createMiddlewareStack({
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
Object.assign(stack, {
  add: (
    middleware: Middleware<
      MiddlewareInitializer<any>,
      MiddlewareHandler<any, any>,
      MiddlewareFinalizer<any>
    >
  ) => Object.getPrototypeOf(stack).add(middleware, "primary"),
  middleware: () => Object.getPrototypeOf(stack).middleware("primary"),
  initializer: () => Object.getPrototypeOf(stack).initializer("primary"),
  handler: () => Object.getPrototypeOf(stack).handler("primary"),
  finalizer: () => Object.getPrototypeOf(stack).finalizer("primary"),
});

const initialize = createApplicationCaller();
const handle = createApplicationCaller();
const finalize = createApplicationCaller();

const customApplication = createApplication({
  stack,
  initialize,
  handle,
  finalize,
});

test("add middleware to primary stack", () => {
  expect(customApplication.use(mockMiddleware)).toEqual(1);
  const middlewareList = customApplication.stack.middleware();
  expect(middlewareList).toHaveLength(1);
});

test("ready to middleware in application", () => {
  customApplication.ready();
  expect(mockInitializer.mock.calls.length).toEqual(1);
  expect(mockHandler.mock.calls.length).toEqual(0);
  expect(mockFinalizer.mock.calls.length).toEqual(0);
});

test("process to middleware in application", () => {
  customApplication.process();
  expect(mockInitializer.mock.calls.length).toEqual(0);
  expect(mockHandler.mock.calls.length).toEqual(1);
  expect(mockFinalizer.mock.calls.length).toEqual(0);
});

test("close to middleware in application", () => {
  customApplication.close();
  expect(mockInitializer.mock.calls.length).toEqual(0);
  expect(mockHandler.mock.calls.length).toEqual(0);
  expect(mockFinalizer.mock.calls.length).toEqual(1);
});
