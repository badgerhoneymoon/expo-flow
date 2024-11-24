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
import { FileText, Mail, Linkedin, Globe, Calendar, Phone } from "lucide-react"

// Helper component for long text content
function LongTextCell({ content }: { content: string | null }) {
  if (!content || content === "N/A") return <span className="text-muted-foreground">—</span>

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="max-w-[200px] truncate">
            {content}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-[400px] whitespace-pre-wrap">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Modified LinkCell component to handle emails specially
function LinkCell({ url, icon: Icon, isEmail = false }: { url: string | null, icon: any, isEmail?: boolean }) {
  if (!url || url === "N/A") return <span className="text-muted-foreground">—</span>

  return (
    <a 
      href={isEmail ? undefined : url} // Don't use href for emails
      onClick={isEmail ? (e) => e.preventDefault() : undefined} // Prevent default for emails
      target={isEmail ? undefined : "_blank"} 
      rel={isEmail ? undefined : "noopener noreferrer"} 
      className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
    >
      <Icon className="h-4 w-4" />
      <span className="max-w-[150px] truncate">
        {isEmail ? url : url}
      </span>
    </a>
  )
}

interface LeadsTableProps {
  leads: Lead[]
}

export default function LeadsTable({ leads }: LeadsTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Leads</CardTitle>
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
            <TableRow>
              <TableHead>Basic Info</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Qualification</TableHead>
              <TableHead>Sources</TableHead>
              <TableHead>Follow-up</TableHead>
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
                      <Badge variant="secondary">
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