import extractHeartRate from './extractHeartRate.js';

/**
 * Test runner for extractHeartRate function
 */

// ANSI color codes for better terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

function printHeader(text) {
    console.log(`\n${colors.cyan}${colors.bold}${text}${colors.reset}`);
    console.log("=".repeat(60));
}

function printTestResult(passed) {
    const icon = passed ? "✅" : "❌";
    const status = passed ? `${colors.green}PASSED${colors.reset}` : `${colors.red}FAILED${colors.reset}`;
    return `${icon} ${status}`;
}

// Main test case from requirements
printHeader("MAIN TEST CASE (From Requirements)");

const input = "LOG_01: HeartRate=72bpm; STATUS=OK | LOG_02: HeartRate= 85 ; STATUS=WARN | LOG_03: HeartRate=error; STATUS=FAIL";
const expected = [72, 85];

console.log(`${colors.yellow}Input:${colors.reset}`);
console.log(input);
console.log(`\n${colors.yellow}Expected Output:${colors.reset}`);
console.log(expected);

const result = extractHeartRate(input);
console.log(`\n${colors.yellow}Actual Output:${colors.reset}`);
console.log(result);

const isCorrect = JSON.stringify(result) === JSON.stringify(expected);
console.log(`\n${colors.bold}Test Result: ${printTestResult(isCorrect)}${colors.reset}`);

// Additional comprehensive test cases
printHeader("ADDITIONAL TEST CASES");

const testCases = [
    {
        name: "Empty string",
        input: "",
        expected: [],
        description: "Should return empty array for empty input"
    },
    {
        name: "No valid numbers",
        input: "HeartRate=error; HeartRate=N/A",
        expected: [],
        description: "Should filter out non-numeric values"
    },
    {
        name: "Multiple valid values",
        input: "HeartRate=60; HeartRate=75; HeartRate=90",
        expected: [60, 75, 90],
        description: "Should extract all valid numeric values"
    },
    {
        name: "Decimal values",
        input: "HeartRate=72.5bpm; HeartRate=85.3",
        expected: [72.5, 85.3],
        description: "Should handle decimal numbers"
    },
    {
        name: "Mixed spacing",
        input: "HeartRate=100;HeartRate = 120 ;HeartRate= 140",
        expected: [100, 120, 140],
        description: "Should handle various spacing patterns"
    },
    {
        name: "Invalid negative numbers",
        input: "HeartRate=-10; HeartRate=80",
        expected: [80],
        description: "Should filter out negative values (physiologically impossible)"
    },
    {
        name: "Invalid zero value",
        input: "HeartRate=0; HeartRate=60",
        expected: [60],
        description: "Should filter out zero (not a valid heart rate)"
    },
    {
        name: "Boundary values - minimum",
        input: "HeartRate=29; HeartRate=30; HeartRate=31",
        expected: [30, 31],
        description: "Should accept values >= 30 bpm (minimum realistic)"
    },
    {
        name: "Boundary values - maximum",
        input: "HeartRate=249; HeartRate=250; HeartRate=251",
        expected: [249, 250],
        description: "Should accept values <= 250 bpm (maximum realistic)"
    },
    {
        name: "Unrealistically large numbers",
        input: "HeartRate=999; HeartRate=100",
        expected: [100],
        description: "Should filter out unrealistically high values (likely errors)"
    },
    {
        name: "Mixed valid and invalid",
        input: "HeartRate=65; HeartRate=invalid; HeartRate=78; HeartRate=N/A; HeartRate=82",
        expected: [65, 78, 82],
        description: "Should extract only valid numbers from mixed input"
    }
];

let passedCount = 0;
let failedCount = 0;

testCases.forEach(({ name, input, expected, description }, index) => {
    const result = extractHeartRate(input);
    const passed = JSON.stringify(result) === JSON.stringify(expected);

    if (passed) passedCount++;
    else failedCount++;

    console.log(`\n${colors.bold}Test ${index + 1}: ${name}${colors.reset}`);
    console.log(`  ${colors.yellow}Description:${colors.reset} ${description}`);
    console.log(`  ${colors.yellow}Input:${colors.reset} "${input}"`);
    console.log(`  ${colors.yellow}Expected:${colors.reset} [${expected.join(', ')}]`);
    console.log(`  ${colors.yellow}Got:${colors.reset} [${result.join(', ')}]`);
    console.log(`  ${printTestResult(passed)}`);
});

// Error handling test
printHeader("ERROR HANDLING TESTS");

console.log(`\n${colors.bold}Test: Invalid input type (null)${colors.reset}`);
try {
    extractHeartRate(null);
    console.log(`  ${printTestResult(false)} - Should have thrown TypeError`);
    failedCount++;
} catch (error) {
    if (error instanceof TypeError) {
        console.log(`  ${printTestResult(true)} - Correctly threw TypeError`);
        passedCount++;
    } else {
        console.log(`  ${printTestResult(false)} - Wrong error type: ${error.constructor.name}`);
        failedCount++;
    }
}

console.log(`\n${colors.bold}Test: Invalid input type (number)${colors.reset}`);
try {
    extractHeartRate(123);
    console.log(`  ${printTestResult(false)} - Should have thrown TypeError`);
    failedCount++;
} catch (error) {
    if (error instanceof TypeError) {
        console.log(`  ${printTestResult(true)} - Correctly threw TypeError`);
        passedCount++;
    } else {
        console.log(`  ${printTestResult(false)} - Wrong error type: ${error.constructor.name}`);
        failedCount++;
    }
}

// Summary
printHeader("TEST SUMMARY");
const totalTests = passedCount + failedCount;
const successRate = ((passedCount / totalTests) * 100).toFixed(1);

console.log(`\nTotal Tests: ${colors.bold}${totalTests}${colors.reset}`);
console.log(`Passed: ${colors.green}${passedCount}${colors.reset}`);
console.log(`Failed: ${failedCount > 0 ? colors.red : colors.green}${failedCount}${colors.reset}`);
console.log(`Success Rate: ${colors.bold}${successRate}%${colors.reset}`);

if (failedCount === 0) {
    console.log(`\n${colors.green}${colors.bold}🎉 All tests passed!${colors.reset}\n`);
    process.exit(0);
} else {
    console.log(`\n${colors.red}${colors.bold}❌ Some tests failed${colors.reset}\n`);
    process.exit(1);
}
