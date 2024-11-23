"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CompanyProfile {
  companyName: string
  website: string
  description: string
  industry: string
  companySize: string
  icpDescription: string
  targetMarkets: string
  targetJobTitles: string
  targetCompanySize: string
  minimumDealSize: string
  salesCycle: string
  keyTechnologies: string
  decisionMakingCriteria: string
}

export default function CompanyProfile() {
  const [profile, setProfile] = useState<CompanyProfile>({
    companyName: "",
    website: "",
    description: "",
    industry: "",
    companySize: "",
    icpDescription: "",
    targetMarkets: "",
    targetJobTitles: "",
    targetCompanySize: "",
    minimumDealSize: "",
    salesCycle: "",
    keyTechnologies: "",
    decisionMakingCriteria: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add API call to save profile
    console.log(profile)
  }

  const handleChange = (
    field: keyof CompanyProfile,
    value: string
  ) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Company Profile</h1>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input 
                  id="company-name" 
                  placeholder="Enter company name"
                  value={profile.companyName}
                  onChange={e => handleChange('companyName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-website">Company Website</Label>
                <Input 
                  id="company-website" 
                  placeholder="Enter company website"
                  value={profile.website}
                  onChange={e => handleChange('website', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Company Details */}
            <div className="space-y-2">
              <Label htmlFor="company-description">Company Description</Label>
              <Textarea 
                id="company-description" 
                placeholder="What does your company do? What problems do you solve?"
                rows={4}
                value={profile.description}
                onChange={e => handleChange('description', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input 
                  id="industry" 
                  placeholder="e.g., Clean Technology, SaaS"
                  value={profile.industry}
                  onChange={e => handleChange('industry', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-size">Company Size</Label>
                <Select 
                  onValueChange={value => handleChange('companySize', value)}
                  defaultValue={profile.companySize}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="501+">501+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ICP Information */}
            <div className="space-y-2">
              <Label htmlFor="icp-description">
                Ideal Customer Profile (ICP)
              </Label>
              <Textarea 
                id="icp-description" 
                placeholder="Describe your ideal customer - what makes them a perfect fit for your solution?"
                rows={4}
                value={profile.icpDescription}
                onChange={e => handleChange('icpDescription', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target-markets">Target Markets/Industries</Label>
                <Input 
                  id="target-markets" 
                  placeholder="e.g., Manufacturing, Retail, Healthcare"
                  value={profile.targetMarkets}
                  onChange={e => handleChange('targetMarkets', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target-job-titles">Target Job Titles</Label>
                <Input 
                  id="target-job-titles" 
                  placeholder="e.g., CTO, Sustainability Manager, Operations Director"
                  value={profile.targetJobTitles}
                  onChange={e => handleChange('targetJobTitles', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Deal Criteria */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target-company-size">Target Company Size</Label>
                <Select 
                  onValueChange={value => handleChange('targetCompanySize', value)}
                  defaultValue={profile.targetCompanySize}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startup">Startup (1-50)</SelectItem>
                    <SelectItem value="smb">SMB (51-500)</SelectItem>
                    <SelectItem value="mid-market">Mid-Market (501-2000)</SelectItem>
                    <SelectItem value="enterprise">Enterprise (2000+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimum-deal-size">Minimum Deal Size</Label>
                <Select 
                  onValueChange={value => handleChange('minimumDealSize', value)}
                  defaultValue={profile.minimumDealSize}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select minimum deal size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-10k">$0 - $10k</SelectItem>
                    <SelectItem value="10k-50k">$10k - $50k</SelectItem>
                    <SelectItem value="50k-100k">$50k - $100k</SelectItem>
                    <SelectItem value="100k+">$100k+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Additional Criteria */}
            <div className="space-y-2">
              <Label htmlFor="key-technologies">Required/Compatible Technologies</Label>
              <Input 
                id="key-technologies" 
                placeholder="e.g., EV Infrastructure, Smart Grid Systems"
                value={profile.keyTechnologies}
                onChange={e => handleChange('keyTechnologies', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="decision-making-criteria">Key Decision-Making Criteria</Label>
              <Textarea 
                id="decision-making-criteria" 
                placeholder="What factors most influence your prospects' buying decisions?"
                rows={4}
                value={profile.decisionMakingCriteria}
                onChange={e => handleChange('decisionMakingCriteria', e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full">
              Save Company Profile
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
} 