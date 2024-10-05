import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error != null && 'status' in error;
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error != null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  );
}

/**
 * Type predicate to narrow an unknown error to an object with a 'data' property that has a string 'message' property
 */
function isErrorWithDataMessage(
  error: unknown
): error is { data: { message: string } } {
  return (
    typeof error === 'object' &&
    error != null &&
    'data' in error &&
    typeof (error as any).data === 'object' &&
    error.data != null &&
    typeof error.data === 'object' &&
    error.data != null &&
    'message' in error.data &&
    typeof (error.data as any).message === 'string'
  );
}

export function getErrorMessage(err: unknown): string {
  if (isFetchBaseQueryError(err) && isErrorWithDataMessage(err)) {
    return err.data.message;
  } else if (isErrorWithMessage(err)) {
    return err.message;
  }
  return 'An unknown error occurred';
}
