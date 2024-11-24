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

// Helper component for long text content
function LongTextCell({ content }: { content: string | null }) {
  if (!content) return <span className="text-muted-foreground">—</span>

  return (
    <TooltipProvider>
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

// Helper component for links
function LinkCell({ url }: { url: string | null }) {
  if (!url) return <span className="text-muted-foreground">—</span>

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-blue-600 hover:text-blue-800 hover:underline"
    >
      {url}
    </a>
  )
}

interface LeadsTableProps {
  leads: Lead[]
}

export default function LeadsTable({ leads }: LeadsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Basic Info */}
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Position</TableHead>
              
              {/* Contact Info */}
              <TableHead>Email</TableHead>
              <TableHead>LinkedIn</TableHead>
              <TableHead>Website</TableHead>
              
              {/* Enrichment Info */}
              <TableHead>Main Interest</TableHead>
              <TableHead>Next Steps</TableHead>
              <TableHead>Company Industry</TableHead>
              <TableHead>Company Size</TableHead>
              <TableHead>Company Business</TableHead>
              
              {/* Qualification */}
              <TableHead>Target</TableHead>
              <TableHead>ICP Fit</TableHead>
              <TableHead>Qualification Reason</TableHead>
              
              {/* Follow-up */}
              <TableHead>Contact Timing</TableHead>
              <TableHead>Contact Date</TableHead>
              <TableHead>Follow-up Template</TableHead>
              
              {/* Sources & Notes */}
              <TableHead>Sources</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Referral</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                {/* Basic Info */}
                <TableCell>{`${lead.firstName || ''} ${lead.lastName || ''}`}</TableCell>
                <TableCell>{lead.company || '—'}</TableCell>
                <TableCell>{lead.jobTitle || '—'}</TableCell>
                
                {/* Contact Info */}
                <TableCell>
                  {lead.email ? (
                    <a href={`mailto:${lead.email}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                      {lead.email}
                    </a>
                  ) : '—'}
                </TableCell>
                <TableCell><LinkCell url={lead.linkedin} /></TableCell>
                <TableCell><LinkCell url={lead.website} /></TableCell>
                
                {/* Enrichment Info */}
                <TableCell><LongTextCell content={lead.mainInterest} /></TableCell>
                <TableCell><LongTextCell content={lead.nextSteps} /></TableCell>
                <TableCell>{lead.companyIndustry || '—'}</TableCell>
                <TableCell>{lead.companySize || '—'}</TableCell>
                <TableCell>{lead.companyBusiness || '—'}</TableCell>
                
                {/* Qualification */}
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    lead.isTarget === TargetStatus.YES ? 'bg-green-100 text-green-800' :
                    lead.isTarget === TargetStatus.NO ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {lead.isTarget}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    lead.icpFit === ICPFitStatus.YES ? 'bg-green-100 text-green-800' :
                    lead.icpFit === ICPFitStatus.NO ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {lead.icpFit}
                  </span>
                </TableCell>
                <TableCell><LongTextCell content={lead.qualificationReason} /></TableCell>
                
                {/* Follow-up */}
                <TableCell>{lead.contactTiming || '—'}</TableCell>
                <TableCell>{lead.contactDate || '—'}</TableCell>
                <TableCell><LongTextCell content={lead.followUpTemplate} /></TableCell>
                
                {/* Sources & Notes */}
                <TableCell>
                  <div className="flex gap-1">
                    {lead.hasBusinessCard && <span title="Business Card">📸</span>}
                    {lead.hasTextNote && <span title="Text Note">📝</span>}
                    {lead.hasVoiceMemo && <span title="Voice Memo">🎤</span>}
                  </div>
                </TableCell>
                <TableCell><LongTextCell content={lead.notes} /></TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    lead.referral ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {lead.referral ? 'Yes' : 'No'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 