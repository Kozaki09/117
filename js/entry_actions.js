let selectedDate = "";

async function getEntry() {
  try {
    const response = await fetch("api/get_entry.php", {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    financeData = {};

    data.forEach((entry) => {
      if (!financeData[entry.date]) {
        financeData[entry.date] = [];
      }
      financeData[entry.date].push({
        id: entry.id,
        type: entry.type,
        desc: entry.description,
        amount: parseFloat(entry.amount),
        date: entry.date
      });
    });

    const now = new Date();
    let selectedMonth = now.getMonth();
    let selectedYear = now.getFullYear();

    updateOverview(selectedMonth, selectedYear); 
  } catch (error) {
    console.error("Failed to load entries:", error);
  }
}

async function addEntry(date, desc, amount, type) {
  try {
    desc = desc.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const response = await fetch("api/add_entry.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, desc, amount, type }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    showToast("Entry added!");
    await getEntry();
    showEntries();
  } catch (error) {
    console.error("Error adding entry:", error);
    showToast("Failed to add entry. Try again.");
  }
}

async function deleteEntry(entryId) {
  try {
    const response = await fetch("api/del_entry.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id: entryId }),
    });

    const result = await response.json();

    if (result.success) {
      showToast("Entry deleted.");
    } else {
      showToast("Failed to delete entry.");
    }
  } catch (error) {
    console.error("Error deleting entry:", error);
    showToast("Error deleting entry.");
  }

  await getEntry();
  showEntries();
}

function showEntries() {
  const entries = financeData[selectedDate] || [];
  let total = 0;

  const items = entries.map((e) => {
    const color = e.type === "out" ? "red" : "green";
    const signedAmount = e.type === "out" ? -e.amount : e.amount;
    total += signedAmount;

    return `<li style="color:${color}">
              ${e.desc} (${e.type.toUpperCase()}) - ₱${e.amount}
              <button class="delete-btn" data-id="${e.id}">Delete</button>
            </li>`;
  });

  $("#entryList").html(items.join("") + `<li style="margin-top:10px; font-weight:bold;">Total: ₱${total.toFixed(2)}</li>`);
}

function filterEntriesByMonthYear(month, year) {
  const allEntries = Object.values(financeData).flat();
  return allEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate.getMonth() === month && entryDate.getFullYear() === year;
  });
}

function updateOverview(selectedMonth, selectedYear) {
  const allEntries = Object.values(financeData).flat();

  let overallIn = 0, overallOut = 0;
  allEntries.forEach(e => {
    if (e.type === 'in') overallIn += e.amount;
    else if (e.type === 'out') overallOut += e.amount;
  });

  const monthlyEntries = filterEntriesByMonthYear(selectedMonth, selectedYear);

  let monthlyIn = 0, monthlyOut = 0;
  monthlyEntries.forEach(e => {
    if (e.type === 'in') monthlyIn += e.amount;
    else if (e.type === 'out') monthlyOut += e.amount;
  });

  // Update DOM elements
  $("#overall-in").text(`₱${overallIn.toFixed(2)}`);
  $("#overall-out").text(`₱${overallOut.toFixed(2)}`);
  $("#overall-spending").text(`₱${(overallOut - overallIn).toFixed(2)}`);
  $("#overall-savings").text(`₱${(overallIn - overallOut).toFixed(2)}`);

  $("#monthly-in").text(`₱${monthlyIn.toFixed(2)}`);
  $("#monthly-out").text(`₱${monthlyOut.toFixed(2)}`);
  $("#monthly-spending").text(`₱${(monthlyOut - monthlyIn).toFixed(2)}`);
  $("#monthly-savings").text(`₱${(monthlyIn - monthlyOut).toFixed(2)}`);
}
