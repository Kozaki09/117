$(document).ready(function() {
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

    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const $message = $('.error-message');

    if (status === 'login_failed') {
        $message.eq(0).text("Login Failed. Invalid Credentials.");
    } else if (status === 'username_exists') {
        $message.eq(1).text("Username Already Exists.");
    } else if (status === 'create_failed') {
        $message.eq(1).text("Create Failed. Something Went Wrong.");
    }
});