import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "@x402/next";
import { translateContent, RequestSchema } from "../../../lib/translate";
import { resourceServer, routeConfig } from "../../../lib/x402";

const handler = async (request: NextRequest) => {
  const body = await request.json();
  const parsed = RequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { content, locale, type } = parsed.data;
  const result = await translateContent(content, locale, type);

  return NextResponse.json(result);
};

export const POST = withX402(handler as (request: NextRequest) => Promise<NextResponse>, routeConfig, resourceServer);
