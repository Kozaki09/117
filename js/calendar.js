let financeData = {};   // Stores all spending entries grouped by date

$(document).ready(async function () {
    try {
        await getEntry();   // Load existing entries from server
    } catch (error) {
        console.error("Failed to load entries:", error);
    }
    const monthNames = [  // Month and year data
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const now = new Date();
    let selectedMonth = now.getMonth();
    let selectedYear = now.getFullYear();

    const $calendar = $("#calendar");
    const $monthSelect = $("#monthSelect");
    const $yearSelect = $("#yearSelect");

    for (let i = 0; i < 12; i++) {  // Populate month dropdown
        $monthSelect.append(`<option value="${i}">${monthNames[i]}</option>`);
    }

    for (let y = 1990; y <= 2100; y++) {  // Populate year dropdown
        $yearSelect.append(`<option value="${y}">${y}</option>`);
    }

    $monthSelect.val(selectedMonth);  // Set current month/year
    $yearSelect.val(selectedYear);

    // When month or year changes, update calendar and overview
    $monthSelect.on("change", function () {
        selectedMonth = parseInt($(this).val());
        generateCalendar();
        updateOverview(selectedMonth, selectedYear);
    }); 

    $yearSelect.on("change", function () {
        selectedYear = parseInt($(this).val());
        generateCalendar();
        updateOverview(selectedMonth, selectedYear);
    });

    function formatDate(dateStr) {  // Format date string for display
    const date = new Date(dateStr);
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  function generateCalendar() {  // Generate calendar grid for selected month/year
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    $calendar.empty();

    for (let i = 0; i < firstDay; i++) {  // Add empty slots before first day
      $calendar.append(`<div></div>`);
    }

    for (let d = 1; d <= daysInMonth; d++) { // Add each day of the month
      const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

      const hasEntry = financeData[dateStr] && financeData[dateStr].length > 0;
      const dayClass = hasEntry ? "day has-entry" : "day";
      $calendar.append(`<div class="${dayClass}" data-date="${dateStr}">${d}</div>`);
    }
  }

  window.generateCalendar = generateCalendar;     // Add days to calendar

  $(document).on("click", ".day", function () {   // Add days to calendar
    selectedDate = $(this).data("date");
    $("#date").val(selectedDate);
    $("#desc").val("");
    $("#amount").val("");
    $("#type").val("in");

    $("#selectedDateTitle").text(`Entries for ${formatDate(selectedDate)}`);
    $("#entryModal, #modalOverlay").show();
    showEntries();
  });

  // Close modal when clicking close button or overlay
  $("#closeModalBtn, #modalOverlay").on("click", function () {
    $("#entryModal, #modalOverlay").hide();
  });

  // Handle form submission for adding an entry
  $("#entryForm").on("submit", function (e) {
    e.preventDefault();
    const amount = parseFloat($("#amount").val());
    const desc = $("#desc").val().trim();
    const type = $("#type").val();

    if (!desc || isNaN(amount)) {
      showToast("Please enter valid description and amount.");
      return;
    }

    addEntry(selectedDate, desc, amount, type);
  });

  // Handle deleting entry
  $(document).on("click", ".delete-btn", function () {
    const id = $(this).data("id");
    deleteEntry(id);
  });

  $("#logoutBtn").on("click", logout);  // Handle logout

  // Initial load
      generateCalendar();
      getEntry();
});
