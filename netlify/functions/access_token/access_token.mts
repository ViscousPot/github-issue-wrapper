import type { Config, Context } from "@netlify/functions";
import { CLIENT_ID, REDIRECT_URI } from '../../../src/constants';

export default async (req: Request, context: Context) => {
  const client_secret = Netlify.env.get("VITE_CLIENT_SECRET");

  const { code } = context.params;
  if (client_secret == undefined) return new Response("There is an issue, please contact the developer at bugs.viscouspotential@gmail.com", { status: 403 })

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret,
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  if (response.status != 200) {
    return new Response("Invalid code!", { status: 401 })
  }

  const data = await response.json();

  if (Object.keys(data).includes("error")) {
    return new Response(data["error_description"], { status: 401 })
  }

  return new Response(data.access_token)
}

export const config: Config = {
  path: "/access_token/:code"
};