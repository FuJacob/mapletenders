import { Response } from 'express';

export interface ApiError {
  message: string;
  statusCode: number;
  code?: string;
}

export class TeamManagementError extends Error {
  public statusCode: number;
  public code?: string;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'TeamManagementError';
  }
}

export const handleControllerError = (
  error: any,
  res: Response,
  operation: string
): void => {
  console.error(`Error in ${operation}:`, error);

  if (error instanceof TeamManagementError) {
    res.status(error.statusCode).json({
      success: false,
      error: error.message,
      code: error.code
    });
    return;
  }

  if (error.message?.includes('duplicate key value violates unique constraint')) {
    res.status(409).json({
      success: false,
      error: 'Resource already exists',
      code: 'DUPLICATE_RESOURCE'
    });
    return;
  }

  if (error.message?.includes('foreign key constraint')) {
    res.status(400).json({
      success: false,
      error: 'Invalid reference to related resource',
      code: 'INVALID_REFERENCE'
    });
    return;
  }

  // Default error response
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: error instanceof Error ? error.message : 'Unknown error'
  });
};