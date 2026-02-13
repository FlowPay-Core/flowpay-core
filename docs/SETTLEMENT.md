# SETTLEMENT.md — Fiat to Stablecoin

FlowPay provides an optional Settlement Engine to convert incoming Fiat (BRL) into Stablecoins (USDT/USDC).

## Philosophy: Unlock First, Settle Later

1. **User Experience**: The product (access) is unlocked the moment Pix is confirmed.
2. **Operational Efficiency**: Settlement can happen asynchronously, in batches, to optimize gas fees and exchange rates.

## Architecture

1. **PAID State**: Triggered by webhook.
2. **Settlement Job**: Enqueued automatically (async).
3. **Rules Engine**: Filters jobs based on:
   - Batch windows (e.g., every 2 hours).
   - Minimum conversion threshold (e.g., R$ 500).
   - Daily limits and risk scoring.
4. **Execution**: Routes to Exchange/OTC for conversion.
5. **On-chain Transfer**: Stablecoins are sent to the Treasury Wallet (Base/Polygon).
6. **Proof**: A settlement receipt (TX hash) is recorded in the Ledger.

## Guardrails

- **Batch Windows**: Optimize transaction density.
- **Liquidity Thresholds**: Minimum amount required before triggering a conversion.
- **Manual Review**: High-value transactions are held for audit.
- **Routing Policy**: Automatic selection of the best OTC provider based on volume.
