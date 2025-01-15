"use client"

import { Lead } from "@/db/schema/leads-schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { targetStatusEnum, icpFitStatusEnum } from "@/db/schema/leads-schema"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Mail, Linkedin, Globe, Calendar, Calculator, MessageSquare } from "lucide-react"
import { findMissingWebsites } from "@/actions/leads-actions"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { qualifyLeads } from "@/actions/qualification-actions"
import { useRouter } from "next/navigation"
import { mockEnrichLinkedInProfiles } from "@/lib/services/mock-linkedin-service"
import { updateLeadsLinkedIn } from "@/actions/leads-actions"
import { generateFollowUps } from "@/actions/follow-up-actions"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Modified LinkCell component to handle emails specially
function LinkCell({ url, icon: Icon, isEmail = false }: { url: string | null, icon: any, isEmail?: boolean }) {
  if (!url || url === "N/A") return <span className="text-muted-foreground">—</span>

  // Function to clean URL for display
  const cleanUrl = (url: string) => {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`)
      return urlObj.hostname.replace(/^www\./, '')
    } catch {
      return url
    }
  }

  return (
    <a 
      href={isEmail ? undefined : url}
      onClick={isEmail ? (e) => e.preventDefault() : undefined}
      target={isEmail ? undefined : "_blank"} 
      rel={isEmail ? undefined : "noopener noreferrer"} 
      className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
    >
      <Icon className="h-4 w-4" />
      <span className="max-w-[150px] truncate">
        {isEmail ? url : cleanUrl(url)}
      </span>
    </a>
  )
}

// Add this component above the LeadsTable component
function FindWebsitesButton({ leads }: { leads: Lead[] }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  
  // Count leads that need either website or enrichment
  const leadsToProcess = leads.filter(lead => 
    // Needs website
    (!lead.website || lead.website === "N/A" || lead.website === "") ||
    // OR needs enrichment (missing industry or business info)
    (
      (!lead.companyIndustry || lead.companyIndustry === "N/A" || lead.companyIndustry === "") ||
      (!lead.companyBusiness || lead.companyBusiness === "N/A" || lead.companyBusiness === "")
    )
  ).length

  const handleClick = async () => {
    if (leadsToProcess === 0) {
      toast.info("No leads to process", {
        description: "All leads have websites and enrichment data"
      })
      return
    }

    setIsProcessing(true)
    try {
      const result = await findMissingWebsites()
      
      if (result.success && result.data) {
        toast.success("Processing Complete", {
          description: `Processed ${result.data.processedCount} leads:
           • ${result.data.websiteUpdates} websites found
           • ${result.data.enrichmentUpdates} companies enriched`,
        })
        
        router.refresh()
      } else {
        toast.error("Error", {
          description: result.error || "Failed to process leads",
        })
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to process leads",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isProcessing}
      className={cn(
        "relative gap-2",
        isProcessing && "pr-8",
        "hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-500",
        "active:scale-95 transition-transform duration-75"
      )}
    >
      <Globe 
        className={cn(
          "h-4 w-4",
          isProcessing && "text-muted-foreground animate-pulse"
        )} 
      />
      <span className={isProcessing ? "text-muted-foreground" : ""}>
        {isProcessing ? "Processing..." : `Find & Enrich${leadsToProcess > 0 ? ` (${leadsToProcess})` : ''}`}
      </span>
      {isProcessing && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
        </div>
      )}
    </Button>
  )
}

// Update the ScoreButton component
function ScoreButton({ leads }: { leads: Lead[] }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  
  // Count leads that need scoring (those with UNKNOWN status)
  const leadsToScore = leads.filter(lead => 
    lead.isTarget === targetStatusEnum.enumValues[2] || // "UNKNOWN"
    lead.isTarget === null ||
    lead.icpFit === icpFitStatusEnum.enumValues[2] || // "UNKNOWN"
    lead.icpFit === null
  )

  const handleClick = async () => {
    if (leadsToScore.length === 0) {
      toast.info("No leads to score", {
        description: "All leads already have target and ICP status"
      })
      return
    }

    setIsProcessing(true)
    try {
      const result = await qualifyLeads(leadsToScore.map(lead => lead.id))
      
      if (result.success && result.data) {
        toast.success("Leads Scored", {
          description: `Successfully scored ${result.data.successful} out of ${result.data.total} leads`
        })

        // If any leads failed, show a warning
        if (result.data.failed > 0) {
          toast.warning("Some leads failed", {
            description: `Failed to score ${result.data.failed} leads`
          })
        }

        // Refresh the page data
        router.refresh()
      } else {
        toast.error("Error", {
          description: "Failed to score leads"
        })
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to score leads"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isProcessing}
      className={cn(
        "relative gap-2",
        isProcessing && "pr-8",
        "hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-purple-500",
        "active:scale-95 transition-transform duration-75"
      )}
    >
      <Calculator 
        className={cn(
          "h-4 w-4",
          isProcessing && "text-muted-foreground animate-pulse"
        )} 
      />
      <span className={isProcessing ? "text-muted-foreground" : ""}>
        {isProcessing ? "Processing..." : `Score Leads${leadsToScore.length > 0 ? ` (${leadsToScore.length})` : ''}`}
      </span>
      {isProcessing && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
        </div>
      )}
    </Button>
  )
}

function EnrichLinkedInButton({ leads }: { leads: Lead[] }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  
  // Count qualified leads that need LinkedIn enrichment
  const leadsToEnrich = leads.filter(lead => 
    // Check if lead is qualified
    lead.isTarget === targetStatusEnum.enumValues[0] && // "YES"
    lead.icpFit === icpFitStatusEnum.enumValues[0] && // "YES"
    // Check if lead needs LinkedIn
    (!lead.linkedin || lead.linkedin === "N/A" || lead.linkedin === "")
  ).length

  const handleClick = async () => {
    if (leadsToEnrich === 0) {
      toast.info("No leads to enrich", {
        description: "No qualified leads without LinkedIn profiles"
      })
      return
    }

    setIsProcessing(true)
    try {
      const result = await mockEnrichLinkedInProfiles(leads)
      
      if (result.success && result.data) {
        // Update the leads in the database
        const updateResult = await updateLeadsLinkedIn(result.data.profiles)
        
        if (updateResult.success && updateResult.data) {
          toast.success("LinkedIn Enrichment Complete", {
            description: `Updated ${updateResult.data.updatedCount} LinkedIn profiles`
          })

          if (updateResult.data.failedCount > 0) {
            toast.warning("Some updates failed", {
              description: `Failed to update ${updateResult.data.failedCount} profiles`
            })
          }

          router.refresh()
        } else {
          toast.error("Error", {
            description: updateResult.error || "Failed to update LinkedIn profiles"
          })
        }
      } else {
        toast.error("Error", {
          description: result.error || "Failed to enrich LinkedIn profiles"
        })
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to enrich LinkedIn profiles"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isProcessing}
      className={cn(
        "relative gap-2",
        isProcessing && "pr-8",
        "hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-500",
        "active:scale-95 transition-transform duration-75"
      )}
    >
      <Linkedin 
        className={cn(
          "h-4 w-4",
          isProcessing && "text-muted-foreground animate-pulse"
        )} 
      />
      <span className={isProcessing ? "text-muted-foreground" : ""}>
        {isProcessing ? "Processing..." : `Find LinkedIn${leadsToEnrich > 0 ? ` (${leadsToEnrich})` : ''}`}
      </span>
      {isProcessing && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
        </div>
      )}
    </Button>
  )
}

function CreateFollowUpsButton({ leads }: { leads: Lead[] }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  
  // Count qualified leads that need follow-ups
  const leadsToProcess = leads.filter(lead => 
    // Check if lead is qualified
    lead.isTarget === targetStatusEnum.enumValues[0] && // "YES"
    lead.icpFit === icpFitStatusEnum.enumValues[0] && // "YES"
    // Check if lead needs follow-up (we can adjust these conditions later)
    (!lead.followUpTemplate || lead.followUpTemplate === "N/A" || lead.followUpTemplate === "")
  ).length

  const handleClick = async () => {
    if (leadsToProcess === 0) {
      toast.info("No leads to process", {
        description: "No qualified leads need follow-ups"
      })
      return
    }

    setIsProcessing(true)
    try {
      const result = await generateFollowUps(leads)
      
      if (result.success && result.data) {
        toast.success("Follow-ups Generated", {
          description: `Created ${result.data.updatedCount} follow-up messages`
        })

        if (result.data.failedCount > 0) {
          toast.warning("Some generations failed", {
            description: `Failed to generate ${result.data.failedCount} messages`
          })
        }

        router.refresh()
      } else {
        toast.error("Error", {
          description: result.error || "Failed to generate follow-up messages"
        })
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to generate follow-ups"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isProcessing}
      className={cn(
        "relative gap-2",
        isProcessing && "pr-8",
        "hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-500",
        "active:scale-95 transition-transform duration-75"
      )}
    >
      <MessageSquare 
        className={cn(
          "h-4 w-4",
          isProcessing && "text-muted-foreground animate-pulse"
        )} 
      />
      <span className={isProcessing ? "text-muted-foreground" : ""}>
        {isProcessing ? "Processing..." : `Create Follow-ups${leadsToProcess > 0 ? ` (${leadsToProcess})` : ''}`}
      </span>
      {isProcessing && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
        </div>
      )}
    </Button>
  )
}

function FilterSwitch({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  return (
    <div className="flex items-center gap-2">
      <Switch
        id="filter-qualified"
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="data-[state=checked]:bg-green-500"
      />
      <Label 
        htmlFor="filter-qualified" 
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Show Qualified Only
      </Label>
    </div>
  )
}

// Update the parsing function to trim whitespace
function parseQualificationReason(reason: string | null, type: 'target' | 'icp'): string {
  if (!reason) return 'No qualification data';
  
  const sections = reason.split('\n\n');
  const targetSection = sections[0]?.replace('Target Assessment:\n', '').trim();
  const icpSection = sections[1]?.replace('ICP Assessment:\n', '').trim();
  
  return type === 'target' ? targetSection : icpSection;
}

interface LeadsTableProps {
  leads: Lead[]
  showActions?: boolean
  showQualificationFilter?: boolean
  showQualificationStats?: boolean
}

export default function LeadsTable({ 
  leads, 
  showActions = true,
  showQualificationFilter = true,
  showQualificationStats = true 
}: LeadsTableProps) {
  const [showQualifiedOnly, setShowQualifiedOnly] = useState(false)
  const [expandedLead, setExpandedLead] = useState<string | undefined>(undefined)
  
  const filteredLeads = showQualifiedOnly 
    ? leads.filter(lead => 
        lead.isTarget === targetStatusEnum.enumValues[0] && 
        lead.icpFit === icpFitStatusEnum.enumValues[0]
      )
    : leads

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle>Leads</CardTitle>
          <div className="flex flex-col items-center">
            <div className="text-xs text-muted-foreground">Total</div>
            <Badge variant="outline" className="min-w-[3rem] justify-center text-base font-semibold">
              {leads.length}
            </Badge>
          </div>
        </div>

        {showActions && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <FindWebsitesButton leads={leads} />
            <ScoreButton leads={leads} />
            <EnrichLinkedInButton leads={leads} />
            <CreateFollowUpsButton leads={leads} />
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
          {showQualificationFilter && (
            <FilterSwitch 
              checked={showQualifiedOnly}
              onCheckedChange={setShowQualifiedOnly}
            />
          )}
          {showQualificationStats && (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-1">
                <div className="text-xs text-muted-foreground">Targets</div>
                <Badge 
                  variant={leads.filter(l => l.isTarget === targetStatusEnum.enumValues[0]).length > 0 ? "success" : "outline"}
                  className="min-w-[3rem] justify-center text-base font-semibold"
                >
                  {leads.filter(l => l.isTarget === targetStatusEnum.enumValues[0]).length}
                </Badge>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="text-xs text-muted-foreground">ICP Fit</div>
                <Badge 
                  variant={leads.filter(l => l.icpFit === icpFitStatusEnum.enumValues[0]).length > 0 ? "success" : "outline"}
                  className="min-w-[3rem] justify-center text-base font-semibold"
                >
                  {leads.filter(l => l.icpFit === icpFitStatusEnum.enumValues[0]).length}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          {filteredLeads.map((lead, index) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-card rounded-lg border shadow-sm"
            >
              <Accordion 
                type="single" 
                value={expandedLead} 
                onValueChange={setExpandedLead} 
                collapsible
              >
                <AccordionItem value={lead.id} className="border-0">
                  <AccordionTrigger className="px-4 py-2 hover:no-underline">
                    <div className="text-left">
                      <div className="font-medium">
                        {lead.firstName !== "N/A" && lead.lastName !== "N/A" ? 
                          `${lead.firstName} ${lead.lastName}` : 
                          <span className="text-muted-foreground">—</span>
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {lead.jobTitle && lead.jobTitle !== "N/A" ? lead.jobTitle : '—'}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 space-y-4">
                      {/* Contact Section */}
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground">Contact</div>
                        <div className="space-y-1">
                          {lead.email && lead.email !== "N/A" && (
                            <div>
                              <LinkCell url={lead.email} icon={Mail} isEmail={true} />
                            </div>
                          )}
                          {lead.linkedin && lead.linkedin !== "N/A" && (
                            <div>
                              <LinkCell url={lead.linkedin} icon={Linkedin} />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Company Section */}
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground">Company</div>
                        <div>
                          <div className="font-medium">
                            {lead.company && lead.company !== "N/A" ? lead.company : '—'}
                          </div>
                          {lead.website && lead.website !== "N/A" && (
                            <div className="text-sm">
                              <LinkCell url={lead.website} icon={Globe} />
                            </div>
                          )}
                          {(lead.companyIndustry || lead.companyBusiness) && (
                            <div className="flex flex-col gap-1 mt-2">
                              {lead.companyIndustry && lead.companyIndustry !== "N/A" && (
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-xs text-muted-foreground">Industry</span>
                                  <span className="text-sm bg-muted/50 px-2 py-1 rounded">
                                    {lead.companyIndustry}
                                  </span>
                                </div>
                              )}
                              {lead.companyBusiness && lead.companyBusiness !== "N/A" && (
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-xs text-muted-foreground">Business</span>
                                  <span className="text-sm bg-muted/50 px-2 py-1 rounded">
                                    {lead.companyBusiness}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Qualification Section */}
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground">Qualification</div>
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col gap-1">
                            <div className="text-xs text-muted-foreground">Target</div>
                            <TooltipProvider delayDuration={0}>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge 
                                    variant={lead.isTarget === targetStatusEnum.enumValues[0] ? "success" : 
                                            lead.isTarget === targetStatusEnum.enumValues[1] ? "destructive" : "outline"}
                                    className="w-20 justify-center"
                                  >
                                    {lead.isTarget}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="max-w-[300px] whitespace-pre-wrap">
                                    {parseQualificationReason(lead.qualificationReason, 'target')}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>

                          <div className="flex flex-col gap-1">
                            <div className="text-xs text-muted-foreground">ICP</div>
                            <TooltipProvider delayDuration={0}>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge 
                                    variant={lead.icpFit === icpFitStatusEnum.enumValues[0] ? "success" : 
                                            lead.icpFit === icpFitStatusEnum.enumValues[1] ? "destructive" : "outline"}
                                    className="w-20 justify-center"
                                  >
                                    {lead.icpFit}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="max-w-[300px] whitespace-pre-wrap">
                                    {parseQualificationReason(lead.qualificationReason, 'icp')}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>

                      {/* Sources Section */}
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground">Sources</div>
                        <div className="flex gap-1">
                          {lead.hasBusinessCard && lead.rawBusinessCard && (
                            <TooltipProvider delayDuration={0}>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant="secondary" className="h-7 px-3">📸</Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="max-w-[300px] whitespace-pre-wrap">
                                    {lead.rawBusinessCard}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {lead.hasTextNote && lead.rawTextNote && (
                            <TooltipProvider delayDuration={0}>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant="secondary" className="h-7 px-3">📝</Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="max-w-[300px] whitespace-pre-wrap">
                                    {lead.rawTextNote}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {lead.hasVoiceMemo && lead.rawVoiceMemo && (
                            <TooltipProvider delayDuration={0}>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant="secondary" className="h-7 px-3">🎤</Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="max-w-[300px] whitespace-pre-wrap">
                                    {lead.rawVoiceMemo}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {lead.referrals && lead.referrals.length > 0 && (
                            <TooltipProvider delayDuration={0}>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant="secondary" className="h-7 px-3">👥</Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="max-w-[300px] whitespace-pre-wrap">
                                    {lead.referrals.length} referral{lead.referrals.length > 1 ? 's' : ''}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </div>

                      {/* Follow-up Section */}
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground">Follow-up</div>
                        <div className="space-y-3">
                          {lead.contactTiming && lead.contactTiming !== "N/A" && (
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {lead.contactTiming}
                            </div>
                          )}
                          {lead.contactDate && lead.contactDate !== "N/A" && (
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {lead.contactDate}
                            </div>
                          )}
                          {lead.followUpTemplate && lead.followUpTemplate !== "N/A" && (
                            <div className="flex flex-col gap-1">
                              <div className="text-xs text-muted-foreground">LinkedIn Message</div>
                              <div className="text-sm bg-muted/50 p-2 rounded-md">
                                {lead.followUpTemplate}
                              </div>
                            </div>
                          )}
                          {lead.nextSteps && lead.nextSteps !== "N/A" && (
                            <div className="flex flex-col gap-1">
                              <div className="text-xs text-muted-foreground">Next Steps</div>
                              <div className="text-sm bg-muted/50 p-2 rounded-md">
                                {lead.nextSteps}
                              </div>
                            </div>
                          )}
                          {lead.notes && lead.notes !== "N/A" && lead.notes !== "No additional notes" && (
                            <div className="flex flex-col gap-1">
                              <div className="text-xs text-muted-foreground">Notes</div>
                              <div className="text-sm bg-muted/50 p-2 rounded-md">
                                {lead.notes}
                              </div>
                            </div>
                          )}
                          {lead.referrals && lead.referrals.length > 0 && (
                            <div className="flex flex-col gap-3">
                              <div className="text-xs text-muted-foreground">Referrals</div>
                              <div className="space-y-2">
                                {lead.referrals.map((referral, index) => (
                                  <Accordion type="multiple" className="w-full" key={index}>
                                    <AccordionItem value={`referral-${index}`} className="border-0">
                                      <AccordionTrigger className="py-0 hover:no-underline">
                                        <Badge variant="purple" className="whitespace-nowrap cursor-pointer hover:bg-purple-600">
                                          {referral.firstName} {referral.lastName}
                                        </Badge>
                                      </AccordionTrigger>
                                      <AccordionContent className="pb-2">
                                        <div className="pl-2 pt-2 space-y-1.5 text-sm">
                                          {referral.position && (
                                            <div className="text-muted-foreground">
                                              Position: {referral.position}
                                            </div>
                                          )}
                                          {referral.contactTiming && (
                                            <div className="text-muted-foreground">
                                              When: {referral.contactTiming}
                                            </div>
                                          )}
                                          {referral.contactDate && (
                                            <div className="text-muted-foreground">
                                              Date: {referral.contactDate}
                                            </div>
                                          )}
                                          {referral.notes && (
                                            <div className="bg-muted/50 p-2 rounded-md mt-2">
                                              {referral.notes}
                                            </div>
                                          )}
                                        </div>
                                      </AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 