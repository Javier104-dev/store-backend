#!/bin/bash

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo -e "${BLUE}.env file not found. Make sure it exists before running.${NC}"
  exit 1
fi
S3_BUCKET=${S3_BUCKET}

if [ -z "$S3_BUCKET" ]; then
  echo -e "${BLUE}S3_BUCKET is not set. Please set it in your .env file.${NC}"
  exit 1
fi

echo "Creating S3 bucket: ${S3_BUCKET}"
echo "==================="

awslocal s3api create-bucket --bucket ${S3_BUCKET} --acl public-read --region ${AWS_REGION}

awslocal s3 ls --region ${AWS_REGION}

echo -e "${BLUE}S3 Bucket created:${NC} ${GREEN}${S3_BUCKET}${NC}"
