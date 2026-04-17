type LogLevel = 'info' | 'warn' | 'error';

interface LogPayload {
  message: string;
  context?: Record<string, unknown>;
}

export function appLog(level: LogLevel, payload: LogPayload) {
  const entry = {
    level,
    message: payload.message,
    context: payload.context ?? {},
    timestamp: new Date().toISOString(),
  };

  if (level === 'error') {
    console.error(JSON.stringify(entry));
    return;
  }
  if (level === 'warn') {
    console.warn(JSON.stringify(entry));
    return;
  }
  console.log(JSON.stringify(entry));
}
