#!/bin/sh

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

if [ ! -f .env.dist ]; then
  printf "${RED}ERROR: .env.dist file not found${NC}\n"
  exit 1
fi

printf "${BLUE}Updating environment variables in your .env file...${NC}\n"

if [ ! -f .env ]; then
  touch .env
  printf "${BLUE}Created new .env file${NC}\n"
fi

TEMP_FILE=$(mktemp)

grep -v "^#" .env | grep "=" | cut -d= -f1 > "$TEMP_FILE"

total_added=0
current_section=""

while IFS= read -r line || [ -n "$line" ]; do
  if echo "$line" | grep -q "^#"; then
    current_section="$line"
    section_has_new_vars=0
    continue
  fi
  
  if [ -z "$line" ]; then
    continue
  fi
  
  if echo "$line" | grep -q "="; then
    var_name=$(echo "$line" | cut -d= -f1)
    
    if ! grep -q "^$var_name$" "$TEMP_FILE"; then
      if [ "$section_has_new_vars" = "0" ]; then
        printf "\n%s\n" "$current_section" >> .env
        section_has_new_vars=1
      fi
      
      printf "%s\n" "$line" >> .env
      printf "\t- ${GREEN}%s added${NC}\n" "$var_name"
      total_added=$((total_added + 1))
      
      echo "$var_name" >> "$TEMP_FILE"
    fi
  fi
done < .env.dist

rm -f "$TEMP_FILE"

printf "\n${GREEN}✔ Environment variables updated. Added $total_added new variables.${NC}\n"