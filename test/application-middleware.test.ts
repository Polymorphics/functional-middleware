import { createApplicationMiddleware } from "../src";

const mockNext = jest.fn();

beforeEach(() => {
  mockNext.mockClear();
});

test("call application middleware functions", () => {
  const applicationMiddleware = createApplicationMiddleware();
  applicationMiddleware.initializer(mockNext);
  expect(mockNext.mock.calls.length).toEqual(1);
  applicationMiddleware.handler(mockNext);
  expect(mockNext.mock.calls.length).toEqual(2);
  applicationMiddleware.finalizer(mockNext);
  expect(mockNext.mock.calls.length).toEqual(3);
});
