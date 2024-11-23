"use server"

import UploadForm from "./_components/upload-form"

export default async function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Lead Management Dashboard</h1>
      <UploadForm />
    </div>
  )
}
