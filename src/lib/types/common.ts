/**
 * Base response structure for API responses
 */
export interface APIResponse<T> {
  status: string;
  message: string;
  data: T;
}
