import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import * as path from 'node:path';
import * as fs from 'node:fs';

const LOG_LEVELS: LogLevel[] = ['error', 'warn', 'log', 'debug', 'verbose'];

@Injectable()
export class LoggingService implements LoggerService {
  private readonly logLevel: LogLevel;
  private readonly logFile: string;
  private readonly errorFile: string;
  private readonly maxFileSize: number;
  private logStream: fs.WriteStream;
  private errorStream: fs.WriteStream;

  constructor() {
    const logDir = path.join(__dirname, '..', '..', 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    this.logLevel = (process.env.LOG_LEVEL as LogLevel) || 'log';
    this.logFile = path.join(logDir, 'common.log');
    this.errorFile = path.join(logDir, 'error.log');
    this.maxFileSize = Number(process.env.LOG_FILE_SIZE_KB) * 1000 || 10 * 1000;

    this.logStream = fs.createWriteStream(this.logFile, { flags: 'a' });
    this.errorStream = fs.createWriteStream(this.errorFile, { flags: 'a' });

    this.debug(
      `Logging initialized: level=${this.logLevel}, logFile=${this.logFile}, errorFile=${this.errorFile}, maxFileSize=${this.maxFileSize / 1000}KB`,
    );
  }

  private shouldLog(level: LogLevel) {
    return LOG_LEVELS.indexOf(level) <= LOG_LEVELS.indexOf(this.logLevel);
  }

  log(message: any, ...optionalParams: any[]) {
    if (this.shouldLog('log')) this.write('LOG', message, optionalParams);
  }
  error(message: any, ...optionalParams: any[]) {
    if (this.shouldLog('error')) {
      this.write('ERROR', message, optionalParams, true);
    }
  }
  warn(message: any, ...optionalParams: any[]) {
    if (this.shouldLog('warn')) this.write('WARN', message, optionalParams);
  }
  debug(message: any, ...optionalParams: any[]) {
    if (this.shouldLog('debug')) this.write('DEBUG', message, optionalParams);
  }
  verbose(message: any, ...optionalParams: any[]) {
    if (this.shouldLog('verbose'))
      this.write('VERBOSE', message, optionalParams);
  }

  private async write(
    level: string,
    message: any,
    optionalParams: any[],
    isError = false,
  ) {
    const logMsg = `[${new Date().toISOString()}] [${level}] ${typeof message === 'string' ? message : JSON.stringify(message)} ${optionalParams.length ? JSON.stringify(optionalParams) : ''}\n`;
    await this.appendWithRotation(
      this.logFile,
      logMsg,
      this.logStream,
      (stream) => {
        this.logStream = stream;
      },
    );
    if (isError) {
      await this.appendWithRotation(
        this.errorFile,
        logMsg,
        this.errorStream,
        (stream) => {
          this.errorStream = stream;
        },
      );
    }
    if (process.env.LOG_TO_STDOUT === 'true') process.stdout.write(logMsg);
  }

  private async appendWithRotation(
    filePath: string,
    logMsg: string,
    stream: fs.WriteStream,
    updateStream: (stream: fs.WriteStream) => void,
  ) {
    try {
      const { size } = fs.existsSync(filePath)
        ? fs.statSync(filePath)
        : { size: 0 };
      if (size + Buffer.byteLength(logMsg) > this.maxFileSize) {
        stream.end();
        const rotated = filePath.replace(/\.log$/, `-${Date.now()}.log`);
        fs.renameSync(filePath, rotated);
        const newStream = fs.createWriteStream(filePath, { flags: 'a' });
        updateStream(newStream);
        newStream.write(logMsg);
      } else {
        stream.write(logMsg);
      }
    } catch (err) {
      process.stdout.write(`[LOGGER ERROR] ${err}\n`);
      process.stdout.write(logMsg);
    }
  }
}
