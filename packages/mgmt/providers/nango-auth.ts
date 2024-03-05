import {z} from '@supaglue/vdk'
import cookie from 'cookie'
import {
  fromNangoConnectionId,
  fromNangoProviderConfigKey,
  toNangoConnectionId,
  toNangoProviderConfigKey,
} from './nango-postgres-provider'

const zParams = z.object({
  customer_id: z.string(),
  provider_name: z.string(),
  scope: z.string().optional(),
  return_url: z.string().optional(),
  state: z.string().optional(),
  // we don't need application_id here for now
})

const zCookie = zParams.pick({state: true, return_url: true})


// TODO: Put helpers for how to construct a connect url into a published SDK
// even if it's just a standalone package

export function nangoAuthCreateInitHandler({
  env,
  getServerUrl,
}: {
  env: {NEXT_PUBLIC_NANGO_PUBLIC_KEY: string}
  getServerUrl: (req: Request) => string
}) {
  return async function GET(req: Request) {
    const reqUrl = new URL(req.url)
    const params = zParams.parse(
      Object.fromEntries(reqUrl.searchParams.entries()),
    )

    // TODO: put this into sdk-nango
    const nangoConnectUrl = new URL(
      `https://api.nango.dev/oauth/connect/${toNangoProviderConfigKey(
        params.provider_name,
      )}`,
    )
    nangoConnectUrl.searchParams.set(
      'connection_id',
      toNangoConnectionId(params.customer_id),
    )
    nangoConnectUrl.searchParams.set(
      'public_key',
      env.NEXT_PUBLIC_NANGO_PUBLIC_KEY,
    )

    const res = await fetch(nangoConnectUrl, {redirect: 'manual'})
    const location = res.headers.get('location')
    if (res.status !== 302 || !location) {
      throw new Error('Missing redirect from nango /oauth/connect response')
    }

    const oauthUrl = new URL(location)
    const redirectUri = new URL(
      '/connect/callback',
      getServerUrl(req),
    ).toString()

    if (oauthUrl.searchParams.get('redirect_uri') !== redirectUri) {
      // redirect_uri is needed when exchanging code later. Nango needs to know the right value otherwise code exchange will fail during callback
      throw new Error(
        `Please set your callback url to ${redirectUri} in your nango project settings`,
      )
    }
    // Override default scope set by Nango
    if (params.scope) {
      oauthUrl.searchParams.set('scope', params.scope)
    }
    // Persist state for later retrieval
    const cookieKey = oauthUrl.searchParams.get('state') // nango state uuid
    const cookieValue = JSON.stringify({
      return_url: params.return_url,
      state: params.state,
    } as z.infer<typeof zCookie>)

    return new Response(null, {
      status: 307, // temp redirect
      headers: {
        location: oauthUrl.toString(),
        // For whatever reason cookie is visible on /connect/* but not on / root page
        'set-cookie': cookie.serialize(`state-${cookieKey}`, cookieValue),
      },
    })
  }
}

export async function nangoAuthCallbackHandler(req: Request) {
  const reqUrl = new URL(req.url)

  const cookies = cookie.parse(req.headers.get('cookie') ?? '')
  const cookieKey = reqUrl.searchParams.get('state') // nango state uuid
  const cookieValue = cookies[`state-${cookieKey}`]
  const initParams = zCookie.parse(JSON.parse(cookieValue!))

  const nangoCallbackUrl = new URL('https://api.nango.dev/oauth/callback')
  reqUrl.searchParams.forEach((value, key) => {
    nangoCallbackUrl.searchParams.append(key, value)
  })

  const event = await fetch(nangoCallbackUrl, {redirect: 'manual'})
    .then((res) => res.text())
    .then(parseNangoOauthCallbackPage)

  const returnUrl = initParams.return_url
    ? new URL(initParams.return_url)
    : null

  const returnParams = {
    result:
      event?.eventType === 'AUTHORIZATION_SUCEEDED'
        ? ('SUCCESS' as const)
        : ('ERROR' as const),
    ...(event?.eventType === 'AUTHORIZATION_SUCEEDED' && {
      customer_id: fromNangoConnectionId(event.data.connectionId),
      provider_name: fromNangoProviderConfigKey(event.data.providerConfigKey),
    }),
    ...(event?.eventType === 'AUTHORIZATION_FAILED' && {
      error_type: event.data.authErrorType,
      error_detail: event.data.authErrorDesc,
    }),
    state: initParams.state,
  }

  Object.entries(returnParams).forEach(([key, value]) => {
    if (value) {
      returnUrl?.searchParams.append(key, value)
    }
  })

  // For debugging
  return new Response(JSON.stringify({initParams, returnParams}), {
    status: returnUrl ? 307 : 200,
    headers: {
      'content-type': 'application/json',
      ...(returnUrl && {location: returnUrl.toString()}),
    },
  })
}

const zNangoOauthCallbackMessage = z.discriminatedUnion('eventType', [
  z.object({
    eventType: z.literal('AUTHORIZATION_SUCEEDED'),
    data: z.object({providerConfigKey: z.string(), connectionId: z.string()}),
  }),
  z.object({
    eventType: z.literal('AUTHORIZATION_FAILED'),
    data: z.object({authErrorDesc: z.string(), authErrorType: z.string()}),
  }),
])

function parseNangoOauthCallbackPage(html: string) {
  const parseStrVar = (name: string) =>
    html
      .match(new RegExp(`${name.replace('.', '.')} = (?:'|\`|")(.*)`))?.[1]
      ?.replace(/('|`|");?$/, '')

  const eventType = parseStrVar('message.eventType')

  const authErrorType = parseStrVar('window.authErrorType')
  const authErrorDesc = parseStrVar('window.authErrorDesc')

  const providerConfigKey = parseStrVar('window.providerConfigKey')
  const connectionId = parseStrVar('window.connectionId')

  const res = zNangoOauthCallbackMessage.safeParse({
    eventType,
    data: {providerConfigKey, connectionId, authErrorDesc, authErrorType},
  })
  return res.success ? res.data : undefined
}