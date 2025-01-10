"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { FileImage, Mic, FileText } from "lucide-react"
import type { Lead } from "@/db/schema/leads-schema"

interface LeadsListProps {
  leads: Lead[]
}

export default function LeadsList({ leads }: LeadsListProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return new Date(date).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    })
  }

  return (
    <div className="space-y-4">
      {leads.map((lead, index) => (
        <motion.div
          key={lead.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {formatDate(lead.createdAt)}
                </p>
                <div className="flex gap-2">
                  {lead.businessCardPath && (
                    <FileImage className="w-4 h-4 text-blue-500" />
                  )}
                  {lead.voiceMemoPath && (
                    <Mic className="w-4 h-4 text-green-500" />
                  )}
                  {lead.rawTextNote && (
                    <FileText className="w-4 h-4 text-purple-500" />
                  )}
                </div>
                {lead.rawTextNote && (
                  <p className="text-sm mt-2">{lead.rawTextNote}</p>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
} 