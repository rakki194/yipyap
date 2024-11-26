export function joinUrlParts(...parts: string[]) {
  return parts
    .map(
      (part, index) =>
        index === 0
          ? part.replace(/\/+$/, "") // Only strip trailing slashes from the first part
          : part.replace(/(^\/+|\/+$)/g, "") // Strip leading and trailing slashes for others
    )
    .filter(Boolean) // Remove empty parts
    .join("/");
}

export function replaceExtension(name: string, newExtension: string) {
  return name.replace(/\.\w+$/, newExtension);
}
