#!/bin/bash

# ANSI color codes
BLUE='\x1b[38;5;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

extract_value() {
  grep -o "\"$2\": *\"[^\"]*\"" <<< "$1" | awk -F'"' '{print $4}'
}

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo -e "${BLUE}.env file not found. Make sure it exists before running.${NC}"
  exit 1
fi
SNS_ARN_TOPIC=${SNS_ARN_TOPIC}

if [ -z "$SNS_ARN_TOPIC" ]; then
  echo -e "${BLUE}SNS_ARN_TOPIC is not set. Please set it in your .env file.${NC}"
  exit 1
fi

echo "Creating SNS topic: ${SNS_ARN_TOPIC}"
echo "==================="

RESPONSE=$(awslocal sns create-topic --name ${SNS_ARN_TOPIC} --region ${AWS_REGION})
echo "$RESPONSE"
TOPIC_ARN=$(extract_value "$RESPONSE" "TopicArn")

if [ -n "$TOPIC_ARN" ]; then
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

  if ! grep -q "# AWS SNS Local" .env; then
    echo -e "\n# AWS SNS Local" >> .env
  fi

  update_env_var "SNS_ARN_TOPIC_URL" "$TOPIC_ARN"

  echo -e "${BLUE}SNS Topic created:${NC} ${GREEN}${TOPIC_ARN}${NC}"
  echo -e "${BLUE}Environment variables updated in .env file.${NC}"
else
  echo -e "${BLUE}Failed to extract TopicArn from response${NC}"
fi
