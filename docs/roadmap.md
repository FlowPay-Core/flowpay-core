#ROADMAP FLOWPAY-CORE // 2026

* **Pix-first (deploy já)**
* **rails-agnostic (escala global)**
* **security design system (mesmo padrão em todos)**
FLOWPAY ROADMAP (2026)

PIX that actually unlocks things.
Secure by default. Rails-agnostic by design.

We don’t process payments. We issue permissions.

PHASE 0 — BRAZIL LAUNCH (PIX-first)
⏱ Jan 30 → Feb 06, 2026 (7 dias)

Objetivo: lançar FlowPay Unlock em produção, com 1 provider Pix (Brasil) e 2 produtos (A + D).

✅ Entregas:

Unlock Receipt spec v1

Core state machine + replay protection + idempotency

POST /checkout

POST /webhook/:provider

GET /unlock/verify

Membership Unlock (A)

Event Pass Unlock + Check-in (D)

📍Marco:

Primeiro pagamento Pix real → acesso liberado automaticamente.

PHASE 1 — PROVIDER MARKETPLACE (Providers plugáveis)
⏱ Feb 07 → Feb 21, 2026 (2 semanas)

Objetivo: FlowPay virar “Agent-style connector system”.

✅ Entregas:

RailAdapter interface final

Provider Registry + config loader

docs/PROVIDERS.md (tiers: Community / Verified / Partner)

Webhook router multi-provider

2º provider Pix funcionando (ex: Mercado Pago ou InfinityPay)

Admin minimal dashboard (visão de charges + receipts)

📍Marco:

Usuário escolhe provider como escolhe API em agente.

PHASE 2 — SECURITY HARDENING + AUDIT PACK
⏱ Feb 22 → Mar 07, 2026 (2 semanas)

Objetivo: FlowPay virar infra confiável para dinheiro (sem virar banco).

✅ Entregas:

SECURITY_MODEL.md versão auditável

rate-limit + throttling

receipt rotation (secret versioning)

webhook secret rotation

“signed receipts” w/ versioning

threat model + checklist deploy

📍Marco:

secure by default vira prova, não slogan.

PHASE 3 — INTERNATIONAL RAILS (First Global Expansion)
⏱ Mar 08 → Mar 31, 2026 (3 semanas)

Objetivo: provar rails-agnostic com 1 rail internacional.

✅ Entregas:

Adapter blueprint “InstantRails”

Primeiro rail internacional:

🇮🇳 UPI (recomendado)

ou 🇪🇺 SEPA Instant

Receipt continua padrão idêntico

Same security invariants

📍Marco:

Pix deixou de ser feature. Virou provider.

PHASE 4 — SETTLEMENT LAYER (Optional Crypto)
⏱ Apr 01 → Apr 30, 2026

Objetivo: settlement cripto entra como backend invisível (não produto).

✅ Entregas:

Settlement queue worker

BRL → USDC/USDT strategy plugins

Wallet monitoring + liquidity guardrails

A/B: settle instantly vs settle later

📍Marco:

Token vira ledger, não marketing.

Rails Roadmap (global)

FlowPay is Pix-first, not Pix-only.

Planned adapters:

🇧🇷 PIX (Brazil) — shipping now

🇮🇳 UPI (India) — Phase 3

🇪🇺 SEPA Instant (EU)

🇬🇧 Faster Payments (UK)

🇺🇸 ACH / RTP / FedNow (US)

🇲🇽 SPEI (Mexico)

🇦🇺 NPP (Australia)

🇸🇬 PayNow (Singapore)

Distribuição do tempo (sem autoengano)

Você percebe a inteligência desse roadmap?

Phase 0: dinheiro real + unlock real (agora)

Phase 1: marketplace + parcerias (crescimento)

Phase 2: segurança formalizada (confiança)

Phase 3: global rails (escala)

Phase 4: settlement cripto (sofisticação)

Isso evita o pecado mortal: tentar resolver stablecoin antes de resolver entrega.


## 1) Regra de ouro: internacionalizar o CORE, não os rails

