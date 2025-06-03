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
				date: entry.date,
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
              <button class="edit-btn" data-id="${e.id}">Edit</button>
              <button class="delete-btn" data-id="${e.id}">Delete</button>
            </li>`;
	});

	$("#entryList").html(
		items.join("") +
			`<li style="margin-top:10px; font-weight:bold;">Total: ₱${total.toFixed(
				2
			)}</li>`
	);

	generateCalendar();
}

function filterEntriesByMonthYear(month, year) {
	const allEntries = Object.values(financeData).flat();
	return allEntries.filter((entry) => {
		const entryDate = new Date(entry.date);
		return (
			entryDate.getMonth() === month && entryDate.getFullYear() === year
		);
	});
}

function updateOverview(selectedMonth, selectedYear) {
	const allEntries = Object.values(financeData).flat();

	let overallIn = 0,
		overallOut = 0;
	allEntries.forEach((e) => {
		if (e.type === "in") overallIn += e.amount;
		else if (e.type === "out") overallOut += e.amount;
	});

	const monthlyEntries = filterEntriesByMonthYear(
		selectedMonth,
		selectedYear
	);

	let monthlyIn = 0,
		monthlyOut = 0;
	monthlyEntries.forEach((e) => {
		if (e.type === "in") monthlyIn += e.amount;
		else if (e.type === "out") monthlyOut += e.amount;
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

$(document).on("click", "#closeUpdateModalBtn", function() {
  $("#updateModal").hide();
  $("entryModal, #modalOveraly").show();
});

$(document).on("click", "#update-action", async function(e) {
  e.preventDefault();

  const id = $("#updateId").val();
  const desc = $("#updateDesc").val();
  const amount = parseFloat($("#updateAmount").val());
  const type = $("#updateType").val();

  let toastMessage = "";

  if (!desc || isNaN(amount) || !type) {
    showToast("Please fill in all fields.");
    return;
  }
  
  try {
    const response = await fetch("api/update_entry.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
        desc: desc,
        amount: amount,
        type: type,
      }),
    }); 
  
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const responseData = await response.json();
    if (!responseData.success) {
      console.log("Failed to update entry:", responseData.message);
      toastMessage = "No changes made.";
    } else {
      toastMessage = "Entry updated successfully!";
    }
  
  } catch (error) {
    console.error("Error updating entry:", error);
    showToast("Failed to update entry.");
    return;
  }

  showToast(toastMessage);
  $("#updateModal").hide();
  await getEntry();
  showEntries();
});

$(document).on("click", ".edit-btn", function () {
	const entryId = $(this).data("id");
	const entry = financeData[selectedDate].find((e) => e.id === entryId);
	if (!entry) {
		showToast("Entry not found.");
		return;
	}

  $("#updateId").val(entryId);
	$("#updateDesc").val(entry.desc);
	$("#updateAmount").val(entry.amount);
	$("#updateType").val(entry.type);

	$("#entryModal, #modalOverlay").hide();
	$("#updateModal").show();
});

$(document).ready(function () {
    $.get('php/user.php', function (response) {
        const data = JSON.parse(response);
        if (data.user !== null) {
            $('#user-label').text(data.user);
        } else {
            console.warn('User not found in session');
        }
    });
});