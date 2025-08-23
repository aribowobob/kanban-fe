import { getCookie } from "cookies-next";
import { redirect } from "next/navigation";

/**
 * Middleware function to check if user is authenticated
 * Use this in server components to redirect users before rendering the page
 * @param redirectTo Default path to redirect to if no token is found
 */
export function checkAuth(redirectTo = "/login") {
  const token = getCookie("access_token");

  if (!token) {
    redirect(redirectTo);
  }
}

/**
 * Middleware function to check if user is NOT authenticated
 * Use this in server components to redirect authenticated users
 * @param redirectTo Default path to redirect authenticated users to
 */
export function checkGuest(redirectTo = "/dashboard") {
  const token = getCookie("access_token");

  if (token) {
    redirect(redirectTo);
  }
}
