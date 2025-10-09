#!/bin/bash

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo -e "${BLUE}.env file not found. Make sure it exists before running.${NC}"
  exit 1
fi
SES_IDENTITY_EMAIL=${SES_IDENTITY_EMAIL}

if [ -z "$SES_IDENTITY_EMAIL" ]; then
  echo -e "${BLUE}SES_IDENTITY_EMAIL is not set. Please set it in your .env file.${NC}"
  exit 1
fi

echo "Creating email identity for SES service email address: ${SES_IDENTITY_EMAIL}"
echo "==================="

awslocal ses verify-email-identity --email-address ${SES_IDENTITY_EMAIL}

awslocal ses list-identities

echo -e "${BLUE}Email identity created:${NC} ${GREEN}${SES_IDENTITY_EMAIL}${NC}"
