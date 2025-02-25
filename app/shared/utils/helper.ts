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
function isErrorWithDataMessage(error: unknown): error is { data: { message: string } } {
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
  const SERVER_ERROR_MESSAGE = 'Server không phản hồi';
  const UNKNOWN_ERROR_MESSAGE = 'Đã xảy ra lỗi không xác định';
  const FETCH_ERROR_MESSAGE = 'Vui lòng kiểm tra lại kết nối mạng';
  if (isFetchBaseQueryError(err) && isErrorWithDataMessage(err)) {
    if (err.status === 500 || err.data.message === 'Aborted') {
      return SERVER_ERROR_MESSAGE;
    }
    return err.data.message;
  } else if (isErrorWithMessage(err)) {
    if (err.message === 'Aborted') {
      return SERVER_ERROR_MESSAGE;
    }
    return err.message;
  }
  if ((err as any).status === 'FETCH_ERROR') {
    return FETCH_ERROR_MESSAGE;
  }
  return UNKNOWN_ERROR_MESSAGE;
}
