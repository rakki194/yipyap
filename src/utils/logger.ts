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

// Default configuration
const DEFAULT_CONFIG: LoggerConfig = {
    level: LogLevel.INFO,
    enableConsole: true,
    enableFileLogging: true,
    maxLogEntries: 1000 // Number of log entries to keep in memory before flushing
};

// Logger class
class Logger {
    private config: LoggerConfig;
    private logBuffer: string[] = [];
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

        const logs = this.logBuffer.join('\n');
        this.logBuffer = [];

        // Send logs to the server
        fetch('/api/log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ logs }),
            // Use keepalive to ensure the request completes even if the page is unloading
            keepalive: true
        }).catch(error => {
            // If logging fails, output to console as fallback
            console.error('Failed to send logs to server:', error);
        });
    }

    /**
     * Format log entry with timestamp
     */
    private formatLogEntry(level: LogLevel, message: string, error?: Error): string {
        const timestamp = new Date().toISOString();
        let logEntry = `${timestamp} - ${level.toUpperCase()} - ${message}`;

        if (error) {
            logEntry += `\n${error.stack || error.message || String(error)}`;
        }

        return logEntry;
    }

    /**
     * Add entry to log buffer and flush if needed
     */
    private addLogEntry(level: LogLevel, message: string, error?: Error): void {
        const logEntry = this.formatLogEntry(level, message, error);

        // Add to buffer
        this.logBuffer.push(logEntry);

        // Flush if buffer is full
        if (this.logBuffer.length >= this.config.maxLogEntries) {
            this.flushLogs();
        }
    }

    /**
     * Log debug message
     */
    debug(message: string, error?: Error): void {
        if (this.shouldLog(LogLevel.DEBUG)) {
            if (this.config.enableConsole) {
                console.debug(message, error || '');
            }

            if (this.config.enableFileLogging) {
                this.addLogEntry(LogLevel.DEBUG, message, error);
            }
        }
    }

    /**
     * Log info message
     */
    info(message: string, error?: Error): void {
        if (this.shouldLog(LogLevel.INFO)) {
            if (this.config.enableConsole) {
                console.info(message, error || '');
            }

            if (this.config.enableFileLogging) {
                this.addLogEntry(LogLevel.INFO, message, error);
            }
        }
    }

    /**
     * Log warning message
     */
    warn(message: string, error?: Error): void {
        if (this.shouldLog(LogLevel.WARN)) {
            if (this.config.enableConsole) {
                console.warn(message, error || '');
            }

            if (this.config.enableFileLogging) {
                this.addLogEntry(LogLevel.WARN, message, error);
            }
        }
    }

    /**
     * Log error message
     */
    error(message: string, error?: Error): void {
        if (this.shouldLog(LogLevel.ERROR)) {
            if (this.config.enableConsole) {
                console.error(message, error || '');
            }

            if (this.config.enableFileLogging) {
                this.addLogEntry(LogLevel.ERROR, message, error);
            }
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