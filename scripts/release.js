const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');

function updateVersion(releaseType) {
  console.log(`Preparing ${releaseType} release...`);

  try {
    execSync(`npm version ${releaseType}`, { stdio: 'inherit' });
    console.log('Version updated successfully.');
  } catch (error) {
    console.error('Failed to update version:', error);
    process.exit(1);
  }
}

// test is not applicable for this project at a momentS
// function runTests() {
//   console.log("Running tests before release...");
//   try {
//     execSync("npm test", { stdio: "inherit" });
//     console.log("All tests passed.");
//   } catch (error) {
//     console.error("Tests failed. Release aborted.");
//     process.exit(1);
//   }
// }

function buildProject() {
  console.log('Building project...');
  try {
    execSync('tsc -p ./config/tsconfig.json', { stdio: 'inherit' });
    console.log('Build completed successfully.');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

function publishToNpm() {
  console.log('Publishing to npm...');
  try {
    execSync('npm publish', {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '../dist'),
    });
    console.log(`Published version ${packageJson.version} to npm.`);
  } catch (error) {
    console.error('NPM publish failed:', error);
    process.exit(1);
  }
}

function main() {
  const releaseType = process.argv[2] || 'patch';
  const validReleaseTypes = [
    'major',
    'minor',
    'patch',
    'premajor',
    'preminor',
    'prepatch',
    'prerelease',
  ];

  if (!validReleaseTypes.includes(releaseType)) {
    console.error(`Invalid release type. Use one of: ${validReleaseTypes.join(', ')}`);
    process.exit(1);
  }

  // Run tests first
  //   runTests();

  // Update version
  updateVersion(releaseType);

  // Build project
  buildProject();

  // Publish to npm
  publishToNpm();

  console.log('Release process completed successfully.');
}

main();
