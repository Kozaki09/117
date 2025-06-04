$(document).ready(function () {
  // Toggle forms
  window.toggleForm = function () {
    const $login = $('#login');
    const $create = $('#create');

    if ($login.is(':visible')) {
        $login.fadeOut(300, function () {
            $create.fadeIn(300);
        });
    } else {
        $create.fadeOut(300, function () {
            $login.fadeIn(300);
        });
    }

};

  // Login form submission
  $('#loginForm').submit(function (e) {
    e.preventDefault();

    const data = {
      username: $('#loginForm input[name="username"]').val(),
      password: $('#loginForm input[name="password"]').val()
    };

    $.ajax({
      url: '/api/auth/login',
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function () {
        // Redirect on success
        window.location.href = '/index.html';
      },
      error: function (xhr) {
        $('#login-message').text('Login Failed. Invalid Credentials.');
      }
    });
  });

  // Create account form submission
  $('#createForm').submit(function (e) {
    e.preventDefault();

    const data = {
      username: $('#createForm input[name="username"]').val(),
      password: $('#createForm input[name="password"]').val()
    };

    $.ajax({
      url: 'api/auth/create',
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function () {
        // Redirect on success
        window.location.href = '/dashboard.html';
      },
      error: function (xhr) {
        // Check server response for specific errors if you want
        if (xhr.status === 409) { // conflict - username exists
          $('#create-message').text('Username Already Exists.');
        } else {
          $('#create-message').text('Create Failed. Something Went Wrong.');
        }
      }
    });
  });
});