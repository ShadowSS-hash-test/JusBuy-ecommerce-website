import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";

import { useProductStore } from "../stores/useProductStore";

const tabs = [
  { id: "create", label: "Create Product", icon: PlusCircle },
  { id: "products", label: "Products", icon: ShoppingBasket },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("create");
  const { fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50 text-black overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.h1
          className="text-4xl font-bold mb-8 text-black text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Admin Dashboard
        </motion.h1>

        <div className="flex justify-center mb-8 space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center 
                px-3 py-1 text-sm sm:px-4 sm:py-2 sm:text-base 
                rounded-md transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "bg-black text-white"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
            >
              <tab.icon className="mr-1 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "create" && <CreateProductForm />}
        {activeTab === "products" && <ProductsList />}
      </div>
    </div>
  );
};

export default AdminPage;
