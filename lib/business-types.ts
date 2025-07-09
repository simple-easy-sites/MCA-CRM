// IRS-style business type categories with details
export const BUSINESS_CATEGORIES = [
  "Arts & Entertainment",
  "Construction", 
  "Food & Beverage",
  "Healthcare",
  "Hospitality",
  "Insurance",
  "Professional Services",
  "Retail",
  "Transportation",
  "Other"
] as const

export type BusinessCategory = typeof BUSINESS_CATEGORIES[number]

// Business details by category
export const BUSINESS_DETAILS: Record<BusinessCategory, string[]> = {
  "Arts & Entertainment": [
    "Movie Theater",
    "Live Music Venue", 
    "Art Gallery",
    "Entertainment Center",
    "Photography Studio",
    "Event Planning",
    "Dance Studio",
    "Recording Studio"
  ],
  
  "Construction": [
    "General Contractor",
    "Plumbing", 
    "Electrical",
    "Roofing",
    "Flooring",
    "Painting",
    "HVAC",
    "Masonry",
    "Kitchen & Bath",
    "Landscaping"
  ],
  
  "Food & Beverage": [
    "Restaurant",
    "Fast Food",
    "Café/Coffee Shop",
    "Bar/Tavern", 
    "Catering Service",
    "Food Truck",
    "Bakery",
    "Pizza Shop",
    "Deli/Sandwich Shop",
    "Ice Cream Shop"
  ],
  
  "Healthcare": [
    "Medical Practice",
    "Dental Practice", 
    "Veterinary Clinic",
    "Pharmacy",
    "Physical Therapy",
    "Chiropractic",
    "Mental Health",
    "Optometrist",
    "Dermatology",
    "Home Healthcare"
  ],
  
  "Hospitality": [
    "Hotel/Motel",
    "Bed & Breakfast",
    "Resort",
    "Vacation Rental",
    "Event Venue",
    "Wedding Venue",
    "Conference Center"
  ],
  
  "Insurance": [
    "Insurance Agency",
    "Life Insurance",
    "Auto Insurance", 
    "Health Insurance",
    "Property Insurance",
    "Business Insurance"
  ],
  
  "Professional Services": [
    "Legal Services",
    "Accounting",
    "Marketing Agency",
    "Consulting",
    "IT Services",
    "Web Design",
    "Financial Services",
    "Business Services",
    "Real Estate Agency",
    "Property Management"
  ],
  
  "Retail": [
    "Clothing Store",
    "Electronics Store",
    "Grocery Store",
    "Convenience Store",
    "Auto Parts Store",
    "Jewelry Store",
    "Sporting Goods",
    "Beauty Supply",
    "Pet Store",
    "Liquor Store",
    "Hardware Store",
    "Furniture Store"
  ],
  
  "Transportation": [
    "Trucking",
    "Taxi/Rideshare",
    "Auto Sales",
    "Car Wash", 
    "Gas Station",
    "Towing Service",
    "Delivery Service",
    "Moving Company",
    "Auto Repair"
  ],
  
  "Other": [
    "Manufacturing",
    "Technology/Software",
    "Gym/Fitness",
    "Beauty Salon",
    "Barber Shop",
    "Spa/Wellness",
    "Dry Cleaning",
    "Laundromat",
    "Cleaning Service",
    "Pest Control",
    "Travel Agency",
    "Franchise",
    "Non-Profit",
    "Other"
  ]
}

// Get all details for a specific category
export function getBusinessDetails(category: BusinessCategory): string[] {
  return BUSINESS_DETAILS[category] || []
}

// Get all categories as array
export function getAllCategories(): BusinessCategory[] {
  return [...BUSINESS_CATEGORIES]
}
