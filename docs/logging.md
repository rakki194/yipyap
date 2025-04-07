# YipYap Logging System

The YipYap application includes a comprehensive logging system for both frontend and backend components. This document explains how to use the logging system effectively.

## Overview

The logging system writes logs to files in the `./logs` directory:

- `backend.log` - Contains logs from the Python backend
- `frontend.log` - Contains logs from the SolidJS frontend

Both log files use daily rotation, keeping 7 days of logs (one week).

## Backend Logging

The backend uses Python's standard `logging` module with a custom configuration that outputs logs to both the console and log files.

### Log Levels

- `DEBUG` - Detailed debugging information
- `INFO` - Confirmation that things are working as expected
- `WARNING` - Indication of potential issues or unexpected events
- `ERROR` - Error conditions that prevent functionality from working correctly

### How to Use

```python
import logging

# Get a logger for your module
logger = logging.getLogger("your_module_name")

# Log messages at different levels
logger.debug("Detailed information for debugging")
logger.info("Confirmation of expected behavior")
logger.warning("Potential issue or unexpected event")
logger.error("Error condition")

# Log exceptions with traceback
try:
    # code that might raise an exception
    raise ValueError("Example error")
except Exception as e:
    logger.exception("Error occurred: %s", e)
```

## Frontend Logging

The frontend uses a custom logging utility that logs to both the browser console and sends logs to the backend, which then stores them in the `frontend.log` file.

### Log Levels

- `DEBUG` - Detailed debugging information
- `INFO` - Confirmation that things are working as expected
- `WARN` - Indication of potential issues or unexpected events
- `ERROR` - Error conditions that prevent functionality from working correctly

### How to Use

```typescript
import { logger } from '~/utils/logger';

// Log messages at different levels
logger.debug('Detailed information for debugging');
logger.info('Confirmation of expected behavior');
logger.warn('Potential issue or unexpected event');
logger.error('Error condition');

// Log errors with Error objects
try {
  // code that might throw an error
  throw new Error('Example error');
} catch (error) {
  logger.error('Error occurred', error instanceof Error ? error : new Error(String(error)));
}
```

## Configuration

### Backend Configuration

The backend logging configuration is set up in `app/__main__.py`. It configures:

- Console output for immediate visibility during development
- File output with daily rotation
- Different log levels based on environment (debug in development, info in production)

### Frontend Configuration

The frontend logger can be configured through the `LoggerConfig` interface:

```typescript
interface LoggerConfig {
  level: LogLevel;            // Default: LogLevel.INFO
  enableConsole: boolean;     // Default: true
  enableFileLogging: boolean; // Default: true
  maxLogEntries: number;      // Default: 1000
}
```

To change settings at runtime:

```typescript
import { logger, LogLevel } from '~/utils/logger';

// Change log level
logger.setLogLevel(LogLevel.DEBUG);

// Disable console logging
logger.setConsoleLogging(false);

// Disable file logging
logger.setFileLogging(false);
```

## Best Practices

1. **Be Descriptive**: Include enough context in log messages to understand what happened
2. **Use Appropriate Levels**: Use DEBUG for detailed development information, INFO for normal operation, WARNING for potential issues, and ERROR for actual errors
3. **Include Error Objects**: When logging errors, include the actual Error object for stack traces
4. **Log State Changes**: Log important state changes and user actions
5. **Use Context**: Include relevant identifiers like file paths, request IDs, or user actions
6. **Avoid Sensitive Information**: Never log passwords, tokens, or personal data
7. **Performance Considerations**: Avoid excessive logging in performance-critical sections

## Viewing Logs

Logs can be viewed in several ways:

1. **Console**: During development, logs appear in the terminal (backend) and browser console (frontend)
2. **Log Files**: Check the `./logs` directory for log files
3. **Log Rotation**: Log files are rotated daily with naming pattern `backend.log.YYYY-MM-DD` and `frontend.log.YYYY-MM-DD`

## Troubleshooting

If logs aren't appearing as expected:

1. Check that the `logs` directory exists and has appropriate permissions
2. Verify that the correct log level is set (DEBUG shows all logs, ERROR shows only errors)
3. For frontend logs, ensure the API endpoint `/api/log` is accessible
4. Check browser console for any errors related to logging
