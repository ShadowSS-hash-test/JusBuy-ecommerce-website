import express from "express"
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js"
import { dbConnect } from "./config/database.js";
import cookieParser from "cookie-parser";
import cartRoutes from "./routes/cart.routes.js"
import path from "path";


dotenv.config();


const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;
app.use(express.json({limit:"10mb"}))
app.use(cookieParser())
app.use("/api/auth", authRoutes)
app.use("/api/products",productRoutes)

app.use("/api/cart",cartRoutes)

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}




const server = app.listen(PORT,()=>{
    console.log(`Server has started at PORT ${PORT}`);
    dbConnect()
  
})



