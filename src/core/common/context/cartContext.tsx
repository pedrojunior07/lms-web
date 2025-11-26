import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "react-toastify";
import { useEnrollments } from "./enrollmentContext";

// Define types
interface Course {
  id: number;
  title: string;
  price: number;
  image?: string;
  [key: string]: any; // Allow additional properties
}

interface CartItem extends Course {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: number) => void;
  clearCart: () => void;
  totalPrice: number;
  cartCount: number;
}

// Create context with default values
const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  totalPrice: 0,
  cartCount: 0,
});

// Define props for CartProvider
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { isEnrolled } = useEnrollments();

  // Load cart from localStorage when component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart) as CartItem[];
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        }
      } catch (error) {
        console.error("Failed to parse cart items", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (course: Course) => {
    if (isEnrolled(course.id)) {
      toast.info("Voce ja esta inscrito neste curso.");
      return;
    }

    setCartItems((prevItems) => {
      // Check if course is already in cart
      const existingItem = prevItems.find((item) => item.id === course.id);
      if (existingItem) {
        return prevItems; // Don't add duplicates
      }
      return [...prevItems, { ...course, quantity: 1 }];
    });
  };

  const removeFromCart = (courseId: number) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== courseId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.price || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        totalPrice,
        cartCount: cartItems.length,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
