import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const UserCartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCartStore();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-4 sm:space-y-0 sm:space-x-6">
      {/* Image */}
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-48 object-cover rounded border border-gray-100 sm:w-32 sm:h-32 flex-shrink-0"
      />

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h5 className="text-lg font-semibold text-black">{item.name}</h5>
          <p className="mt-1 text-sm text-gray-500">{item.description}</p>
        </div>

        <button
          onClick={() => removeFromCart(item._id)}
          className="mt-2 text-sm text-gray-600 hover:text-black hover:underline inline-flex items-center"
        >
          <Trash className="mr-1" /> Remove
        </button>
      </div>

      {/* Quantity & Price */}
      <div className="flex items-center justify-between space-x-4 sm:flex-col sm:items-end sm:space-x-0 sm:space-y-2">
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
          <button
            onClick={() => updateQuantity(item._id, item.quantity - 1)}
            className="px-2 py-1 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <Minus className="text-black" size={16} />
          </button>
          <span className="px-3 text-black">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item._id, item.quantity + 1)}
            className="px-2 py-1 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <Plus className="text-black" size={16} />
          </button>
        </div>
        <p className="text-lg font-bold text-black sm:mt-2">${item.price}</p>
      </div>
    </div>
  );
};

export default UserCartItem;
