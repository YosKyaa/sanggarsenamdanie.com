import { notFound } from "next/navigation"

import { AdminPageHeader } from "@/components/organisms/admin/admin-ui"
import { DeleteButton } from "@/components/organisms/admin/delete-button"
import { ResourceForm } from "@/components/organisms/admin/resource-form"
import { saveResource } from "@/features/admin/actions"
import { requireAdmin } from "@/features/admin/auth"
import { getRelationOptions, getResourceRow } from "@/features/admin/queries"
import { getResource } from "@/features/admin/resources"

type Props = { params: Promise<{ resource: string; id: string }> }

export async function generateMetadata({ params }: Props) {
  const resource = getResource((await params).resource)
  return { title: resource ? `Ubah ${resource.singular}` : "Admin" }
}

export default async function EditResourcePage({ params }: Props) {
  const { resource: key, id } = await params
  const resource = getResource(key)
  if (!resource || resource.singleton) notFound()
  if (resource.adminOnly) await requireAdmin()

  const [row, relationOptions] = await Promise.all([getResourceRow(resource, id), getRelationOptions()])
  if (!row) notFound()

  const listHref = `/admin/${resource.key}`
  const name = String(row[resource.columns[0].name] ?? resource.singular)

  return (
    <>
      <AdminPageHeader
        back={{ href: listHref, label: `Kembali ke ${resource.label}` }}
        title={`Ubah ${resource.singular}`}
        description={name}
        actions={
          resource.allowDelete === false ? undefined : (
            <DeleteButton resourceKey={resource.key} id={id} singular={resource.singular} name={name} redirectTo={listHref} />
          )
        }
      />
      <div className="rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-soft sm:p-8">
        <ResourceForm
          resourceKey={resource.key}
          action={saveResource.bind(null, resource.key, id)}
          initialValues={row}
          relationOptions={relationOptions}
        />
      </div>
    </>
  )
}
