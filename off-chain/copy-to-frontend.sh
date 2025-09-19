#!/bin/bash

# Script to copy lib, providers, and utils folders to the BeadBlazor frontend
# Run this script from the off-chain directory

# Define source and destination paths
SOURCE_DIR="/Users/ctw00206/Projects/Bead-Cardano/Aiken/bead/off-chain"
DEST_DIR="/Users/ctw00206/Projects/Bead-Cardano/FrontEnd/BeadBlazor/BeadBlazor/wwwroot/src"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting copy operation...${NC}"

# Check if source directories exist
for dir in "lib" "providers" "utils"; do
    if [ ! -d "$SOURCE_DIR/$dir" ]; then
        echo -e "${RED}Error: Source directory $SOURCE_DIR/$dir does not exist${NC}"
        exit 1
    fi
done

# Check if destination directory exists
if [ ! -d "$DEST_DIR" ]; then
    echo -e "${RED}Error: Destination directory $DEST_DIR does not exist${NC}"
    exit 1
fi

# Remove existing directories in destination (if they exist)
echo -e "${YELLOW}Cleaning destination directory...${NC}"
for dir in "lib" "providers" "utils"; do
    if [ -d "$DEST_DIR/$dir" ]; then
        echo "Removing existing $DEST_DIR/$dir"
        rm -rf "$DEST_DIR/$dir"
    fi
done

# Copy directories
echo -e "${YELLOW}Copying directories...${NC}"
for dir in "lib" "providers" "utils"; do
    echo "Copying $dir..."
    cp -r "$SOURCE_DIR/$dir" "$DEST_DIR/"
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Successfully copied $dir${NC}"
    else
        echo -e "${RED}✗ Failed to copy $dir${NC}"
        exit 1
    fi
done

echo -e "${GREEN}All directories copied successfully!${NC}"
echo -e "${YELLOW}Destination: $DEST_DIR${NC}"

# Show what was copied
echo -e "\n${YELLOW}Contents of destination directory:${NC}"
ls -la "$DEST_DIR"
