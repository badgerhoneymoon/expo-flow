"use client"

import { Lead } from "@/db/schema/leads-schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { TargetStatus, ICPFitStatus } from "@/types/structured-output-types"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Mail, Linkedin, Globe, Calendar } from "lucide-react"
import { findMissingWebsites } from "@/actions/leads-actions"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useState } from "react"
import { cn } from "@/lib/utils"

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
  
  // Count leads without websites
  const leadsWithoutWebsites = leads.filter(lead => 
    !lead.website || lead.website === "N/A" || lead.website === ""
  ).length

  const handleClick = async () => {
    if (leadsWithoutWebsites === 0) {
      toast.info("No missing websites", {
        description: "All leads already have websites"
      })
      return
    }

    setIsProcessing(true)
    try {
      const result = await findMissingWebsites()
      
      if (result.success && result.data) {
        toast.success("Websites Updated", {
          description: `Processed ${result.data.processedCount} leads, updated ${result.data.updatedCount} websites`,
        })
      } else {
        toast.error("Error", {
          description: result.error || "Failed to process websites",
        })
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to process websites",
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
        {isProcessing ? "Processing..." : `Find Missing Websites${leadsWithoutWebsites > 0 ? ` (${leadsWithoutWebsites})` : ''}`}
      </span>
      {isProcessing && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
        </div>
      )}
    </Button>
  )
}

interface LeadsTableProps {
  leads: Lead[]
}

export default function LeadsTable({ leads }: LeadsTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <CardTitle>Leads</CardTitle>
          <FindWebsitesButton leads={leads} />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <div className="text-xs text-muted-foreground">Total</div>
            <Badge variant="outline" className="min-w-[3rem] justify-center text-base font-semibold">
              {leads.length}
            </Badge>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="text-xs text-muted-foreground">Targets</div>
            <Badge 
              variant={leads.filter(l => l.isTarget === TargetStatus.YES).length > 0 ? "success" : "outline"}
              className="min-w-[3rem] justify-center text-base font-semibold"
            >
              {leads.filter(l => l.isTarget === TargetStatus.YES).length}
            </Badge>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="text-xs text-muted-foreground">ICP Fit</div>
            <Badge 
              variant={leads.filter(l => l.icpFit === ICPFitStatus.YES).length > 0 ? "success" : "outline"}
              className="min-w-[3rem] justify-center text-base font-semibold"
            >
              {leads.filter(l => l.icpFit === ICPFitStatus.YES).length}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b-2 border-border hover:bg-transparent">
              <TableHead className="font-semibold text-foreground">
                <div className="flex flex-col gap-1">
                  <span className="text-base">Basic Info</span>
                  <span className="font-normal text-xs text-muted-foreground">Name & Position</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                <div className="flex flex-col gap-1">
                  <span className="text-base">Contact</span>
                  <span className="font-normal text-xs text-muted-foreground">Email & LinkedIn</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                <div className="flex flex-col gap-1">
                  <span className="text-base">Company</span>
                  <span className="font-normal text-xs text-muted-foreground">Name & Website</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                <div className="flex flex-col gap-1">
                  <span className="text-base">Qualification</span>
                  <span className="font-normal text-xs text-muted-foreground">Target & ICP Status</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                <div className="flex flex-col gap-1">
                  <span className="text-base">Sources</span>
                  <span className="font-normal text-xs text-muted-foreground">Data Origins</span>
                </div>
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                <div className="flex flex-col gap-1">
                  <span className="text-base">Follow-up</span>
                  <span className="font-normal text-xs text-muted-foreground">Next Steps & Timing</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead, index) => (
              <motion.tr
                key={lead.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group hover:bg-muted/50 border-b border-border last:border-0"
              >
                <TableCell className="align-top py-4">
                  <div className="space-y-1">
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
                </TableCell>

                <TableCell className="align-top">
                  <div className="space-y-2">
                    {lead.email && lead.email !== "N/A" && (
                      <div className="flex items-center gap-2">
                        <LinkCell url={lead.email} icon={Mail} isEmail={true} />
                      </div>
                    )}
                    {lead.linkedin && lead.linkedin !== "N/A" && (
                      <div className="flex items-center gap-2">
                        <LinkCell url={lead.linkedin} icon={Linkedin} />
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell className="align-top">
                  <div className="space-y-1">
                    <div className="font-medium">
                      {lead.company && lead.company !== "N/A" ? lead.company : '—'}
                    </div>
                    {lead.website && lead.website !== "N/A" && (
                      <div className="text-sm">
                        <LinkCell url={lead.website} icon={Globe} />
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell className="align-top">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-1">
                        <div className="text-xs text-muted-foreground">Target</div>
                        <Badge 
                          variant={lead.isTarget === TargetStatus.YES ? "success" : 
                                  lead.isTarget === TargetStatus.NO ? "destructive" : "outline"}
                          className="w-20 justify-center"
                        >
                          {lead.isTarget}
                        </Badge>
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="text-xs text-muted-foreground">ICP</div>
                        <Badge 
                          variant={lead.icpFit === ICPFitStatus.YES ? "success" : 
                                  lead.icpFit === ICPFitStatus.NO ? "destructive" : "outline"}
                          className="w-20 justify-center"
                        >
                          {lead.icpFit}
                        </Badge>
                      </div>
                    </div>

                    {lead.qualificationReason && (
                      <div className="flex flex-col gap-1">
                        <div className="text-xs text-muted-foreground">Qualification</div>
                        <div className="text-sm bg-muted p-2 rounded-md max-w-[300px] whitespace-pre-wrap">
                          {lead.qualificationReason}
                        </div>
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell className="align-top">
                  <div className="flex gap-1">
                    {lead.hasBusinessCard && (
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="secondary">📸</Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="max-w-[300px] whitespace-pre-wrap">
                              {lead.rawBusinessCard}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {lead.hasTextNote && (
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="secondary">📝</Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="max-w-[300px] whitespace-pre-wrap">
                              {lead.rawTextNote}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {lead.hasVoiceMemo && (
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="secondary">🎤</Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="max-w-[300px] whitespace-pre-wrap">
                              {lead.rawVoiceMemo}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </TableCell>

                <TableCell className="align-top">
                  <div className="space-y-2">
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
                    {lead.referral && (
                      <Badge variant="purple" className="whitespace-nowrap">
                        Referred Lead
                      </Badge>
                    )}
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 