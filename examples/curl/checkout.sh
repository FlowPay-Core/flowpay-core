#!/bin/bash

# Example: Create a new checkout charge
# Usage: ./checkout.sh <provider_id> <amount_cents> <customer_ref> <product_ref>

PROVIDER=${1:-efi}
AMOUNT=${2:-1000}
CUSTOMER=${3:-user_123}
PRODUCT=${4:-MEMBERSHIP_BASIC}
IDEMP=$(date +%s%N)

curl -X POST http://localhost:3000/checkout \
  -H "Content-Type: application/json" \
  -d "{
    \"providerId\": \"$PROVIDER\",
    \"amountCents\": $AMOUNT,
    \"customerRef\": \"$CUSTOMER\",
    \"productRef\": \"$PRODUCT\",
    \"idempotencyKey\": \"idemp_$IDEMP\"
  }"
