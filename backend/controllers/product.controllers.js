import Product from "../models/product.model.js"
import { redis } from "../config/redis.js";
import cloudinary from "../config/cloudinary.js";

async function updateFeaturedProductsCache(){
    try {

        const featuredProducts = await Product.find({isFeatured:true}).lean();
        await redis.set("featured_products",JSON.stringify(featuredProducts));
        
    } catch (error) {
        console.log("error in update featured products cache controller" + error.message)
    }
}

export  const getAllProducts = async(req,res)=>{
     try {
        const products = await Product.find({});

        return res.status(200).json({
            message:"Successfully fetched all products",
            data: products
        })


        
        
     } catch (error) {
        console.log("Error in getAllProducts controller:", error.message);
        return res.status(500).json({
            message:"Internal server error",
            err: error.message
        })
        
     }
}

export const getFeaturedProducts = async(req,res)=>{

    
    try {
    //try fetching from redis first
     let featuredProducts = await redis.get(`featured_products`);

     if(featuredProducts){
        return res.json({message:"fetched all featured products successfully", data:JSON.parse(featuredProducts)})
     }
     
   //if its not present in redis, fetch from the mongodb
   featuredProducts =  await Product.find({isFeatured:true}).lean()

   if(!featuredProducts)
   {
    return res.status(404).json({
        message:"No featured products found"
    })
   }

 //update redis for future quick access
  await redis.set(`featured_products`,JSON.stringify(featuredProducts))


    return res.status(200).json({message:"fetched all featured products successfully", data:featuredProducts})
        
    } catch (error) {
        console.log(`error in featured products controller: ${error.message}`)

        return res.status(500).json({
            message:"failed to fetch featured products"
        })
    }
 
}

export const createAProduct = async (req,res)=>{
        try {
            const {name,description,price,image,category} = req.body;
            let cloudinaryres = null;

            if(!name || !description || !price || !category)
            {
                return res.status(401).json({
                    message:"Make sure all fields are filled"
                })
            }

 
            if(image)
            {
               cloudinaryres = await cloudinary.uploader.upload(image,{folder:"products"})
            }

            const product = await Product.create({
                name,
                description,
                price,
                image: cloudinaryres?.secure_url ? cloudinaryres.secure_url : " ",
                category


            })

            res.status(201).json({
                message:"successfully created a product",
                data: product
            })

            
        } catch (error) {
            console.log(`error in create a product controller: ${error.message}`)

            res.status(500).json({
                message:"Failed to create a product, internal server error",
                err: error.message
            })
        }
}

export const deleteAProduct = async(req,res)=>{
    try {
          const prodId = req.params.id;

          const product = await Product.findById(prodId)

          if(!product){
            return res.status(404).json({
                message:"Product not found"
            })
          }

        if(product.image){
            const publicID = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicID}`)

                
            } catch (error) {
                console.log(`error detected while deleting an image from cloudinary ${error}`)
            }
        }

        await Product.findByIdAndDelete(prodId);

    
        res.status(201).json({
            message:"Product deleted successfully",
        })

   
        
    } catch (error) {
        console.log("Error in deleteAProduct controller", error.message)
        res.status(500).json({
            message:"Server error",
            err: error.message
            
        })
    }
}

export const getRecommendedProducts = async(req,res)=>{
    try {

     const products = await Product.aggregate([
  { $match: { isFeatured: true } },
  { $sample: { size: 2 } },
  {
    $project: {
      _id: 1,
      name: 1,
      description: 1,
      image: 1,
      price: 1,
    },
  },
]);

           return res.status(200).json({
            message:"Successfully fetched all recommended products",
            data: products
        })
        
    } catch (error) {
        console.log("Error in getRecommendedProducts controller" + error.message);
      res.status(500).json({
        message:"Server Error",
        error:error.message
      })
        
    }
}

export const getProductsByCategory = async(req,res)=>{
    try {
        const category = req.params.category;

        const products = await Product.find({category:category, isFeatured:true})

           return res.status(200).json({
            message:"Successfully fetched all products by given category",
            data: products
        })
    } catch (error) {
        console.log("Error in getProductsByCategory controller" + error.message);
        res.status(500).json({
            message:"Server Error",
            error: error.message
        })
    }
}

export const ToggleFeaturedProducts = async(req,res)=>{
    try {
        

        const product = await Product.findById(req.params.id);
       
        if(product){
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await  product.save();
            await updateFeaturedProductsCache();
            res.status(200).json({
                message:"Successfully toggled the selected product",
                data:updatedProduct
            })

        }
        
    } catch (error) {
        res.status(500).json({
            message:"Server Error",
            error:error.message
        })
    }
}