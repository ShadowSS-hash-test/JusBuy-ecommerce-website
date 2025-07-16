import React from 'react'
import { useProductStore } from '../stores/useProductStore'
import { motion } from "framer-motion"
import { Trash, Star } from "lucide-react"

export default function ProductsList() {
  const { products, deleteProduct, ToggleFeatureProduct } = useProductStore()

  return (
    <>

      <motion.div
        className="sm:hidden space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {products?.map(product => (
          <div key={product._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-full border border-gray-100"
              />
              <div className="flex-1">
                <h5 className="font-semibold text-black">{product.name}</h5>
                <p className="text-sm text-gray-600">₹{product.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{product.category}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => ToggleFeatureProduct(product._id)}
                className={
                  `p-2 rounded-full transition-colors ${product.isFeatured ? 'bg-black text-white' : 'bg-gray-200 text-black'}`
                }
              >
                <Star className="h-5 w-5" />
              </button>
              <button
                onClick={() => deleteProduct(product._id)}
                className="p-2 text-gray-600 hover:text-red-500 transition-colors"
              >
                <Trash className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </motion.div>

   
      <motion.div
        className="hidden sm:block bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Featured</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products?.map(product => (
              <tr key={product._id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-full object-cover border border-gray-200"
                      src={product.image}
                      alt={product.name}
                    />
                    <span className="ml-4 text-sm font-medium text-black">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">₹{product.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => ToggleFeatureProduct(product._id)}
                    className={`p-1 rounded-full transition-colors ${product.isFeatured ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}
                  >
                    <Star className="h-5 w-5" />
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </>
  )
}
