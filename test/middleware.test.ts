import { createMiddleware } from "../src";

const mockNext = jest.fn();

beforeEach(() => {
  mockNext.mockClear();
});

test("call middleware functions", () => {
  const middleware = createMiddleware();
  middleware.initializer(mockNext);
  expect(mockNext.mock.calls.length).toEqual(1);
  middleware.handler(mockNext);
  expect(mockNext.mock.calls.length).toEqual(2);
  middleware.finalizer(mockNext);
  expect(mockNext.mock.calls.length).toEqual(3);
});
