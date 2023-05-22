import { Request, Response } from "express";
import { inventoryData } from "./db";
import { ItemProp, OrderProps, TypedRequest } from "../types";

export const rootHandler = (_req: Request, res: Response) => {
    return res.send("API is running on port 8000");
};

export const purchaseHandler = (
    req: TypedRequest,
    res: Response<{ message: string; total?: string }>
) => {
    if (!req.body) return res.status(200).json({ message: "no order found!" });

    const { order } = req.body;
    const orderData = Object.values(order);
    if ((orderData.length = 0)) {
        res.status(200).json({ message: "no order found!" });
    }

    const raspBerryItem = inventoryData.find(
        (item: ItemProp) => item.Name === "Raspberry Pi B"
    );
    const productAlexaPrice = inventoryData.find(
        (item: ItemProp) => item.Name === "Alexa Speaker"
    )?.Price;

    let finalOrder: OrderProps[] = [];

    //check quantity is valid
    for (let i = 0; i < order.length; i++) {
        const { productName, qty } = order[i];
        const currentProduct = inventoryData.find(
            (item: ItemProp) => item.Name === productName
        );
        if (currentProduct && qty > currentProduct.Qty)
            return res.status(200).json({
                message: `Sorry, we don't have enough ${productName} in our inventory. Please try again later`,
            });
    }

    order.forEach((item: OrderProps) => {
        const { productName, qty } = item;
        const currentProduct = inventoryData.find(
            (item: ItemProp) => item.Name === productName
        );
        finalOrder.push({
            productName,
            qty,
            price: currentProduct?.Price,
        });
    });

    // if macbook is purchased, add Raspberry Pi B to final order
    const productMacbook = finalOrder.find(
        (item: OrderProps) => item.productName === "Macbook Pro"
    );
    if (
        productMacbook &&
        raspBerryItem &&
        productMacbook.qty <= raspBerryItem.Qty
    ) {
        finalOrder.push({
            productName: "Raspberry Pi B",
            qty: productMacbook.qty,
            price: raspBerryItem.Price,
        });
    } else if (
        productMacbook &&
        raspBerryItem &&
        productMacbook.qty > raspBerryItem.Qty
    ) {
        finalOrder.push({
            productName: "Raspberry Pi B",
            qty: raspBerryItem.Qty,
            price: raspBerryItem.Price,
        });
    }

    // if buy 3 Google Homes for the price of 2
    const productGoogleHomeIndex = finalOrder.findIndex(
        (item: OrderProps) => item.productName === "Google Home"
    );
    if (productGoogleHomeIndex !== -1) {
        const productQty = finalOrder[productGoogleHomeIndex].qty;
        finalOrder[productGoogleHomeIndex].qty = Math.ceil(
            (productQty / 3) * 2
        );
    }

    // if buying more than 3 Alexa Speakers will have a 10% discount on all Alexa speakers
    const productAlexaIndex = finalOrder.findIndex(
        (item: OrderProps) => item.productName === "Alexa Speaker"
    );
    if (productAlexaIndex !== -1 && productAlexaPrice) {
        const productQty = finalOrder[productAlexaIndex].qty;
        if (productQty >= 3) {
            const newAlexaPrice = productAlexaPrice * 0.9;
            finalOrder[productAlexaIndex].price = newAlexaPrice;
        }
    }

    const result = finalOrder.reduce((acc: number, item: OrderProps) => {
        return acc + item.price! * item.qty;
    }, 0);

    return res.status(200).json({
        total: result.toFixed(2),
        message: "order is processed successfully",
    });
};
