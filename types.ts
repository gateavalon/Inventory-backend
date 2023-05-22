import { Send } from "express-serve-static-core";

export interface OrderProps {
    productName: string;
    qty: number;
    price?: number;
}

export interface ItemProp {
    SKU: string;
    Name: string;
    Price: number;
    Qty: number;
}

export interface TypedRequest extends Express.Request {
    body: {
        order: { productName: string; qty: number }[];
    };
}
