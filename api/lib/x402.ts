import { x402ResourceServer } from "@x402/core/server";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { UptoEvmScheme } from "@x402/evm/upto/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";

const PAY_TO = process.env.X402_PAY_TO!;
const NETWORK = (process.env.X402_NETWORK ?? "eip155:8453") as `${string}:${string}`;
const FACILITATOR_URL = process.env.X402_FACILITATOR_URL ?? "https://x402.org/facilitator";
const MAX_PRICE = process.env.X402_MAX_PRICE ?? "$0.10";

const facilitatorClient = new HTTPFacilitatorClient({ url: FACILITATOR_URL });

export const resourceServer = new x402ResourceServer(facilitatorClient)
  .register(NETWORK, new UptoEvmScheme())
  .register(NETWORK, new ExactEvmScheme());

export const routeConfig = {
  accepts: [
    {
      scheme: "upto" as const,
      price: MAX_PRICE,
      network: NETWORK,
      payTo: PAY_TO,
    },
  ],
  description: "Culture-aware transcreation. No keys, no signup — pay per translation with USDC.",
  mimeType: "application/json",
};

export { PAY_TO, NETWORK, MAX_PRICE };
