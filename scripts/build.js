const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function cleanDist() {
  const distPath = path.resolve(__dirname, '../dist');

  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true });
  }
}

function buildTypescript() {
  console.log('Building TypeScript project...');
  try {
    // Use custom tsconfig path
    execSync('tsc -p ./config/tsconfig.json', { stdio: 'inherit' });
    console.log('TypeScript build completed successfully.');
  } catch (error) {
    console.error('TypeScript build failed:', error);
    process.exit(1);
  }
}

function copyAdditionalFiles() {
  const files = ['README.md', 'LICENSE', 'package.json'];

  const distPath = path.resolve(__dirname, '../dist');

  // Ensure dist directory exists
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath);
  }

  files.forEach((file) => {
    const sourcePath = path.resolve(__dirname, `../${file}`);
    const destPath = path.resolve(distPath, file);

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied ${file} to dist directory`);
    }
  });
}

function preparePackageJson() {
  const packageJsonPath = path.resolve(__dirname, '../dist/package.json');

  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Clean up unnecessary dev dependencies and scripts
    delete packageJson.devDependencies;
    delete packageJson.scripts;

    // Ensure main points to the correct file
    packageJson.main = './index.js';
    packageJson.types = './index.d.ts';

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('Package.json prepared for publication');
  }
}

function main() {
  console.log('Starting build process...');

  // Clean the dist directory
  cleanDist();

  // Build with TypeScript
  buildTypescript();

  // Copy additional files
  copyAdditionalFiles();

  // Prepare package.json for npm
  preparePackageJson();

  console.log('Build process completed successfully.');
}

main();
