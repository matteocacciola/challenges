"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware_1 = require("../../src/middleware/authMiddleware");
jest.mock('jsonwebtoken');
describe('Authorization Middleware', () => {
    let mockRequest;
    let mockResponse;
    let mockNext;
    const verify = jest.spyOn(jsonwebtoken_1.default, 'verify');
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
        (0, authMiddleware_1.verifyTokenMiddleware)(mockRequest, mockResponse, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });
    it('should return an error if token is missing', () => {
        (0, authMiddleware_1.verifyTokenMiddleware)(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Not Authorized' });
        expect(mockNext).not.toHaveBeenCalled();
    });
    it('should return an error if token is invalid', () => {
        mockRequest.headers.authorization = 'Bearer invalid-token';
        verify.mockImplementation(() => {
            throw new Error('Invalid token');
        });
        (0, authMiddleware_1.verifyTokenMiddleware)(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Forbidden' });
        expect(mockNext).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=authMiddleware.test.js.map