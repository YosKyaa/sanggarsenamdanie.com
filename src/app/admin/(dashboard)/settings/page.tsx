import { AdminNotice, AdminPageHeader } from "@/components/organisms/admin/admin-ui"
import { ResourceForm } from "@/components/organisms/admin/resource-form"
import { saveResource } from "@/features/admin/actions"
import { getRelationOptions, getResourceRow } from "@/features/admin/queries"
import { resources } from "@/features/admin/resources"
import { defaultSettingsRow } from "@/lib/content/defaults"

export const metadata = { title: "Pengaturan Situs" }

/** Single-row editor: contact, address, founder profile and main copy for the whole site. */
export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  const resource = resources.settings
  const [{ notice }, row, relationOptions] = await Promise.all([
    searchParams,
    getResourceRow(resource, "1"),
    getRelationOptions(),
  ])

  return (
    <>
      <AdminPageHeader title={resource.label} description={resource.description} />
      <AdminNotice notice={notice} />
      <div className="rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-soft sm:p-8">
        <ResourceForm
          resourceKey={resource.key}
          action={saveResource.bind(null, resource.key, "1")}
          // Before the first save the table is empty: start from the values the site shows today.
          initialValues={row ?? { ...defaultSettingsRow }}
          relationOptions={relationOptions}
        />
      </div>
    </>
  )
}
