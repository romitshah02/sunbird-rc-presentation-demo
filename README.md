# Sunbird RC OID4VC credentials demo

A demo app that shows OID4VC verifiable credentials in use. A student holds a credential issued through Sunbird RC in their wallet, and this app shows how different services can ask for it and verify it. The app covers the presentation side (OpenID4VP) and uses the Sunbird RC sandbox verifier.

Each page plays a different relying party. It asks the verifier for a presentation request, shows the request as a QR code, and waits for the holder to scan it with a wallet and share their student credential. It then shows the claims it received and a verdict.

There is no navigation. Open each page by its URL.

| URL | Relying party | Eligibility check |
|---|---|---|
| `/theatre` (also `/`) | Movie theatre | Kid: `status` is `ACTIVE`. Adult (18+): `status` is `ACTIVE` and `age` is 18 or more. Chosen with the Criança / Adulto toggle. |
| `/transport` | City bus transport | `status` is `ACTIVE`. Headline: "Eligible For Bus Pass". |
| `/bank` | Student bank account | `status` is `ACTIVE`, name, email, phone, address and nationality are present, and the student is 18+ or has guardian name, relationship and phone. Headline: "Eligible For Student Bank Account". |

`completionStatus` is not checked on any page.

## How it works

1. The holder clicks **Request**.
2. The page POSTs that page's static DCQL request body to the verifier (`VITE_VERIFIER_URL`).
3. The verifier answers with a `transaction_id` and `qr_data`, an `openid4vp://` link. The page renders `qr_data` as the QR code.
4. The holder scans it with a wallet and approves sharing the requested claims.
5. The page polls `GET <<verifier_url>>/vp/status/{transaction_id}` every 2 seconds until the status says `verified: true`. It gives up after 5 minutes.
6. The received claims are listed, and the page's check produces the verdict.

The request bodies use the `dc+sd-jwt` format with the Sunbird RC sandbox student credential type (`.../vct/student`). The bodies request claims without value filters, so the wallet presents any student credential and the app's own checks decide eligibility and show the reason, for example "enrolment status is INACTIVE".

## Run it

Requires Node 22 and npm.

```
npm install
cp .env.example .env
```

Set the verifier URL in `.env`, including the full path:

```
VITE_VERIFIER_URL=<<verifier_url>>/vp/request
```

The status URL is derived from this value by replacing `/request` with `/status/<id>`, so it must end in `/request`.

```
npm run dev      # http://localhost:5173
npm run build    # type-check and production build into dist/
```

Restart the dev server after changing `.env`, because Vite reads it only at startup.

## Deploy

The build output is static files. Any static host works, as long as every path is rewritten to `index.html`, otherwise refreshing `/transport` or `/bank` returns 404.

A Dockerfile with nginx is included:

```
docker build --build-arg VITE_VERIFIER_URL=<<verifier_url>>/vp/request -t vp-qr .
docker run -p 8080:80 vp-qr
```

Vite inlines `VITE_*` values at build time, so the verifier URL is a build argument. Changing it means rebuilding the image.

## Project layout

```
src/
  main.tsx          routes: /, /theatre, /transport, /bank, anything else is "Not found"
  VpPage.tsx        shared page: Request button, QR, status polling, claims and verdict
  vpRequest.ts      verifier calls: requestQr (POST) and awaitClaims (status polling)
  bodies/           the static request body for each page
  processing/       the eligibility check for each page, and the shared Verdict type
  pages/            one thin page component per route
  index.css         per-page themes (theatre, transport, bank)
```

To change what a page asks for, edit its file in `src/bodies/`. To change who is eligible, edit its file in `src/processing/`.

## Limitations

- **The verdict is worked out in the browser** from the verifier's status response. That is fine for a demo, but it is not tamper-proof. A real relying party should decide on its own backend.
- **The status values for a pending or failed scan are assumed.** Any status other than `verified: true` keeps polling, unless it contains fail, reject, expire, denied or error.
- **Page text is mostly English**, except the Criança / Adulto toggle labels.
