import { notFound } from "next/navigation"

import { AdminNotice, AdminPageHeader } from "@/components/organisms/admin/admin-ui"
import { DeleteButton } from "@/components/organisms/admin/delete-button"
import { ResourceForm } from "@/components/organisms/admin/resource-form"
import { deleteResource, saveResource } from "@/features/admin/actions"
import { getRelationOptions, getResourceRow } from "@/features/admin/queries"
import { getResource } from "@/features/admin/resources"

type Props = {
  params: Promise<{ resource: string; id: string }>
  searchParams: Promise<{ notice?: string }>
}

export async function generateMetadata({ params }: Props) {
  const resource = getResource((await params).resource)
  return { title: resource ? `Ubah ${resource.singular}` : "Admin" }
}

export default async function EditResourcePage({ params, searchParams }: Props) {
  const [{ resource: key, id }, { notice }] = await Promise.all([params, searchParams])
  const resource = getResource(key)
  if (!resource || resource.singleton) notFound()

  const [row, relationOptions] = await Promise.all([getResourceRow(resource, id), getRelationOptions()])
  if (!row) notFound()

  return (
    <>
      <AdminPageHeader
        title={`Ubah ${resource.singular}`}
        description={String(row[resource.columns[0].name] ?? "")}
        actions={
          resource.allowDelete === false ? undefined : (
            <DeleteButton label={resource.singular} onConfirm={deleteResource.bind(null, resource.key, id)} />
          )
        }
      />
      <AdminNotice notice={notice} />
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
