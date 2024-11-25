"use server"

import { getLeads } from "@/actions/leads-actions"
import UploadForm from "./_components/upload-form"
import LeadsTable from "@/app/_components/leads-table"

export default async function Dashboard() {
  const { success, data: leads, error } = await getLeads()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tradeshow Lead Enrichment</h1>
      <div className="space-y-8">
        <UploadForm />
        {error && (
          <div className="text-red-500">
            {error}
          </div>
        )}
        {success && leads && (
          <LeadsTable leads={leads} />
        )}
      </div>
    </div>
  )
}
