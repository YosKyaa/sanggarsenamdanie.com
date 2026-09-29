import Link from "next/link"
import ReactMarkdown, { type Components } from "react-markdown"

/**
 * Renders article Markdown on the server (no client JS). Raw HTML in the
 * source is ignored by react-markdown, so admin content can't inject markup.
 * Headings start at h2 because the page title is the h1.
 */
const components: Components = {
  h1: ({ children }) => <h2 className="mt-10 text-2xl font-extrabold tracking-tight text-ink">{children}</h2>,
  h2: ({ children }) => (
    <h2 className="mt-10 text-2xl font-extrabold tracking-tight text-ink lg:text-[1.75rem]">{children}</h2>
  ),
  h3: ({ children }) => <h3 className="mt-8 text-xl font-bold text-ink">{children}</h3>,
  p: ({ children }) => <p className="mt-5 text-[1.0625rem] leading-[1.8] text-ink/85">{children}</p>,
  ul: ({ children }) => (
    <ul className="mt-5 flex list-disc flex-col gap-2.5 pl-6 text-[1.0625rem] leading-[1.7] text-ink/85 marker:text-brand-500">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-5 flex list-decimal flex-col gap-2.5 pl-6 text-[1.0625rem] leading-[1.7] text-ink/85 marker:font-bold marker:text-brand-600">
      {children}
    </ol>
  ),
  strong: ({ children }) => <strong className="font-bold text-ink">{children}</strong>,
  blockquote: ({ children }) => (
    <blockquote className="mt-6 rounded-2xl border-l-4 border-brand-500 bg-brand-50 px-6 py-4 text-ink">{children}</blockquote>
  ),
  a: ({ href = "", children }) =>
    href.startsWith("/") ? (
      <Link href={href} className="font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-800">
        {children}
      </Link>
    ) : (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-800"
      >
        {children}
        <span className="sr-only"> (membuka tab baru)</span>
      </a>
    ),
  // Images belong in the cover field (optimised via next/image), not inline.
  img: () => null,
}

export function Markdown({ source }: { source: string }) {
  return (
    <div className="[&>*:first-child]:mt-0">
      <ReactMarkdown components={components}>{source}</ReactMarkdown>
    </div>
  )
}