Você quer replicar rápido para UPI/SEPA/etc. Concordo.

Mas a execução correta é:

### ✅ Internacionalizar em 2 camadas

#### Camada A: **FlowPay Core** (única)

* order lifecycle
* webhook verification engine
* anti-replay
* idempotency
* receipt signing
* unlock engine
* audit log

#### Camada B: **Rails Adapter** (múltiplos)

* PixAdapter
* UpiAdapter
* SepaInstantAdapter
* FasterPaymentsAdapter
* AchAdapter
* SpeiAdapter
* NppAdapter
* PayNowAdapter

Seu “produto” é A.
Os rails são B.

**Isso permite replicar sem reescrever tudo.**

---

## 2) O design de segurança tem que ser uma “spec”, não opinião

Você disse “mesmo design de segurança”.

Então vamos formalizar isso como um arquivo:

### `docs/SECURITY_MODEL.md`

E ele vira um padrão auditável.

### Security invariants (não negociáveis)

* **HMAC webhook signature**
* **timingSafeEqual**
* **Idempotency keys**
* **Replay protection** (nonce / event_id store)
* **State machine strict** (transições proibidas geram fail)
* **Least privilege** (scoped tokens)
* **No PII in receipts**
* **Immutable audit log**
* **Rate limit per charge_id**
* **Webhook allowlist + rotate secret**

Isso é o “código genético” do FlowPay.

---

## 3) A sua visão vira arquitetura modular (e isso acelera UPI/SEPA)

Vou te dar a forma exata:

### Interface padrão (TypeScript)

```ts
interface RailAdapter {
  createCharge(input: CreateChargeInput): Promise<CreateChargeOutput>
  getChargeStatus(chargeId: string): Promise<ChargeStatus>
  verifyWebhook(req: IncomingMessage): Promise<VerifiedEvent>
}
```

**Perceba:** isso obriga qualquer rail a obedecer o mesmo design de segurança.
O Core não muda.

---

## 4) O que você deve lançar agora (sem dispersão)

### Release Plan 0.1

* **PixAdapter** (Efí ou Woovi, só 1)
* **Unlock Engine**
* **Unlock Receipt**
* **Verify Endpoint**
* **Members + Event Pass** (A + D)

Isso imprime valor no Brasil imediatamente.

### Release Plan 0.2

* adiciona o conceito de `RailAdapter`
* deixa “UPI/SEPA/etc” como **roadmap** no README
* sem prometer data

### Release Plan 0.3+

* inclui 1 rail internacional (UPI seria o melhor)
* só depois: SEPA Instant

---

## 5) Por que UPI é o primeiro rail global (e não SEPA)

Você pode querer Europa por status, mas **UPI é o Pix da Índia em escala absurda**.

UPI = ambiente perfeito para provar:

* rails-agnostic
* alto volume
* mentalidade de instant payment

Então:

1. Pix
2. UPI
3. SEPA Instant

---

## 6) O manifesto final (vai pro README)

Te devolvo já pronto o bloco para topo:

```md
# FlowPay
PIX that actually unlocks things.

We don’t process payments.
We issue permissions.

Secure by default. Rails-agnostic by design.

FlowPay converts payment confirmation into a signed Unlock Receipt that grants access to digital products, memberships, and event passes — instantly.
```

---

## 7) “FlowPay Roadmap” (texto curto e forte)

Você pode colocar assim:

```md
## Rails Roadmap
FlowPay is Pix-first, not Pix-only.

Planned adapters:
- 🇧🇷 PIX (Brazil) — shipping now
- 🇮🇳 UPI (India)
- 🇪🇺 SEPA Instant (EU)
- 🇬🇧 Faster Payments (UK)
- 🇺🇸 ACH / RTP / FedNow (US)
- 🇲🇽 SPEI (Mexico)
- 🇦🇺 NPP (Australia)
- 🇸🇬 PayNow (Singapore)
```

Isso dá visão global sem virar vaporware.

---
FlowPay = “PIX that actually unlocks things.”
secure by default