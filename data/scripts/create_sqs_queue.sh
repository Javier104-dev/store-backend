#!/usr/bin/env bash

# ANSI color codes
BLUE='\x1b[38;5;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

set -euo pipefail

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo -e "${BLUE}.env file not found. Make sure it exists before running.${NC}"
  exit 1
fi

SQS_QUEUE_NAME=${SQS_QUEUE_NAME}

if [ -z "$SQS_QUEUE_NAME" ]; then
  echo -e "${BLUE}SQS_QUEUE_NAME is not set. Please set it in your .env file.${NC}"
  exit 1
fi

extract_value() {
  grep -o "\"$2\": *\"[^\"]*\"" <<< "$1" | awk -F'"' '{print $4}'
}

echo "Creating SQS queue: ${SQS_QUEUE_NAME}"
echo "==================="

queue_response=$(aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name ${SQS_QUEUE_NAME} --region ${AWS_REGION} --attributes VisibilityTimeout=30 --output json)
queue_url=$(extract_value "$queue_response" "QueueUrl")

sqs_endpoint=$(echo "${queue_url}" | grep -o "http://[^/]*")

aws --endpoint-url=http://localhost:4566 sqs list-queues --region ${AWS_REGION}

echo -e "${BLUE}SQS Queue created:${NC} ${GREEN}${SQS_QUEUE_NAME}${NC}"
echo -e "${BLUE}SQS Endpoint:${NC} ${GREEN}${sqs_endpoint}${NC}"

echo -e "${BLUE}Adding/updating environment variables in your .env file...${NC}"
echo -e ""

update_env_var() {
  local var_name=$1
  local var_value=$2

  if grep -q "^$var_name=" .env; then
    sed -i "s|^$var_name=.*|$var_name=$var_value|" .env
    echo -e "${BLUE}Updated ${var_name}=${NC} ${GREEN}${var_value}${NC}"
  else
    echo "$var_name=$var_value" >> .env
    echo -e "${BLUE}Added ${var_name}=${NC} ${GREEN}${var_value}${NC}"
  fi
}

if ! grep -q "# AWS SQS Local" .env; then
  echo -e "\n# AWS SQS Local" >> .env
fi

update_env_var "SQS_QUEUE_URL" "${queue_url}"
update_env_var "SQS_ENDPOINT" "${sqs_endpoint}"

echo -e "${BLUE}Environment variables updated in .env file.${NC}"
