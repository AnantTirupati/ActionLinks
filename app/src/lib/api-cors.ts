import { NextResponse } from "next/server";

export function corsHeaders(request: Request) {
  const origin = request.headers.get("origin") || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}

export function handleOptions(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request),
  });
}

export function jsonResponse(success: boolean, dataOrError: any, status = 200, request?: Request) {
  const body = success
    ? { success: true, data: dataOrError }
    : { success: false, error: dataOrError };

  const headers = request ? corsHeaders(request) : {};

  return NextResponse.json(body, {
    status,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
}
