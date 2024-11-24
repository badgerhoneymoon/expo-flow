"use server"

// This is a placeholder until we implement database storage
// Replace with actual database query later
export async function getCompanyProfile() {
  return {
    companyName: "Blink Charging",
    website: "blinkcharging.com",
    description: "Leading provider of EV charging stations and networks. We design, manufacture, and operate charging infrastructure for electric vehicles.",
    minimumDealSize: "50k-100k",
    targetMarkets: "Hotels, Multi-Unit Residential, Commercial Real Estate, Retail, Municipalities",
    targetJobTitles: "Facility Manager, Property Manager, Sustainability Manager, Operations Manager",
    icpDescription: "Commercial properties with multiple parking spaces, high-traffic locations, or multi-unit residential buildings. Looking for locations with significant dwell time and EV adoption in the area. Must have budget for enterprise-level charging infrastructure."
  }
} 