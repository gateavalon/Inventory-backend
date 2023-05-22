import { createApp } from "./index";
import request from "supertest";

describe("Integration test", function () {
    let app: any;

    beforeAll(async () => {
        app = await createApp();
    });

    it("should run server successfully", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toEqual(200);
        expect(res.text).toBe("API is running on port 8000");
    });

    it("should return successful state", async () => {
        const reqBody = {
            order: [{ productName: "Google Home", qty: 2 }],
        };

        const response = await request(app).post("/purchase").send(reqBody);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            total: "99.98",
            message: "order is processed successfully",
        });
    });
});
