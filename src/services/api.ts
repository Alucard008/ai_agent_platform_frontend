// src/services/api.ts
import useSWR, { mutate } from "swr"
import { useContext } from "react"
import { AuthContext } from "context/AuthContext"
import { API_BASE } from "../utils/constants"

async function doFetch<T>(endpoint: string, data?: any, token?: string): Promise<T> {
  const url = `${API_BASE}${endpoint}`
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(url, {
    method: data ? "POST" : "GET",
    headers,
    body: data ? JSON.stringify(data) : undefined,
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(errText || res.statusText)
  }

  return res.json()
}

export function useAPI<T>(endpoint: string, payload?: any) {
  const { token } = useContext(AuthContext)

  // If no token, don’t even call
  const key = token
    ? payload !== undefined
      ? [endpoint, payload, token]    // swr key tuple
      : [endpoint, null, token]
    : null

  // Fixed: Destructure key array into individual arguments
  const swrFetcher = ([url, body, jwt]: [string, any, string]) => 
    doFetch<T>(url, body, jwt)

  const { data, error } = useSWR<T>(key, swrFetcher)
  return {
    data,
    error,
    isLoading: key !== null && !error && !data,
  }
}

export async function postAPI<T>(endpoint: string, payload: any) {
  // Use localStorage to get token (consistent with AuthContext persistence)
  const token = localStorage.getItem("token") || undefined
  const result = await doFetch<T>(endpoint, payload, token)
  // Revalidate all GETs for this endpoint
  await mutate([endpoint, null, token])
  return result
}