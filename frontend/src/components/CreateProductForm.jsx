import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
		name: "",
		description: "",
		price: "",
		category: "",
		image: "",
	});

  const {createProduct,loading} = useProductStore();

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try {

          createProduct(newProduct)
          setNewProduct({name: "",
          description: "",
          price: "",
          category: "",
          image: "",})
      
    } catch (error) {
      console.log("Error in creating the product",error)
    }


  }

  const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();

			reader.onloadend = () => {
				setNewProduct({ ...newProduct, image: reader.result });
			};

			reader.readAsDataURL(file); // base64
		}
	};



  

 return (
		<motion.div
			className='bg-white shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto border border-gray-200'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<h2 className='text-2xl font-semibold mb-6 text-black'>Create New Product</h2>

			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-2'>
						Product Name
					</label>
					<input
						type='text'
						id='name'
						name='name'
						value={newProduct.name}
						onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
						className='w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-black 
						placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-black
						transition-colors duration-200'
						required
					/>
				</div>

				<div>
					<label htmlFor='description' className='block text-sm font-medium text-gray-700 mb-2'>
						Description
					</label>
					<textarea
						id='description'
						name='description'
						value={newProduct.description}
						onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
						rows='3'
						className='w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-black 
						placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-black
						transition-colors duration-200'
						required
					/>
				</div>

				<div>
					<label htmlFor='price' className='block text-sm font-medium text-gray-700 mb-2'>
						Price
					</label>
					<input
						type='number'
						id='price'
						name='price'
						value={newProduct.price}
						onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
						step='0.01'
						className='w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-black 
						placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-black
						transition-colors duration-200'
						required
					/>
				</div>

				<div>
					<label htmlFor='category' className='block text-sm font-medium text-gray-700 mb-2'>
						Category
					</label>
					<select
						id='category'
						name='category'
						value={newProduct.category}
						onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
						className='w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-black 
						focus:outline-none focus:ring-2 focus:ring-black focus:border-black
						transition-colors duration-200'
						required
					>
						<option value=''>Select a category</option>
						{categories.map((category) => (
							<option key={category} value={category}>
								{category}
							</option>
						))}
					</select>
				</div>

				<div className='mt-1 flex items-center'>
					<input type='file' id='image' className='sr-only' accept='image/*' onChange={handleImageChange} />
					<label
						htmlFor='image'
						className='cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md text-sm 
						font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 
						focus:ring-black focus:border-black transition-colors duration-200'
					>
						<Upload className='h-5 w-5 inline-block mr-2' />
						Upload Image
					</label>
					{newProduct.image && <span className='ml-3 text-sm text-gray-600'>Image uploaded</span>}
				</div>

				<button
					type='submit'
					className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
					text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none 
					focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 
					transition-colors duration-200'
					disabled={loading}
				>
					{loading ? (
						<>
							<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
							Loading...
						</>
					) : (
						<>
							<PlusCircle className='mr-2 h-5 w-5' />
							Create Product
						</>
					)}
				</button>
			</form>
		</motion.div>
	);
}

export default CreateProductForm;
