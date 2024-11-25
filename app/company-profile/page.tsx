"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getCompanyProfile } from "@/actions/company-profile-actions"

interface CompanyProfile {
  companyName: string
  website: string
  description: string
  targetMarkets: string
  targetJobTitles: string
  icpDescription: string
}

export default function CompanyProfile() {
  const [profile, setProfile] = useState<CompanyProfile>({
    companyName: "",
    website: "",
    description: "",
    targetMarkets: "",
    targetJobTitles: "",
    icpDescription: ""
  })

  useEffect(() => {
    const loadProfile = async () => {
      const data = await getCompanyProfile()
      setProfile(data)
    }
    loadProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input 
                  id="company-name" 
                  value={profile.companyName}
                  onChange={e => handleChange('companyName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-website">Company Website</Label>
                <Input 
                  id="company-website" 
                  value={profile.website}
                  onChange={e => handleChange('website', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-description">Company Description</Label>
              <Textarea 
                id="company-description" 
                rows={3}
                value={profile.description}
                onChange={e => handleChange('description', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-markets">Target Markets/Industries</Label>
              <Input 
                id="target-markets" 
                value={profile.targetMarkets}
                onChange={e => handleChange('targetMarkets', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-job-titles">Target Job Titles</Label>
              <Input 
                id="target-job-titles" 
                value={profile.targetJobTitles}
                onChange={e => handleChange('targetJobTitles', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icp-description">Ideal Customer Profile (ICP)</Label>
              <Textarea 
                id="icp-description" 
                rows={25}
                value={profile.icpDescription}
                onChange={e => handleChange('icpDescription', e.target.value)}
                required
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