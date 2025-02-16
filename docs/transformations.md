# Text Transformations

The text transformation system allows users to modify text content through various transformation types and custom rules. This document outlines the architecture, features, and usage of the transformation system.

## Architecture

The transformation system consists of several key components working together. The `TransformationsContext` provides global state management for all transformations across the application. The `TransformationSettings` component offers a user interface for managing and configuring transformations. Finally, the `CaptionTools` component integrates these transformations with the image caption editor for seamless text modification capabilities.

### Core Types

```typescript
type TransformationType = "searchReplace" | "case" | "trim" | "wrap" | "number";

interface BaseTransformation {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  isCustom?: boolean;
  type: TransformationType;
}
```

## Transformation Types

### Search and Replace

The search and replace transformation enables pattern-based text replacement using regular expressions. Users can specify an optional replacement text to substitute matched patterns. A common use case is replacing underscores with spaces to improve text readability.

### Case Transformations

Case transformations allow modifying the letter casing of text. Users can convert text to UPPERCASE, lowercase, Title Case where each word is capitalized, or Sentence case where only the first letter of sentences are capitalized.

### Trim Operations

Trim operations help clean up excess whitespace in text. Users can trim all spaces from both ends, trim only from the start or end of text, or remove duplicate spaces between words to normalize spacing.

### Text Wrapping

Text wrapping enables adding surrounding text by specifying prefix and suffix text to wrap around the content. This is particularly useful for adding brackets, quotes, or other enclosing characters to text.

### Number Operations

Number operations provide specialized handling of numeric content. Users can remove numbers entirely from text, format numbers with minimum digit requirements, or extract only the numeric portions of text.

## Custom Transformations

Custom transformations provide users with full control over text modifications. Each custom transformation includes a descriptive name and detailed description to identify its purpose. Users can select an icon from a predefined set to visually distinguish the transformation. Type-specific settings allow fine-tuning the transformation behavior. Each transformation can be individually enabled or disabled to control when it is applied.

### Available Icons

- speaker
- arrowUndo
- edit
- tag
- notepad
- subtitles
- textSortAscending
- textAlign
- info
- search

## Usage

### Creating a Custom Transformation

```typescript
const transformation = {
  name: "Custom Replace",
  description: "Replace pattern with text",
  icon: "edit",
  type: "searchReplace",
  pattern: "\\d+",
  replacement: "#"
};
addTransformation(transformation);
```

### Applying Transformations

Transformations can be applied individually through the caption tools interface. Additionally, transformations can be configured to run automatically when enabled in the application settings.

## Storage

Transformations are persisted in localStorage for data persistence. The default set of transformations remains available at all times as part of the core functionality. Any custom transformations created by users are saved under the `yipyap:transformations` key in localStorage. The enabled/disabled state of each transformation is preserved between sessions to maintain user preferences.

## Best Practices

When working with transformations, it's important to validate regex patterns before applying them to prevent errors or unintended behavior. The order of enabled transformations should be carefully considered as it can impact overall performance. Clear success and error states should be shown to users when transformations are applied to provide proper feedback. Proper type assertions should be used when working with transformation objects to maintain type safety throughout the application.
