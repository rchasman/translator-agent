import { NextResponse } from "next/server";
import { MAX_PRICE, NETWORK, PAY_TO } from "../../../lib/x402";

export const GET = async () =>
  NextResponse.json({
    name: "translator-agent",
    description: "Culture-aware transcreation. No keys, no signup — pay per translation with USDC.",
    version: "0.1.0",
    endpoints: {
      "POST /api/translate": {
        body: {
          content: "string — the text/JSON/HTML/markdown to translate",
          locale: "string — target locale (e.g. ja, fr, de, ar)",
          type: "json | markdown | html (default: json)",
        },
        payment: {
          protocol: "x402",
          scheme: "upto",
          currency: "USDC",
          maxPrice: MAX_PRICE,
          network: NETWORK,
          payTo: PAY_TO,
        },
      },
    },
  });
