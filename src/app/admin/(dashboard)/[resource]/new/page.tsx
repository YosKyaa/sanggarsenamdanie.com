import { notFound } from "next/navigation"

import { AdminPageHeader } from "@/components/organisms/admin/admin-ui"
import { ResourceForm } from "@/components/organisms/admin/resource-form"
import { saveResource } from "@/features/admin/actions"
import { requireAdmin } from "@/features/admin/auth"
import { getRelationOptions } from "@/features/admin/queries"
import { getResource } from "@/features/admin/resources"

type Props = { params: Promise<{ resource: string }> }

export async function generateMetadata({ params }: Props) {
  const resource = getResource((await params).resource)
  return { title: resource ? `Tambah ${resource.singular}` : "Admin" }
}

export default async function NewResourcePage({ params }: Props) {
  const resource = getResource((await params).resource)
  if (!resource || resource.singleton || resource.allowCreate === false) notFound()
  if (resource.adminOnly) await requireAdmin()

  const relationOptions = await getRelationOptions()

  return (
    <>
      <AdminPageHeader
        back={{ href: `/admin/${resource.key}`, label: `Kembali ke ${resource.label}` }}
        title={`Tambah ${resource.singular}`}
        description={resource.description}
      />
      <div className="rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-soft sm:p-8">
        <ResourceForm
          resourceKey={resource.key}
          action={saveResource.bind(null, resource.key, null)}
          initialValues={{}}
          relationOptions={relationOptions}
        />
      </div>
    </>
  )
}
