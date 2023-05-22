import { rootHandler, purchaseHandler } from "./controller";
import { Request, Response } from "express";

describe("test get root query", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return the root response", async () => {
        const mockRequest = {} as Request;
        const mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: (t: any) => t,
        } as unknown as Response;
        const response = rootHandler(mockRequest, mockResponse);
        expect(response).toBe("API is running on port 8000");
    });

    it("should return a successful purchase response", async () => {
        const mockRequest = {} as Request;
        mockRequest.body = {
            order: [{ productName: "Google Home", qty: 2 }],
        };
        const mockResponse = {
            json: (t: any) => t,
            status: jest.fn().mockReturnThis(),
        } as unknown as Response;

        const purchaseResponse = purchaseHandler(mockRequest, mockResponse);
        expect(purchaseResponse).toEqual({
            total: "99.98",
            message: "order is processed successfully",
        });
    });

    it("should return an error if no order", async () => {
        const mockRequest = {} as Request;
        const mockResponse = {
            json: (t: any) => t,
            status: jest.fn().mockReturnThis(),
        } as unknown as Response;
        const noOrderResponse = purchaseHandler(mockRequest, mockResponse);
        expect(noOrderResponse).toEqual({ message: "no order found!" });
    });

    it("should return an error if the quantity is above the stock level", async () => {
        const mockRequest = {} as Request;
        mockRequest.body = {
            order: [{ productName: "Google Home", qty: 11 }],
        };
        const mockResponse = {
            json: (t: any) => t,
            status: jest.fn().mockReturnThis(),
        } as unknown as Response;

        const overStockResponse = purchaseHandler(mockRequest, mockResponse);
        expect(overStockResponse).toEqual({
            message: `Sorry, we don't have enough Google Home in our inventory. Please try again later`,
        });
    });
});
