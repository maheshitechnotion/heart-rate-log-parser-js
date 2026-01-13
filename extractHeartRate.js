/**
 * Extracts HeartRate values as numbers from a log string.
 * 
 * This function parses log entries containing HeartRate measurements and extracts
 * only the valid numeric values, filtering out any non-numeric entries (e.g., "error", "N/A").
 * 
 * @param {string} logString - The input log string containing HeartRate entries
 * @returns {number[]} - Array of HeartRate values as numbers
 * 
 * @example
 * const input = "LOG_01: HeartRate=72bpm; STATUS=OK | LOG_02: HeartRate= 85 ; STATUS=WARN | LOG_03: HeartRate=error; STATUS=FAIL";
 * const result = extractHeartRate(input);
 * console.log(result); // [72, 85]
 * 
 * @example
 * // Handles various formats
 * extractHeartRate("HeartRate=60; HeartRate=75.5bpm"); // [60, 75.5]
 * extractHeartRate("HeartRate=error"); // []
 * extractHeartRate(""); // []
 */
function extractHeartRate(logString) {
  // Input validation
  if (typeof logString !== 'string') {
    throw new TypeError('Input must be a string');
  }

  const heartRates = [];

  // Regular expression to match HeartRate=<value> pattern
  // Captures the value after HeartRate= (with optional spaces)
  // Pattern breakdown:
  // - HeartRate\s*=\s* : Matches "HeartRate" followed by optional spaces, "=", and optional spaces
  // - ([^\s;|]+) : Captures one or more characters that are not whitespace, semicolon, or pipe
  const regex = /HeartRate\s*=\s*([^\s;|]+)/g;

  // Realistic heart rate range for humans (in bpm)
  // Minimum: ~30 bpm (deep sleep, highly trained athletes)
  // Maximum: ~250 bpm (extreme exercise, medical conditions)
  const MIN_HEART_RATE = 30;
  const MAX_HEART_RATE = 250;

  let match;
  while ((match = regex.exec(logString)) !== null) {
    const value = match[1];

    // Try to parse the value as a number
    // parseFloat handles cases like "72bpm" by extracting "72"
    const numericValue = parseFloat(value);

    // Validate the heart rate:
    // 1. Must be a valid number (not NaN or Infinity)
    // 2. Must be within realistic human heart rate range
    // This filters out:
    // - Non-numeric values like "error", "N/A"
    // - Negative numbers (physiologically impossible)
    // - Zero (not a valid heart rate)
    // - Unrealistically high values (likely errors)
    if (
      !isNaN(numericValue) &&
      isFinite(numericValue) &&
      numericValue >= MIN_HEART_RATE &&
      numericValue <= MAX_HEART_RATE
    ) {
      heartRates.push(numericValue);
    }
  }

  return heartRates;
}


export default extractHeartRate;

// CommonJS compatibility for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = extractHeartRate;
}
