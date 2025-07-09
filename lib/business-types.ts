// Common business types for MCA applications
export const BUSINESS_TYPES = [
  // Food & Beverage
  "Restaurant",
  "Fast Food",
  "Café/Coffee Shop", 
  "Bar/Tavern",
  "Catering Service",
  "Food Truck",
  "Bakery",
  "Pizza Shop",
  
  // Retail
  "Retail Store",
  "Convenience Store",
  "Grocery Store",
  "Clothing Store",
  "Electronics Store",
  "Auto Parts Store",
  "Jewelry Store",
  "Sporting Goods",
  "Beauty Supply",
  "Pet Store",
  
  // Services
  "Auto Repair",
  "Beauty Salon",
  "Barber Shop",
  "Spa/Wellness",
  "Dry Cleaning",
  "Laundromat",
  "Cleaning Service",
  "Landscaping",
  "Pest Control",
  "HVAC Service",
  
  // Healthcare
  "Medical Practice",
  "Dental Practice",
  "Veterinary Clinic",
  "Pharmacy",
  "Physical Therapy",
  "Chiropractic",
  "Mental Health",
  "Home Healthcare",
  
  // Professional Services
  "Legal Services",
  "Accounting",
  "Real Estate",
  "Insurance Agency",
  "Marketing Agency",
  "Consulting",
  "IT Services",
  "Web Design",
  
  // Construction & Trade
  "General Contractor",
  "Plumbing",
  "Electrical",
  "Roofing",
  "Flooring",
  "Painting",
  "Masonry",
  "Kitchen & Bath",
  
  // Transportation
  "Trucking",
  "Taxi/Rideshare",
  "Auto Sales",
  "Car Wash",
  "Gas Station",
  "Towing Service",
  "Delivery Service",
  "Moving Company",
  
  // Entertainment & Recreation
  "Gym/Fitness",
  "Entertainment Venue",
  "Event Planning",
  "Photography",
  "Travel Agency",
  "Hotel/Lodging",
  
  // Manufacturing & Wholesale
  "Manufacturing",
  "Wholesale",
  "Distribution",
  "Printing",
  "Packaging",
  
  // Other
  "E-commerce",
  "Online Business",
  "Franchise",
  "Non-Profit",
  "Other"
] as const

export type BusinessType = typeof BUSINESS_TYPES[number]

// Categorized business types for better organization
export const BUSINESS_CATEGORIES = {
  "Food & Beverage": [
    "Restaurant",
    "Fast Food", 
    "Café/Coffee Shop",
    "Bar/Tavern",
    "Catering Service",
    "Food Truck",
    "Bakery",
    "Pizza Shop"
  ],
  "Retail": [
    "Retail Store",
    "Convenience Store", 
    "Grocery Store",
    "Clothing Store",
    "Electronics Store",
    "Auto Parts Store",
    "Jewelry Store",
    "Sporting Goods",
    "Beauty Supply",
    "Pet Store"
  ],
  "Services": [
    "Auto Repair",
    "Beauty Salon",
    "Barber Shop", 
    "Spa/Wellness",
    "Dry Cleaning",
    "Laundromat",
    "Cleaning Service",
    "Landscaping",
    "Pest Control",
    "HVAC Service"
  ],
  "Healthcare": [
    "Medical Practice",
    "Dental Practice",
    "Veterinary Clinic",
    "Pharmacy",
    "Physical Therapy",
    "Chiropractic",
    "Mental Health",
    "Home Healthcare"
  ],
  "Professional": [
    "Legal Services",
    "Accounting",
    "Real Estate",
    "Insurance Agency",
    "Marketing Agency",
    "Consulting",
    "IT Services",
    "Web Design"
  ],
  "Construction": [
    "General Contractor",
    "Plumbing",
    "Electrical",
    "Roofing",
    "Flooring",
    "Painting",
    "Masonry",
    "Kitchen & Bath"
  ],
  "Transportation": [
    "Trucking",
    "Taxi/Rideshare",
    "Auto Sales",
    "Car Wash",
    "Gas Station",
    "Towing Service",
    "Delivery Service",
    "Moving Company"
  ],
  "Other": [
    "Gym/Fitness",
    "Entertainment Venue",
    "Event Planning",
    "Photography",
    "Travel Agency",
    "Hotel/Lodging",
    "Manufacturing",
    "Wholesale",
    "Distribution",
    "Printing",
    "Packaging",
    "E-commerce",
    "Online Business",
    "Franchise",
    "Non-Profit",
    "Other"
  ]
}
