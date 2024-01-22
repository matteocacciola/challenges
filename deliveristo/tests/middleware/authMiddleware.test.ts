import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { verifyTokenMiddleware } from '../../src/middleware/authMiddleware';

jest.mock('jsonwebtoken');

describe('Authorization Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  const verify = jest.spyOn(jwt, 'verify');

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should call next if token is valid', () => {
    verify.mockImplementation(() => ({ userId: 123, verified: 'true' }));

    mockRequest.headers.authorization = 'Bearer valid-token';
    verifyTokenMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockNext).toHaveBeenCalled();
  });

  it('should return an error if token is missing', () => {
    verifyTokenMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Not Authorized' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return an error if token is invalid', () => {
    mockRequest.headers.authorization = 'Bearer invalid-token';
    verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });
    verifyTokenMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Forbidden' });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
