// Mock API for dining halls - will be replaced with real API calls later
export const mockDiningHalls = [
  {
    id: 1,
    name: "North Campus Dining",
    shortName: "North",
    isOpen: true,
    hours: "7:00 AM - 10:00 PM",
    description: "Main dining hall with diverse menu options",
    image: "/images/north-dining.jpg",
    currentMeal: "dinner",
    popularItems: ["Grilled Chicken", "Caesar Salad", "Pasta Bar"]
  },
  {
    id: 2,
    name: "South Campus Dining",
    shortName: "South", 
    isOpen: true,
    hours: "7:00 AM - 9:00 PM",
    description: "Casual dining with comfort food favorites",
    image: "/images/south-dining.jpg",
    currentMeal: "dinner",
    popularItems: ["Pizza", "Burgers", "Stir Fry"]
  },
  {
    id: 3,
    name: "Student Union Food Court",
    shortName: "Union",
    isOpen: false,
    hours: "11:00 AM - 8:00 PM",
    description: "Fast-casual options and grab-and-go meals",
    image: "/images/union-dining.jpg",
    currentMeal: "closed",
    popularItems: ["Sushi", "Sandwiches", "Smoothies"]
  },
  {
    id: 4,
    name: "West Village Café",
    shortName: "West",
    isOpen: true,
    hours: "8:00 AM - 6:00 PM",
    description: "Coffee, pastries, and light meals",
    image: "/images/west-cafe.jpg",
    currentMeal: "all-day",
    popularItems: ["Coffee", "Pastries", "Salads"]
  }
];

// Mock API function to get dining halls
export const getDiningHalls = async () => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDiningHalls);
    }, 500);
  });
};

// Mock API function to get dining hall by ID
export const getDiningHallById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const diningHall = mockDiningHalls.find(hall => hall.id === parseInt(id));
      if (diningHall) {
        resolve(diningHall);
      } else {
        reject(new Error('Dining hall not found'));
      }
    }, 300);
  });
};
