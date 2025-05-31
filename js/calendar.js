$(document).ready(function () {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const now = new Date();
  let selectedMonth = now.getMonth();
  let selectedYear = now.getFullYear();

  const $calendar = $("#calendar");
  const $monthSelect = $("#monthSelect");
  const $yearSelect = $("#yearSelect");

  for (let i = 0; i < 12; i++) {
    $monthSelect.append(`<option value="${i}">${monthNames[i]}</option>`);
  }

  for (let y = 1990; y <= 2100; y++) {
    $yearSelect.append(`<option value="${y}">${y}</option>`);
  }

  $monthSelect.val(selectedMonth);
  $yearSelect.val(selectedYear);

  $monthSelect.on("change", function () {
    selectedMonth = parseInt($(this).val());
    generateCalendar();
  });

  $yearSelect.on("change", function () {
    selectedYear = parseInt($(this).val());
    generateCalendar();
  });

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  function generateCalendar() {
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    $calendar.empty();

    for (let i = 0; i < firstDay; i++) {
      $calendar.append(`<div></div>`);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      $calendar.append(`<div class="day" data-date="${dateStr}">${d}</div>`);
    }
  }

  $(document).on("click", ".day", function () {
    selectedDate = $(this).data("date");
    $("#date").val(selectedDate);
    $("#desc").val("");
    $("#amount").val("");
    $("#type").val("in");

    $("#selectedDateTitle").text(`Entries for ${formatDate(selectedDate)}`);
    $("#entryModal, #modalOverlay").show();
    showEntries();
  });

  $("#closeModalBtn, #modalOverlay").on("click", function () {
    $("#entryModal, #modalOverlay").hide();
  });

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

  $(document).on("click", ".delete-btn", function () {
    const id = $(this).data("id");
    deleteEntry(id);
  });

  $("#logoutBtn").on("click", logout);

  // Initial load
      generateCalendar();
      getEntry();
});
