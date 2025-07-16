import Product from "../models/product.model.js";

export  const addToCart = async(req,res)=>{
    try {
        const {productID} = req.body
        const user = req.user;
  
     

     

        const existingItem = user.cartItems.find(item => item.id === productID)

        if(existingItem){
            existingItem.quantity++;

        }else{
            user.cartItems.push(productID)
           
        }

        await user.save();
        res.status(200).json({ 
            message:"Successfully added the item to cart",
            items: user.cartItems
        }) 

        

        
    } catch (error) {
        console.log("error in add to cart controller" + error.message)
        res.status(500).json({
            message:"Failed to add to cart",
            error: error.message
        })
    }
}

export const removeAllFromCart = async(req,res)=>{
    try {

      

        const {productId} = req.body;
        const user = req.user;


        if(!productId){
            user.cartItems = [];
        }else{
            user.cartItems = user.cartItems.filter(item=>item.id!==productId)
        }

        await user.save();
        res.status(200).json({
            message:"Removal of products/product from the cart is finished",
            cart:user.cartItems
        })

        

        
    } catch (error) {
        console.log("error in removeAllFromCart controller" + error.message)
        res.status(500).json({
            message:"Server error",
            error: error.message
        })
    }
}

export const updateQuantity = async(req,res)=>{
     try {
        const {id:productID} = req.params;
        const {quantity} = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find((item)=>item.id===productID)

        if(existingItem){
            if(quantity == 0){
                user.cartItems = user.cartItems.filter(item=>item.id!==productID)
                await user.save();
                return res.status(200).json({
                    message:"Successfully updated the quantity of cart item",
                    cartItems: user.cartItems
                })
            }

            existingItem.quantity = quantity;
                await user.save();
                return res.status(200).json({
                    message:"Successfully updated the quantity of cart item",
                    cartItems: user.cartItems
                })

        }else{
            return res.status(404).json({
                message:"The product does not exist"
            })
        }
        
     } catch (error) {
        console.log("Error in updateQuantity controller" + error.message)
           res.status(500).json({
            message:"Server error",
            error: error.message
        })
     }
}

export const getCartProducts = async(req,res)=>{
    try {
        const products = await Product.find({_id:{$in:req.user.cartItems}});
        
        const cartItems = products.map(product=>{
            const item = req.user.cartItems.find(cartItem=>cartItem.id===product.id)
            return {...product.toJSON(), quantity: item.quantity}
        })

        res.status(200).json({
            message:"Successfully fetched all cart products",
            cartProducts: cartItems
        })
        
    } catch (error) {
        console.log("Error in getCartProducts controller" + error.message)
    }
}

