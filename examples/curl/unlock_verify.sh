#!/bin/bash

# Example: Verify an unlock receipt
# Usage: ./unlock_verify.sh <receipt_id>

RECEIPT_ID=$1

if [ -z "$RECEIPT_ID" ]; then
  echo "Usage: ./unlock_verify.sh <receipt_id>"
  exit 1
fi

curl -X GET http://localhost:3000/unlock/verify/$RECEIPT_ID
