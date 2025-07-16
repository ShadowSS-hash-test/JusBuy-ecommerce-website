import express from "express";
import { getAllProducts, getFeaturedProducts,createAProduct, deleteAProduct, getRecommendedProducts,getProductsByCategory, ToggleFeaturedProducts } from "../controllers/product.controllers.js";
import { protectRoute,adminRoute } from "../middleware/auth.middleware.js";





const router = express.Router();
router.get("/",protectRoute,adminRoute,getAllProducts);
router.get("/featured",getFeaturedProducts)
router.get("/recommendations",getRecommendedProducts)
router.post("/create",protectRoute,adminRoute,createAProduct)
router.delete("/delete/:id",protectRoute,adminRoute,deleteAProduct)
router.get("/category/:category",getProductsByCategory)
router.put("/featured/toggle/:id",protectRoute,adminRoute,ToggleFeaturedProducts)


export default router