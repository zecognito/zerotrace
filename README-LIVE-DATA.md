# ZeroTrace Analytics Live Data Pipeline V1

This package adds the self-updating data layer without changing the locked visual templates.

## Files
- `.github/workflows/analytics-data.yml` — hourly GitHub Action
- `scripts/update_analytics.py` — Zcash RPC collector
- `analytics/data/latest.json` — public normalized dataset
- `analytics/data/live.js` — browser loader

## Required GitHub repository secrets
`ZCASH_RPC_URL` is required for live node data.
`ZCASH_RPC_USER` and `ZCASH_RPC_PASSWORD` are optional if the endpoint does not require Basic Auth.

The collector uses `getblockchaininfo` for height, difficulty, chain supply and value pools,
and `getnetworksolps` for network solution rate. If a refresh fails, it preserves the last
known dataset instead of inventing a value.

Do not expose RPC credentials in site JavaScript. GitHub Actions keeps them server-side.
