/* eslint-disable no-console */
// https://bluesock.org/~willkg/dev/ansi.html
const Color = {
  Reset: '\x1b[0m',
  FgRed: '\x1b[31m',
  FgYellow: '\x1b[33m',
  FgWhite: '\x1b[37m'
};

export type logType = 'info' | 'error' | 'warn';

const mapColors: { [key in logType]: string } = {
  info: Color.FgWhite,
  warn: Color.FgYellow,
  error: Color.FgRed
};

export class LogService {
  private static getDate() {
    return new Date().toISOString();
  }

  private static formatType(logType: logType) {
    return `${logType.toUpperCase()}`;
  }

  private static log(logType: logType, ...messages: unknown[]) {
    console.log(
      `${mapColors[logType]}${this.getDate()}  ${this.formatType(logType)}  ${messages
        .map((log) => {
          if (typeof log === 'object') {
            return JSON.stringify(log);
          }

          return log;
        })
        .join('')}${Color.Reset}`
    );
  }

  static info(...messages: unknown[]) {
    this.log('info', ...messages);
  }

  static error(...messages: unknown[]) {
    this.log('error', ...messages);
  }

  static warning(...messages: unknown[]) {
    this.log('warn', ...messages);
  }
}
