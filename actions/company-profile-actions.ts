"use server"

// This is a placeholder until we implement database storage
// Replace with actual database query later
export async function getCompanyProfile() {
  return {
    companyName: "Blink Charging",
    website: "blinkcharging.com",
    description: "Leading provider of EV charging stations and networks. We design, manufacture, and operate charging infrastructure for electric vehicles.",
    minimumDealSize: "50k-100k",
    targetMarkets: "Hotels, Multi-Unit Residential, Commercial Real Estate, Retail, Municipalities, State Government Departments, Energy & Climate Change Offices, Transport Authorities, Local Councils",
    targetJobTitles: "Facility Manager, Property Manager, Sustainability Manager, Operations Manager",
    icpDescription: `Our ideal customers fall into two main categories:

1. Commercial & Real Estate Sector:
- Property management companies and real estate developers
- Commercial properties with parking facilities (any size)
- Multi-unit residential buildings
- Retail locations and shopping centers
- Hotels and hospitality venues
- Office buildings and business parks
Key indicators: Properties with regular tenant/visitor parking needs, interest in sustainability or tenant amenities

2. Public Sector:
- Government departments and agencies
- Municipalities and local councils
- Transport authorities
Key indicators: Focus on sustainable transport, climate initiatives, or public infrastructure

Disqualifying Factors (any of these):
- Single charging station requirements
- Small properties
- No clear expansion plans for EV infrastructure

Qualifying Factors (any of these):
- Areas with growing EV adoption
- Interest in sustainability initiatives
- Looking to add tenant/visitor amenities
- Planning infrastructure improvements
- Budget available for property improvements`,
  }
} 