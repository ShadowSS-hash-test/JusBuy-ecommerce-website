import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";






const ProductCard = ({ product }) => {
	
 const {user} = useUserStore();
 const {addToCart} = useCartStore();


    const handleCart = ()=>{

    if(user)
    {
		addToCart(product);
       

    }

    else{
        toast.error("Please login to add to card", {id:"login"})
    }
    
}

	
	return (
<div className='flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-200 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300'>
	<div className='relative mx-3 mt-3 h-60 overflow-hidden rounded-xl'>
		<img 
			className='absolute inset-0 w-full h-full object-cover' 
			src={product.image} 
			alt='product image' 
		/>
		
	</div>

	<div className='mt-4 px-5 pb-5'>
		<h5 className='text-xl font-semibold tracking-tight text-black'>{product.name}</h5>
		<div className='mt-2 mb-5 flex items-center justify-between'>
			<p>
				<span className='text-3xl font-bold text-black'>₹{product.price}</span>
			</p>
		</div>
		<button
			className='flex items-center justify-center rounded-lg bg-black px-5 py-2.5 text-center text-sm font-medium  hover:cursor-pointer
			 text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-colors duration-200' onClick={handleCart}
		>
			<ShoppingCart size={22} className='mr-2' />
			Add to cart
		</button>
	</div>
</div>
	);
};
export default ProductCard;