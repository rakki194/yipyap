/**
 * Frontend logging utility that logs to both console and a log file
 * 
 * Usage:
 * ```ts
 * import { logger } from '~/utils/logger';
 * 
 * logger.info('This is an info message');
 * logger.warn('This is a warning message');
 * logger.error('This is an error message', new Error('Something went wrong'));
 * logger.debug('This is a debug message');
 * 
 * // Supports all console.* methods functionality:
 * logger.info('Multiple args:', 123, { foo: 'bar' });
 * logger.warn('Template literal: %s %s', 'hello', 'world');
 * logger.error('Error with context:', new Error('oops'), { context: 'details' });
 * ```
 */

// Log levels
export enum LogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error'
}

// Logger configuration
interface LoggerConfig {
    level: LogLevel;
    enableConsole: boolean;
    enableFileLogging: boolean;
    maxLogEntries: number;
}

// Log entry interface
interface LogEntry {
    timestamp: string;
    level: string;
    message: string;
    args: unknown[];
    error?: {
        message: string;
        stack?: string;
    };
    callSite?: {
        file: string;
        line: number;
        column: number;
    };
}

// Default configuration
const DEFAULT_CONFIG: LoggerConfig = {
    level: import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.INFO,
    enableConsole: true,
    enableFileLogging: true,
    maxLogEntries: 1000 // Number of log entries to keep in memory before flushing
};

// Logger class
class Logger {
    private config: LoggerConfig;
    private logBuffer: LogEntry[] = [];
    private logFlushInterval: number | null = null;

    constructor(config: Partial<LoggerConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.initFileLogging();
    }

    /**
     * Initialize file logging by setting up periodic flushing
     */
    private initFileLogging(): void {
        if (this.config.enableFileLogging) {
            // Flush logs every 30 seconds
            this.logFlushInterval = window.setInterval(() => {
                this.flushLogs();
            }, 30000);

            // Also flush logs on page unload
            window.addEventListener('beforeunload', () => {
                this.flushLogs();
            });
        }
    }

    /**
     * Flush logs to the server
     */
    private flushLogs(): void {
        if (this.logBuffer.length === 0) return;

        // Send logs to the server
        fetch('/api/log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ logs: this.logBuffer }),
            // Use keepalive to ensure the request completes even if the page is unloading
            keepalive: true
        }).catch(error => {
            // If logging fails, output to console as fallback
            console.error('Failed to send logs to server:', error);
        });

        // Clear the buffer after sending
        this.logBuffer = [];
    }

    /**
     * Get call site information from stack trace
     */
    private getCallSite(): { file: string; line: number; column: number } | undefined {
        const stack = new Error().stack;
        if (!stack) return undefined;

        // Skip the first line (Error) and the second line (getCallSite)
        const lines = stack.split('\n').slice(2);

        // Find the first line that's not from our logger
        const callSiteLine = lines.find(line =>
            !line.includes('logger.ts') &&
            !line.includes('Logger.')
        );

        if (!callSiteLine) return undefined;

        // Parse the call site line
        // Format: "    at functionName (file:line:column)"
        const match = callSiteLine.match(/at .+ \((.+):(\d+):(\d+)\)/);
        if (!match) return undefined;

        const [, file, line, column] = match;
        return {
            file: file.split('/').pop() || file, // Just get the filename
            line: parseInt(line, 10),
            column: parseInt(column, 10)
        };
    }

    /**
     * Format log entry
     */
    private formatLogEntry(level: LogLevel, ...args: unknown[]): LogEntry {
        const timestamp = new Date().toISOString();
        const callSite = this.getCallSite();

        // Handle template literals like console methods
        let message: string;
        let filteredArgs: unknown[] = [];

        if (typeof args[0] === 'string' && args[0].includes('%')) {
            // Use the same formatting as console methods
            message = args.reduce((str: string, arg, i) => {
                if (i === 0) return str;
                return str.replace(/%[sdifoOc]/, String(arg));
            }, args[0]);
            // For template literals, only include the format arguments
            filteredArgs = args.slice(1);
        } else {
            // Keep the first argument as the message
            message = String(args[0]);
            // For non-template messages, don't include the first argument in args
            filteredArgs = args.slice(1).filter(arg => !(arg instanceof Error));
        }

        // Extract error if present
        const error = args.find(arg => arg instanceof Error) as Error | undefined;
        const errorEntry = error ? {
            message: error.message,
            stack: error.stack
        } : undefined;

        return {
            timestamp,
            level: level.toUpperCase(),
            message,
            args: filteredArgs,
            error: errorEntry,
            callSite
        };
    }

    /**
     * Add entry to log buffer and flush if needed
     */
    private addLogEntry(level: LogLevel, ...args: unknown[]): void {
        const logEntry = this.formatLogEntry(level, ...args);

        // Add to buffer
        this.logBuffer.push(logEntry);
        console.debug('Added log entry:', logEntry); //FIXME: Remove

        // Flush if buffer is full
        if (this.logBuffer.length >= this.config.maxLogEntries) {
            this.flushLogs();
        }
    }

    /**
     * Log debug message
     */
    debug(...args: unknown[]): void {
        if (!this.shouldLog(LogLevel.DEBUG)) return;

        // Handle file logging
        if (this.config.enableFileLogging) {
            this.addLogEntry(LogLevel.DEBUG, ...args);
        }

        // Handle console logging
        if (this.config.enableConsole && window.console) {
            console.debug(...args);
        }
    }

    /**
     * Log info message
     */
    info(...args: unknown[]): void {
        if (!this.shouldLog(LogLevel.INFO)) return;

        // Handle file logging
        if (this.config.enableFileLogging) {
            this.addLogEntry(LogLevel.INFO, ...args);
        }

        // Handle console logging
        if (this.config.enableConsole && window.console) {
            console.info(...args);
        }
    }

    /**
     * Log warning message
     */
    warn(...args: unknown[]): void {
        if (!this.shouldLog(LogLevel.WARN)) return;

        // Handle file logging
        if (this.config.enableFileLogging) {
            this.addLogEntry(LogLevel.WARN, ...args);
        }

        // Handle console logging
        if (this.config.enableConsole && window.console) {
            console.warn(...args);
        }
    }

    /**
     * Log error message
     */
    error(...args: unknown[]): void {
        if (!this.shouldLog(LogLevel.ERROR)) return;

        // Handle file logging
        if (this.config.enableFileLogging) {
            this.addLogEntry(LogLevel.ERROR, ...args);
        }

        // Handle console logging
        if (this.config.enableConsole && window.console) {
            console.error(...args);
        }
    }

    /**
     * Check if message should be logged based on current level
     */
    private shouldLog(level: LogLevel): boolean {
        const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
        return levels.indexOf(level) >= levels.indexOf(this.config.level);
    }

    /**
     * Set log level
     */
    setLogLevel(level: LogLevel): void {
        this.config.level = level;
    }

    /**
     * Enable or disable console logging
     */
    setConsoleLogging(enabled: boolean): void {
        this.config.enableConsole = enabled;
    }

    /**
     * Enable or disable file logging
     */
    setFileLogging(enabled: boolean): void {
        if (enabled !== this.config.enableFileLogging) {
            this.config.enableFileLogging = enabled;

            if (enabled) {
                this.initFileLogging();
            } else if (this.logFlushInterval !== null) {
                window.clearInterval(this.logFlushInterval);
                this.logFlushInterval = null;
            }
        }
    }
}

// Create and export singleton instance
export const logger = new Logger(); 