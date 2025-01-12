const SSI = require('ssi');
const fs = require('fs');
const path = require('path');

// Directories and file matcher
const inputDirectory = './'; // Source directory
const outputDirectory = './dist/'; // Temporary output directory
const matcher = '*.shtml'; // Pattern to match `.shtml` files

// Initialize SSI processor
const ssi = new SSI(inputDirectory, outputDirectory, matcher);

// Compile all `.shtml` files
ssi.compile();
console.log('HTML files generated successfully in the dist directory.');

// Move, rename, and replace links in files
const files = fs.readdirSync(outputDirectory).filter(file => file.endsWith('.shtml'));

files.forEach(file => {
    const srcPath = path.join(outputDirectory, file);
    const destPath = path.join(inputDirectory, file.replace('.shtml', '.html'));

    // Read the file contents
    let content = fs.readFileSync(srcPath, 'utf-8');

    // Replace `.shtml` links with `.html` links, preserving fragments
    content = content.replace(/href="([^"]+)\.shtml(#[^"]*)?"/g, 'href="$1.html$2"');

    // Write the updated file to the root directory
    fs.writeFileSync(destPath, content);
    console.log(`Processed and moved: ${file} -> ${destPath}`);
});

// Remove the temporary dist directory
fs.rm(outputDirectory, { recursive: true, force: true }, (err) => {
    if (err) {
        console.error(`Error removing directory: ${err.message}`);
    } else {
        console.log('Cleanup completed. All files are now in the root directory with .html extension.');
    }
});
