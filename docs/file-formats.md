# Adding New File Formats for Tags and Captions

This guide explains how to add support for new file formats for tags and captions in yipyap.

## Overview

yipyap supports multiple file formats for storing image tags and captions. The system is designed to be extensible, allowing you to add new format types as needed. Currently supported formats include:

- `.tags` - Comma-separated tags
- `.caption` - Plain text captions
- `.txt` - Plain text format
- `.wd` - WebUI Diffusion format
- `.e621` - e621 JSON format

## Format Specifications

### e621 Format (.e621)

The e621 format uses a structured JSON format that organizes tags into categories. The file contains metadata and categorized tags in the following structure:

```json
{
  "md5": "string",
  "tags": {
    "general": ["tag1", "tag2", ...],
    "artist": ["artist1", "artist2", ...],
    "species": ["species1", "species2", ...],
    "meta": ["meta1", "meta2", ...]
  },
  "implied_tags": {
    "general": ["implied1", "implied2", ...],
    "artist": ["implied_artist1", ...],
    "copyright": ["copyright1", ...],
    "species": ["implied_species1", ...]
  }
}
```

The e621 format is edited using a specialized JSON editor that:
- Provides syntax highlighting
- Validates JSON structure
- Maintains proper formatting
- Shows in a modal overlay within the image container
- Supports keyboard shortcuts for navigation and editing

### Tags Format (.tags)

// ... existing code ...

## Adding a New Format Type

To add a new format type, you'll need to make changes in several parts of the application:

### 1. Update Caption Type Order

First, add your new format to the `CAPTION_TYPE_ORDER` constant in `src/contexts/gallery.ts`:

```typescript
const CAPTION_TYPE_ORDER: Record<string, number> = {
  '.e621': 0,
  '.tags': 1,
  '.wd': 2,
  '.caption': 3,
  '.txt': 4,
  // Add your new format here with an appropriate order number
  '.yourformat': 5
};
```

### 2. Add Translation Support

Add translations for your new format in the translation files under `src/i18n/lang/`:

```typescript
// In each language file (en.ts, ja.ts, etc.)
captionTypes: {
  // ... existing types ...
  yourformat: "Create new .yourformat file"
}
```

### 3. Update Type Definitions

Add your format to the `CaptionType` type in `src/components/ImageViewer/CaptionInput.tsx`:

```typescript
type CaptionType = "wd" | "e621" | "tags" | "yourformat" | string;
```

### 4. Implement Format Handling

If your format requires special handling for parsing or formatting, update the relevant functions:

```typescript
// In CaptionInput.tsx or a dedicated format handler
const isTagInput = () => ["wd", "e621", "tags", "yourformat"].includes(type());

const splitAndCleanTags = (text: string) => {
  // Add format-specific parsing logic if needed
  if (type() === "yourformat") {
    // Custom parsing for your format
    return customParse(text);
  }
  return text
    .split(/,\s*/)
    .map((t) => t.trim())
    .filter(Boolean);
};
```

### 5. Add Format-Specific UI Components (Optional)

If your format needs special UI treatment:

```typescript
// In CaptionInput.tsx
{isTagInput() ? (
  <div class="tags-container">
    {/* Existing tag input UI */}
  </div>
) : type() === "yourformat" ? (
  <YourFormatEditor
    value={caption()}
    onChange={saveWithHistory}
  />
) : (
  <textarea
    ref={textareaRef}
    use:preserveState={[caption, saveWithHistory]}
    placeholder={t('gallery.addCaption')}
  />
)}
```

## Format Specifications

When adding a new format, consider these aspects:

1. **File Extension**: Choose a unique extension that doesn't conflict with existing ones
2. **Content Structure**: Define how the content should be structured
3. **Parsing Rules**: Specify how to parse the format into the application's internal representation
4. **Serialization Rules**: Define how to convert the internal representation back to the file format
5. **Validation Rules**: Add any format-specific validation requirements

## Best Practices

1. **Backwards Compatibility**: Ensure your format can handle existing tag/caption data
2. **Error Handling**: Add proper error handling for format-specific parsing issues
3. **Performance**: Consider the performance impact of parsing large files
4. **Internationalization**: Add translations for all supported languages
5. **Documentation**: Document the format specification and any special handling requirements

## Example: Adding a Custom Tag Format

Here's a complete example of adding a new pipe-separated tag format (`.ptags`):

```typescript
// In gallery.ts
const CAPTION_TYPE_ORDER: Record<string, number> = {
  // ... existing formats ...
  '.ptags': 6
};

// In CaptionInput.tsx
const splitAndCleanTags = (text: string) => {
  if (type() === "ptags") {
    return text
      .split("|")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  // ... existing formats ...
};

const normalizeTagText = (text: string) => {
  if (type() === "ptags") {
    return splitAndCleanTags(text).join(" | ");
  }
  // ... existing formats ...
};
```

## Testing

When adding a new format:

1. Add unit tests for parsing and serialization
2. Test with various content lengths and special characters
3. Verify format-specific UI components
4. Test integration with existing tag/caption features
5. Verify proper handling of invalid format content

## Common Issues

1. **Character Encoding**: Ensure proper handling of Unicode characters
2. **Line Endings**: Handle different line ending styles (CRLF, LF)
3. **Empty Files**: Properly handle empty or malformed files
4. **Large Files**: Test performance with large tag/caption sets
5. **Special Characters**: Verify handling of special characters in your format 