import { TextAlignIcon, TextAlignDistributedIcon, SparkleIcon } from "~/icons";

export const CAPTION_TOOLS = [
  {
    icon: SparkleIcon,
    title: "Remove commas",
    action: (caption: string) => caption.replace(/,/g, ""),
  },
  {
    icon: TextAlignIcon,
    title: "Replace newlines with commas",
    action: (caption: string) => caption.replace(/\n/g, ", "),
  },
  {
    icon: TextAlignDistributedIcon,
    title: "Replace underscores with spaces",
    action: (caption: string) => caption.replace(/_/g, " "),
  },
] as const;
