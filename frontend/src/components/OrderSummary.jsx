import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import toast from "react-hot-toast";

const OrderSummary = () => {
	const { total, subtotal } = useCartStore();

	const savings = subtotal - total;
	const formattedSubtotal = subtotal.toFixed(2);
	const formattedTotal = total.toFixed(2);
	const formattedSavings = savings.toFixed(2);

    const {clearCart} = useCartStore();

	return (
		<motion.div
	className='space-y-4 rounded-md bg-white p-4 shadow-sm sm:p-6'
	initial={{ opacity: 0, y: 20 }}
	animate={{ opacity: 1, y: 0 }}
	transition={{ duration: 0.5 }}
>
	<p className='text-xl font-semibold text-black'>Order summary</p>

	<div className='space-y-4'>
		<div className='space-y-2'>
			

			<dl className='flex items-center justify-between border-t border-gray-300 pt-2'>
				<dt className='text-base font-bold text-black'>Total</dt>
				<dd className='text-base font-bold text-black'>${formattedTotal}</dd>
			</dl>
		</div>

		<motion.button
			className='w-full rounded-md border hover:cursor-pointer border-black bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white hover:text-black'
			whileHover={{ scale: 1.03 }}
			whileTap={{ scale: 0.97 }}
            onClick={()=>{  toast.success("Successfully placed Order",{id:"purchase"}) 
            clearCart()}}
		>
			Buy Now
		</motion.button>

		<div className='flex items-center justify-center gap-2'>
			<span className='text-sm text-gray-500'>or</span>
			<Link
				to='/'
				className='inline-flex items-center gap-1 text-sm font-medium text-black underline hover:no-underline'
			>
				Continue Shopping
				<MoveRight size={16} />
			</Link>
		</div>
	</div>
</motion.div>

	);
};

export default OrderSummary;
