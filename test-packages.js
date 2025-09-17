#!/usr/bin/env node

/**
 * Script veloce per testare che tutti i pacchetti Suggesto siano pubblicati correttamente
 *
 * Utilizzo:
 * node test-packages.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Suggesto NPM Packages...\n');

const packages = ['@suggesto/core', '@suggesto/react', '@suggesto/vue', '@suggesto/nuxt'];

async function testPackage(packageName) {
  try {
    console.log(`📦 Testing ${packageName}...`);

    // Test 1: Check if package exists on NPM
    console.log(`  ↳ Checking NPM registry...`);
    execSync(`npm view ${packageName} version`, { stdio: 'pipe' });
    console.log(`  ✅ Found on NPM registry`);

    // Test 2: Try to install in a temp directory
    const tempDir = `/tmp/test-${packageName.replace('@', '').replace('/', '-')}`;

    if (fs.existsSync(tempDir)) {
      execSync(`rm -rf ${tempDir}`);
    }

    console.log(`  ↳ Testing installation...`);
    execSync(`mkdir -p ${tempDir}`);
    execSync(`cd ${tempDir} && npm init -y`, { stdio: 'pipe' });
    execSync(`cd ${tempDir} && npm install ${packageName}`, { stdio: 'pipe' });
    console.log(`  ✅ Installation successful`);

    // Test 3: Check if main files exist
    const packageJsonPath = path.join(tempDir, 'node_modules', packageName, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const mainFile = path.join(tempDir, 'node_modules', packageName, pkg.main || 'index.js');
      const moduleFile = path.join(tempDir, 'node_modules', packageName, pkg.module || 'index.mjs');

      if (fs.existsSync(mainFile)) {
        console.log(`  ✅ Main file exists: ${pkg.main}`);
      }

      if (fs.existsSync(moduleFile)) {
        console.log(`  ✅ Module file exists: ${pkg.module}`);
      }

      if (pkg.types) {
        const typesFile = path.join(tempDir, 'node_modules', packageName, pkg.types);
        if (fs.existsSync(typesFile)) {
          console.log(`  ✅ Type definitions exist: ${pkg.types}`);
        }
      }
    }

    // Cleanup
    execSync(`rm -rf ${tempDir}`);

    console.log(`  ✅ ${packageName} - ALL TESTS PASSED\n`);
    return true;
  } catch (error) {
    console.error(`  ❌ ${packageName} - FAILED:`);
    console.error(`     ${error.message}\n`);
    return false;
  }
}

async function runTests() {
  console.log('Starting package validation tests...\n');

  let allPassed = true;

  for (const packageName of packages) {
    const passed = await testPackage(packageName);
    if (!passed) allPassed = false;
  }

  console.log('='.repeat(50));
  if (allPassed) {
    console.log('🎉 ALL PACKAGES PASSED! Your NPM packages are working correctly!');
    console.log('\nNext steps:');
    console.log('1. Check your packages on https://www.npmjs.com');
    console.log('2. Create example projects to test real usage');
    console.log('3. Share your packages with the community!');
  } else {
    console.log('❌ SOME TESTS FAILED. Please check the errors above.');
    console.log('\nTroubleshooting:');
    console.log('1. Make sure all packages are published');
    console.log('2. Check package.json files for correct main/module/types fields');
    console.log('3. Verify build output in dist/ folders');
    process.exit(1);
  }
}

runTests().catch(console.error);
