import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getCartProducts,addToCart,removeAllFromCart,updateQuantity } from "../controllers/cart.controllers.js";

const router = express.Router();
router.get("/getProducts",protectRoute,getCartProducts);
router.post("/add",protectRoute,addToCart);
router.delete("/remove",protectRoute,removeAllFromCart);
router.put("/update/:id",protectRoute,updateQuantity);






export default router;