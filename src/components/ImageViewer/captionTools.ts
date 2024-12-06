import getIcon from "~/icons";

export const CAPTION_TOOLS = [
  {
    icon: () => getIcon("sparkle"),
    title: "Remove commas",
    action: (caption: string) => caption.replace(/,/g, ""),
  },
  {
    icon: () => getIcon("textAlign"),
    title: "Replace newlines with commas",
    action: (caption: string) => caption.replace(/\n/g, ", "),
  },
  {
    icon: () => getIcon("textAlignDistributed"),
    title: "Replace underscores with spaces",
    action: (caption: string) => caption.replace(/_/g, " "),
  },
] as const;
