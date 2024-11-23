"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockLeadsFirstIteration } from "@/data/mock-leads-first-iteration"
import { mockLeadsPostEnrichment } from "@/data/mock-leads-post-enrichment"
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

// Helper component for long text content
function LongTextCell({ content }: { content: string | null }) {
  if (!content) return <span className="text-muted-foreground">—</span>

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="max-w-[200px] whitespace-pre-wrap">
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

// Helper component specifically for voice memos
function VoiceMemoCell({ content }: { content: string | null }) {
  if (!content) return <span className="text-muted-foreground">—</span>

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="max-w-[150px] truncate text-sm">
            {content}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-[400px] whitespace-pre-wrap">
          <p className="max-w-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// New helper component for structured memo gist
function MemoGistCell({ content }: { content: string | null }) {
  if (!content) return <span className="text-muted-foreground">—</span>

  try {
    const gist = JSON.parse(content)
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="max-w-[200px] text-sm space-y-1">
              <div className="font-medium">{gist.mainInterest}</div>
              {gist.referral && (
                <div className="text-muted-foreground">
                  Referral: {gist.referral.name}
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-[400px]">
            <div className="space-y-3">
              <div>
                <div className="font-medium">Main Interest</div>
                <div className="text-sm">{gist.mainInterest}</div>
              </div>
              
              {gist.referral && (
                <div>
                  <div className="font-medium">Referral</div>
                  <div className="text-sm space-y-1">
                    <div>Name: {gist.referral.name}</div>
                    <div>Position: {gist.referral.position}</div>
                    <div>Availability: {gist.referral.availability}</div>
                    <div>Contact Date: {gist.referral.suggestedContactDate}</div>
                  </div>
                </div>
              )}
              
              <div>
                <div className="font-medium">Event</div>
                <div className="text-sm">{gist.event}</div>
              </div>
              
              <div>
                <div className="font-medium">Next Steps</div>
                <div className="text-sm">{gist.nextSteps}</div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  } catch (e) {
    return <span className="text-muted-foreground">Invalid format</span>
  }
}

export default function LeadsPage() {
  const columns = [
    "Lead Type",
    "Full Name",
    "Company",
    "Position",
    "Email",
    "LinkedIn",
    "Company Website",
    "Voice Memo",
    "Memo Gist",
    "ICP Fit",
    "ICP Score",
    "Because",
    "Target for Outreach",
    "Follow-Up Date",
    "Customized Follow-Up",
    "Enrichment Needed"
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Leads Overview</h1>
      
      <Tabs defaultValue="first-iteration" className="space-y-4">
        <TabsList>
          <TabsTrigger value="first-iteration">First Iteration</TabsTrigger>
          <TabsTrigger value="post-enrichment">Post Enrichment</TabsTrigger>
        </TabsList>

        <TabsContent value="first-iteration">
          <Card>
            <CardHeader>
              <CardTitle>First Iteration Leads</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead key={column} className="whitespace-nowrap">
                        {column}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLeadsFirstIteration.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>{lead.leadType}</TableCell>
                      <TableCell>{lead.fullName}</TableCell>
                      <TableCell>{lead.company}</TableCell>
                      <TableCell>{lead.position}</TableCell>
                      <TableCell>
                        <a href={`mailto:${lead.email}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                          {lead.email}
                        </a>
                      </TableCell>
                      <TableCell><LinkCell url={lead.linkedIn} /></TableCell>
                      <TableCell><LinkCell url={lead.companyWebsite} /></TableCell>
                      <TableCell>
                        <VoiceMemoCell content={lead.extractedVoiceMemo} />
                      </TableCell>
                      <TableCell>
                        <MemoGistCell content={lead.gistOfMemo} />
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lead.icpFit === 'Yes' ? 'bg-green-100 text-green-800' :
                          lead.icpFit === 'No' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {lead.icpFit}
                        </span>
                      </TableCell>
                      <TableCell>{lead.icpScore || "—"}</TableCell>
                      <TableCell><LongTextCell content={lead.because} /></TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lead.targetForOutreach ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {lead.targetForOutreach ? "Yes" : "No"}
                        </span>
                      </TableCell>
                      <TableCell>{lead.followUpDate || "—"}</TableCell>
                      <TableCell><LongTextCell content={lead.customizedFollowUp} /></TableCell>
                      <TableCell><LongTextCell content={lead.enrichmentNeeded} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="post-enrichment">
          <Card>
            <CardHeader>
              <CardTitle>Post-Enrichment Leads</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead key={column} className="whitespace-nowrap">
                        {column}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLeadsPostEnrichment.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>{lead.leadType}</TableCell>
                      <TableCell>{lead.fullName}</TableCell>
                      <TableCell>{lead.company}</TableCell>
                      <TableCell>{lead.position}</TableCell>
                      <TableCell>
                        <a href={`mailto:${lead.email}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                          {lead.email}
                        </a>
                      </TableCell>
                      <TableCell><LinkCell url={lead.linkedIn} /></TableCell>
                      <TableCell><LinkCell url={lead.companyWebsite} /></TableCell>
                      <TableCell>
                        <VoiceMemoCell content={lead.extractedVoiceMemo} />
                      </TableCell>
                      <TableCell>
                        <MemoGistCell content={lead.gistOfMemo} />
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lead.icpFit === 'Yes' ? 'bg-green-100 text-green-800' :
                          lead.icpFit === 'No' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {lead.icpFit}
                        </span>
                      </TableCell>
                      <TableCell>{lead.icpScore || "—"}</TableCell>
                      <TableCell><LongTextCell content={lead.because} /></TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lead.targetForOutreach ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {lead.targetForOutreach ? "Yes" : "No"}
                        </span>
                      </TableCell>
                      <TableCell>{lead.followUpDate || "—"}</TableCell>
                      <TableCell><LongTextCell content={lead.customizedFollowUp} /></TableCell>
                      <TableCell><LongTextCell content={lead.enrichmentNeeded} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 