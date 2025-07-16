import { create } from "zustand";
import axiosInstance from "../util/axios";
import toast from "react-hot-toast";



export const useCartStore = create((set,get)=>({
    cart: [],
    total: 0,
    subtotal: 0,

    getCartItems: async()=>{
        try {
            const res = await axiosInstance.get("/cart/getProducts")
            set({cart: res.data.cartProducts})
            get().calculateTotals();
        } catch (error) {
            set({cart:[]});
            toast.error(error.response.data.message || "an error occured")
        }
    },

  addToCart: async (product) => {
		try {
			await axiosInstance.post("/cart/add", { productID: product._id });
			toast.success("Product added to cart");

			set((prevState) => {
				const existingItem = prevState.cart.find((item) => item._id === product._id);
				const newCart = existingItem
					? prevState.cart.map((item) =>
							item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
					  )
					: [...prevState.cart, { ...product, quantity: 1 }];
				return { cart: newCart };
			});

            get().calculateTotals();
			
		} catch (error) {
			toast.error(error.response.data.message || "An error occurred");
		}
	},

    calculateTotals: () => {
		const { cart } = get();
		const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
		let total = subtotal;

		set({ subtotal, total });
	},

	removeFromCart: async (productId) => {
		await axiosInstance.delete(`/cart/remove`, { data:  {productId}  });
		set((prevState) => ({ cart: prevState.cart.filter((item) => item._id !== productId) }));
		get().calculateTotals();
	},

	updateQuantity: async (productId, quantity) => {
		if (quantity === 0) {
			get().removeFromCart(productId);
			return;
		}

		await axiosInstance.put(`/cart/update/${productId}`, { quantity });
		set((prevState) => ({
			cart: prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item)),
		}));

		get().calculateTotals();
	},

	clearCart: async()=>{
       set({cart:[]});
	   get().removeFromCart(false)

	}

}))