export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const apiResponse = {
  success: (data: any, message = "Success") => ({
    success: true,
    message,
    data,
  }),
  error: (message: string, statusCode = 500) => ({
    success: false,
    message,
    statusCode,
  }),
};
