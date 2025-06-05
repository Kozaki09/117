// Object to store user's finance data (e.g., spendings)
let financeData = {};

let selectedMonth = new Date().getMonth();  // 0 = January, 11 = December
let selectedYear = new Date().getFullYear();    // e.g., 2025

// For debugging current month
// console.log("test:", selectedMonth);