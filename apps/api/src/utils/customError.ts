export interface CustomError {
  statusCode: number;
  message: string;
}

export function createCustomError(statusCode: number, message: string) {
  return { statusCode, message } as CustomError;
}
