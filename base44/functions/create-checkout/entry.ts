import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const PLANS = {
  single: {
    name: "Single Car Song",
    price: "2.99",
    quantity: 1,
  },
  five_pack: {
    name: "5 Car Song Pack",
    price: "9.99",
    quantity: 1,
  },
  ten_pack: {
    name: "10 Car Song Pack",
    price: "17.99",
    quantity: 1,
  },
  dealer: {
    name: "Dealer Monthly Plan",
    price: "79.00",
    quantity: 1,
    subscriptionInfo: {
      subscriptionSettings: {
        frequency: "MONTH",
      },
      title: "Dealer Monthly Plan",
      description: "Unlimited car song generations for dealerships, billed monthly",
    },
  },
};

Deno.serve(async (req) => {
  try {
    const { planId } = await req.json();

    const plan = PLANS[planId];
    if (!plan) {
      return Response.json({ error: "Invalid plan" }, { status: 400 });
    }

    const origin = req.headers.get("Origin") || "https://car-song-generator.base44.app";
    const thankYouUrl = `${origin}/thank-you`;
    const homeUrl = origin;

    const WIX_API_KEY = Deno.env.get("WIX_PAYMENTS_API_KEY");
    const WIX_SITE_ID = Deno.env.get("WIX_PAYMENTS_SITE_ID");

    const item = {
      name: plan.name,
      quantity: plan.quantity,
      price: plan.price,
    };
    if (plan.subscriptionInfo) {
      item.subscriptionInfo = plan.subscriptionInfo;
    }

    const response = await fetch(
      "https://www.wixapis.com/payments/platform/v1/checkout-sessions/construct",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": WIX_API_KEY,
          "wix-site-id": WIX_SITE_ID,
        },
        body: JSON.stringify({
          cart: { items: [item] },
          callbackUrls: {
            postFlowUrl: homeUrl,
            thankYouPageUrl: thankYouUrl,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Wix Payments error:", JSON.stringify(data));
      return Response.json({ error: data.message || "Checkout creation failed" }, { status: response.status });
    }

    return Response.json({ redirectUrl: data.checkoutSession.redirectUrl });
  } catch (error) {
    console.error("create-checkout error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});