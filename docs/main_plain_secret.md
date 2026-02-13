flowpay-core/
├─ README.md
├─ LICENSE
├─ .env.example
├─ package.json
├─ tsconfig.json
├─ src/
│  ├─ app.ts                      # bootstrap http server (fastify/express)
│  ├─ http/
│  │  ├─ routes.ts                # /checkout /status /webhook /unlock/verify /checkin
│  │  ├─ middleware/
│  │  │  ├─ rateLimit.ts
│  │  │  └─ requireApiKey.ts
│  │  └─ controllers/
│  │     ├─ checkout.controller.ts
│  │     ├─ webhook.controller.ts
│  │     ├─ status.controller.ts
│  │     ├─ unlock.controller.ts
│  │     └─ checkin.controller.ts
│  ├─ core/
│  │  ├─ domain/
│  │  │  ├─ types.ts              # Charge, Receipt, Checkin, enums
│  │  │  ├─ stateMachine.ts       # allowed transitions
│  │  │  └─ errors.ts
│  │  ├─ services/
│  │  │  ├─ checkout.service.ts   # create charge + persist
│  │  │  ├─ webhook.service.ts    # verify event + idempotency + update state
│  │  │  ├─ unlock.service.ts     # issue receipt + verify receipt + grant
│  │  │  └─ checkin.service.ts    # event pass check-in
│  │  ├─ security/
│  │  │  ├─ signatures.ts         # HMAC + timingSafeEqual + receipt signer
│  │  │  ├─ idempotency.ts        # idempotency key store
│  │  │  ├─ replay.ts             # event_id store
│  │  │  └─ pii.ts                # rules: no PII in receipts
│  │  └─ store/
│  │     ├─ store.ts              # interface
│  │     ├─ memory.store.ts       # dev
│  │     └─ postgres.store.ts     # prod (Supabase/Postgres)
│  ├─ rails/
│  │  ├─ railAdapter.ts           # interface + common helpers
│  │  ├─ registry.ts              # provider registry (plugins)
│  │  ├─ efi/
│  │  │  ├─ efi.adapter.ts
│  │  │  └─ efi.types.ts
│  │  ├─ mercadopago/
│  │  │  ├─ mp.adapter.ts
│  │  │  └─ mp.types.ts
│  │  ├─ woovi/
│  │  │  ├─ woovi.adapter.ts
│  │  │  └─ woovi.types.ts
│  │  └─ starkbank/
│  │     ├─ stark.adapter.ts
│  │     └─ stark.types.ts
│  ├─ products/
│  │  ├─ catalog.ts               # product_ref → permissions + rules
│  │  └─ grants/
│  │     ├─ membership.grant.ts   # A
│  │     └─ eventpass.grant.ts    # D
│  └─ utils/
│     ├─ http.ts
│     ├─ time.ts
│     └─ nanoid.ts
├─ docs/
│  ├─ SECURITY_MODEL.md           # secure by default (invariants)
│  ├─ UNLOCK_RECEIPT.md           # schema + signature
│  ├─ RAIL_ADAPTER.md             # contract de provider
│  └─ PROVIDERS.md                # lista + parceria
└─ examples/
   ├─ curl/
   │  ├─ checkout.sh
   │  ├─ status.sh
   │  └─ unlock_verify.sh
   └─ postman_collection.json

FlowPay = “PIX that actually unlocks things.”
secure by default

# 1) FlowPay versão “FlowPay-core” **Permission Gateway**

https://openclaw.ai/blog/introducing-openclaw de benchmark, nesse link ele mesmo fala do acaso mas podemos fazer associação com a FlowPay que soluciona, assim como o openclaw, algo que ninguém tira um tempo para entregar solução pronta de fato


**Um backend mínimo que faz 3 coisas e só:**

1. cria cobrança PIX
2. confirma pagamento
3. emite **Unlock Receipt** (o acesso)

**Todo o resto vira “later”.**

Stablecoin, token, Base, USDC… tudo isso é **liquidação**, não é produto.

---

# 2) O sistema aberto

### A) Área de membros

* monetiza rápido
* entrega instantânea
* reduz suporte
* aumenta LTV

### B) Evento físico (check-in soberano)

* cria “experiência com prova”
* vira anti-fraude
* vira gamificação natural
* vira base para rewards

O Brasil tem Pix.
O Brasil tem eventos.
O Brasil não tem: **infra de permissões**.

NEØ Protocol dando cobertura para dominar essa lacuna.

---

# 3) O que você vai jogar fora (agora)

### Corte real:

* PIX → USDC/Base
* conversão BRL/USDT
* abstração de wallet
* stake
* qualquer “token productized”

Isso não vende mais rápido.

**Isso complica mais rápido.**

---

# 4) O que você lança em 7 dias (produto real)

## FLOWPAY UNLOCK (MVP)

### Endpoint 1: `POST /checkout`

Cria cobrança Pix + `charge_id`

### Endpoint 2: `POST /webhook/pix`

Recebe confirmação e assina receipt

### Endpoint 3: `GET /unlock/:receipt_id`

Valida receipt e entrega acesso (A) ou credencial check-in (D)

Só.

---

# 5) O “núcleo” do teu produto: Unlock Receipt

Esse é o seu diferencial.

Ele é:

* comprovante
* chave de acesso
* antifraude
* pass de evento
* base futura de ledger

### Receipt tem que conter:

* `receipt_id`
* `charge_id`
* `paid_at`
* `amount_brl`
* `customer_ref`
* `product_ref`
* `permissions[]`
* `expires_at?`
* `signature`

Esse JSON é a coisa mais importante do FlowPay.
Sem isso você está só integrando Pix.

---

# 6) Como fica A (área de membros) com FlowPay

Acesso vira literal:

* pagou → receipt
* receipt → gera token de sessão + provisiona usuário
* entrega “members area URL”

Você pode fazer isso sem web3 nenhuma.

Mas se quiser “selo NEØ”:

* salva receipt em IPFS (depois)
* ou registra hash on-chain (depois)

Não precisa agora.

---

# 7) Como fica D (evento físico) com FlowPay

Aqui você cria uma arma.

O fluxo é:

**PIX paid → receipt issued → QR de check-in**

No evento:

* staff escaneia QR
* backend valida assinatura
* marca `checked_in = true`
* emite recompensa (opcional)

Isso mata:

* ingresso falso
* print de tela
* link vazado
* fraude por repetição

E abre:

* rewards
* ranking
* badges
* perks
* drops

---

# 8) O que eu faria HOJE com você (passo a passo)

Você está no ponto certo para agir com precisão.

✅ **Ação 1 (agora):** criar branch `flowpay-core`

* sem refactor grande
* só isolando core unlock

✅ **Ação 2:** criar `README.md` (produto, tese, uso)
✅ **Ação 3:** criar `docs/UNLOCK_RECEIPT.md` (spec)

✅ **Ação 4:** entregar 2 produtos:

* `memberships` unlock
* `event-pass` unlock

---

# 9) Veredito: você está certo

Você quer resultado rápido?

### Então o nome do jogo é:

**permission > settlement**

E o FlowPay vira isso:

> **PIX como trigger, acesso como produto, ledger como consequência.**


