async function getEntry() {
  const response = await fetch('api/get_entry.php', {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('HTTP error! Status: ${response.status}');
  }

  const data = await response.json();

  financeData = {};

  data.forEach(entry => {
    const date = entry.date;
    if (!financeData[date]) {
      financeData[date] = [];
    }
    financeData[date].push({
      id: entry.id,
      type: entry.type,
      desc: entry.description,
      amount: parseFloat(entry.amount)
    });
  });

  console.log(financeData);
}

async function addEntry() {
  const amount = parseFloat(document.getElementById("amount").value);
  const desc = document.getElementById('desc').value.trim();
  const type = document.getElementById('type').value;
  const date = document.getElementById('date').value;

  if (!desc || isNaN(amount)) {
    showToast("Please enter valid description and amount.");
    return;
  }
  try {
    const response = await fetch("api/add_entry.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date, desc, amount, type }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    showToast("Entry added!");
    document.getElementById("desc").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("type").value = "in";

    await getEntry();
    showEntries();
    } catch (error) {
    console.error("Error adding entry:", error);
    showToast("Failed to add entry. Try again.");
    }
}

async function deleteEntry(entryId, date) {
  try {
    const response = await fetch('api/del_entry.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ id: entryId })
    });

    const result = await response.json();


    if (result.success) {
      showEntries();
      showToast("Entry Deleted.");
    } else {
      showToast("Failed to delete entry.");
    }
  }  catch (error) {
    console.error("Error deleting entry:", error);
    showToast("Error deleting entry.");
  }

  await getEntry();
  showEntries();
}

function showEntries() {
  const entries = financeData[selectedDate] || [];
  let total = 0;

  entryList.innerHTML = entries.map((e, i) => {
    const color = e.type === "out" ? "red" : "green";
    const signedAmount = e.type === "out" ? -e.amount : e.amount;
    total += signedAmount;

    return `<li style="color:${color}">${e.desc} (${e.type === "in" ? "IN" : "OUT"}) - ₱${e.amount}
      <button onclick="deleteEntry(${e.id}, '${date}')">Delete</button></li>`;

  }).join("");

  entryList.innerHTML += `<li style="margin-top:10px; font-weight:bold;">Total: ₱${total.toFixed(2)}</li>`;
}
