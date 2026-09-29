import SiteLayout from "./(site)/layout"
import NotFoundContent from "./(site)/not-found"

/** Unmatched URLs render outside the (site) group, so wrap them in the site chrome here. */
export default function NotFound() {
  return (
    <SiteLayout>
      <NotFoundContent />
    </SiteLayout>
  )
}
