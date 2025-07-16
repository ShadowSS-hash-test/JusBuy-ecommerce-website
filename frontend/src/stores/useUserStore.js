import {create} from "zustand"
import axiosInstance from "../util/axios"
import {toast} from "react-hot-toast"

export const useUserStore = create((set,get)=>({
    user:null,
    loading:false,
    checkingAuth:false,

    signup: async({name,email,password,confirmPassword,role})=>{
        set({loading:true})
        if(password!==confirmPassword){
          set({loading:false})
            return toast.error("Make sure the passwords match")
        }

        try {
              const res = await axiosInstance.post("/auth/signup",{name,email,password,role})
              set({loading:false,user:res.data.data})
              toast.success("Signed in successfully")  
              

            
        } catch (error) {
            set({loading:false});
            toast.error(error.response.data.message || "An error occurred")
            
        }

      




    },

    login: async({email,password})=>{
          set({loading:true})
      

        try {
              const res = await axiosInstance.post("/auth/login",{email,password})
              set({loading:false,user:res.data.data})
              toast.success("Logged in successfully")  
        } catch (error) {
            set({loading:false});
            toast.error(error.response.data.message || "An error occurred")
            
        }


    },

    	checkAuth: async () => {
		set({ checkingAuth: true });
		try {
			const response = await axiosInstance.get("/auth/profile");
			set({ user: response.data, checkingAuth: false });
		} catch (error) {
			console.log(error.message);
			set({ checkingAuth: false, user: null });
		}
	},

    logout: async()=>{
           try {
            await axiosInstance.post("/auth/logout");
            toast.success("Logged out successfully")
            set({user:null})
            
           } catch (error) {
            console.log(error)
             toast.error(error.response?.data?.message || "An error occured during logout")
           }
    },

    refreshToken: async () => {
		
		if (get().checkingAuth) return;

		set({ checkingAuth: true });
		try {
			const response = await axiosInstance.post("/auth/refresh-token");
			set({ checkingAuth: false });
			return response.data;
		} catch (error) {
			set({ user: null, checkingAuth: false });
			throw error;
		}
	},


}))

let refreshPromise = null;

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
			
				if (refreshPromise) {
					await refreshPromise;
					return axiosInstance(originalRequest);
				}

		
				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axiosInstance(originalRequest);
			} catch (refreshError) {
				
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);