// NOTE: react-calendly uses browser APIs at import time — MUST use dynamic import with ssr: false
import dynamic from "next/dynamic"

const CalendlyInlineWidget = dynamic(
  () => import("react-calendly").then((mod) => mod.InlineWidget),
  {
    ssr: false,
    loading: () => <div className="h-[650px] animate-pulse bg-muted rounded-lg" />,
  }
)

interface CalendlyWidgetProps {
  url: string
}

export function CalendlyWidget({ url }: CalendlyWidgetProps) {
  return <CalendlyInlineWidget url={url} styles={{ height: "650px" }} />
}
