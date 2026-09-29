import { Heading, Text } from "@/components/atoms/typography"

const steps = [
  { title: "Chat kami di WhatsApp", description: "Ceritakan kelas yang Anda minati, atau tanya dulu jadwal dan biayanya." },
  { title: "Kami bantu pilihkan kelas", description: "Tim kami merekomendasikan program dan jadwal yang paling cocok." },
  { title: "Datang dan mulai berlatih", description: "Gunakan pakaian olahraga yang nyaman dan bawa air minum." },
]

/** "How to join" in three steps — answers the visitor's last question before acting. */
export function JoinSteps({ headingLevel = "h2" }: { headingLevel?: "h2" | "h3" }) {
  return (
    <div className="flex flex-col gap-5">
      <Heading as={headingLevel} size="title">
        Cara bergabung
      </Heading>
      <ol className="flex flex-col gap-5">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-4">
            <span
              aria-hidden
              className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-700 text-sm font-bold text-white"
            >
              {index + 1}
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="font-bold text-ink">{step.title}</span>
              <Text size="small">{step.description}</Text>
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
