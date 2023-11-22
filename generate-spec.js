const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to convert a string to camel case
function toCamelCase(str) {
  return str.replace(/[-_ ](.)/g, (_, c) => c.toUpperCase());
}

// Function to create a Playwright test file
function createTestFile(functionalityName, url, tests) {
  const camelCaseFileName = toCamelCase(functionalityName);
  const fileName = `./e2e/${camelCaseFileName}.spec.ts`;

  const content = `
import { expect, test } from "@playwright/test";
import { login } from "./support/utilities";

test.describe('${functionalityName}', () => {
  test.beforeEach("Test Setup", async ({ page }, testInfo) => {
    await login(page, testInfo);
    await page.goto("${url}");
  });

  ${tests
    .map(
      (testName) => `
    test("${testName}", async ({ page }) => {
      // ${testName} - Arrange

      // ${testName} - Act

      // ${testName} - Assert
      expect(X).toBeVisible()
    });
  `
    )
    .join("\n")}
});

`;

  fs.writeFileSync(fileName, content);

  console.log(`Test file created: ${fileName}`);
}

// Ask for functionality name
rl.question("Enter the name of the functionality: ", (functionalityName) => {
  // Ask for starting URL
  rl.question("Enter the starting URL: ", (url) => {
    // Ask for comma-separated test names
    rl.question("Enter comma-separated test names: ", (testNames) => {
      const tests = testNames
        .split(",")
        .map((testName) => testName.trim());
      createTestFile(functionalityName, url, tests);

      rl.close();
    });
  });
});
