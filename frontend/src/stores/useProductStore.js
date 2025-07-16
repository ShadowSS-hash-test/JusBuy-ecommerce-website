import {create} from "zustand"
import axiosInstance from "../util/axios"
import {toast} from "react-hot-toast"


export const useProductStore = create((set,get)=>({
 products:[],
 loading:false,

  createProduct: async(product)=>{
      set({loading:true});
        try {

        
          const res = await axiosInstance.post("/products/create",product)
          set((prev)=>( {products:[...prev.products,res.data.data], loading:false}))
          toast.success("Successfully created the product")
          
        } catch (error) {
          toast.error(error.response.data.err || "Failed to create product");
			    set({ loading: false });
        }
  },

  fetchProducts: async()=>{
      set({loading:true});
        try {

        
          const res = await axiosInstance.get("/products")
          
          set((prev)=>( {products:res.data.data, loading:false}))
          
          
        } catch (error) {
         
          toast.error(error.response.data.err || "Failed to fetch productss");
			    set({ loading: false });
        }
  },

  fetchFeaturedProducts: async()=>{
     set({loading:true});
        try {

        
          const res = await axiosInstance.get("/products/featured")
          
          set((prev)=>( {products:res.data.data, loading:false}))
          
          
        } catch (error) {
         
          toast.error(error.response.data.err || "Failed to fetch productss");
			    set({ loading: false });
        }
  },

  deleteProduct: async(id)=>{

     set({loading:true})
        try {
           const res = await axiosInstance.delete(`products/delete/${id}`)

           set((prev)=>({ loading: false, products: prev.products.filter((product)=>product._id !== id)}));

         
        } catch (error) {
          toast.error(error.res.data.err || "Failed to delete product");
			    set({ loading: false });
          
        }

  },

  ToggleFeatureProduct: async(id)=>{
        set({loading:true})
        try {
          const res = await axiosInstance.put(`/products/featured/toggle/${id}`)

          set((prev)=>({ loading: false, products: prev.products.map((product)=>product._id === id ? {...product, isFeatured: res.data.data.isFeatured} : product)}));
          
        } catch (error) {
         toast.error(error.res.data?.err || "Failed to toggle feature");
			    set({ loading: false });
        }
  },

  fetchProductsByCategory: async(category)=>{
    set({loading:true})
    try {
      const res = await axiosInstance.get(`/products/category/${category}`)
      set({products:res.data.data,loading:false})
    } catch (error) {
      set({loading: false });
			toast.error(error.res.data.error || "Failed to fetch products by category");
    }
  }


}))