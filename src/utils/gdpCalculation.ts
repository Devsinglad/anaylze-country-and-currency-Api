export function calculateEstimatedGDP(
    population: number,
    exchangeRate: number | null
): number | null {
    // If exchange rate is null, 0, or invalid, return null
    if (!exchangeRate || exchangeRate === 0) {
        return null;
    }

    // Validate population is positive
    if (population <= 0) {
        return null;
    }

    // Generate random number between 1000 and 2000 (inclusive)
    const randomValue = Math.random() * (2000 - 1000) + 1000;

    // Apply the exact formula: population × random(1000–2000) ÷ exchange_rate
    const estimatedGDP = population * randomValue / exchangeRate;

    return estimatedGDP;
}