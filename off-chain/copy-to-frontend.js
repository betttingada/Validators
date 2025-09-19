#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define source and destination paths
const SOURCE_DIR = '/Users/ctw00206/Projects/Bead-Cardano/Aiken/bead/off-chain';
const DEST_DIR = '/Users/ctw00206/Projects/Bead-Cardano/FrontEnd/BeadBlazor/BeadBlazor/wwwroot/src';

// Directories to copy
const DIRS_TO_COPY = ['lib', 'providers', 'utils'];

// Colors for console output
const colors = {
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    reset: '\x1b[0m'
};

function log(message, color = '') {
    console.log(`${color}${message}${colors.reset}`);
}

// Recursive copy function
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Remove directory recursively
function removeDir(dir) {
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
    }
}

// Main function
function main() {
    log('Starting copy operation...', colors.yellow);

    // Check if source directories exist
    for (const dir of DIRS_TO_COPY) {
        const srcPath = path.join(SOURCE_DIR, dir);
        if (!fs.existsSync(srcPath)) {
            log(`Error: Source directory ${srcPath} does not exist`, colors.red);
            process.exit(1);
        }
    }

    // Check if destination directory exists
    if (!fs.existsSync(DEST_DIR)) {
        log(`Error: Destination directory ${DEST_DIR} does not exist`, colors.red);
        process.exit(1);
    }

    // Remove existing directories in destination
    log('Cleaning destination directory...', colors.yellow);
    for (const dir of DIRS_TO_COPY) {
        const destPath = path.join(DEST_DIR, dir);
        if (fs.existsSync(destPath)) {
            log(`Removing existing ${destPath}`);
            removeDir(destPath);
        }
    }

    // Copy directories
    log('Copying directories...', colors.yellow);
    for (const dir of DIRS_TO_COPY) {
        const srcPath = path.join(SOURCE_DIR, dir);
        const destPath = path.join(DEST_DIR, dir);
        
        try {
            log(`Copying ${dir}...`);
            copyDir(srcPath, destPath);
            log(`✓ Successfully copied ${dir}`, colors.green);
        } catch (error) {
            log(`✗ Failed to copy ${dir}: ${error.message}`, colors.red);
            process.exit(1);
        }
    }

    log('All directories copied successfully!', colors.green);
    log(`Destination: ${DEST_DIR}`, colors.yellow);

    // Show what was copied
    log('\nContents of destination directory:', colors.yellow);
    try {
        const contents = fs.readdirSync(DEST_DIR);
        contents.forEach(item => {
            const itemPath = path.join(DEST_DIR, item);
            const stats = fs.statSync(itemPath);
            const type = stats.isDirectory() ? 'DIR ' : 'FILE';
            log(`${type} ${item}`);
        });
    } catch (error) {
        log(`Error reading destination directory: ${error.message}`, colors.red);
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { copyDir, removeDir };
