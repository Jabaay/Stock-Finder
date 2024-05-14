$(document).ready(function() {
    $("#login").click(login)

    function login() {
        var username = $("#username").val();
        var password = $("#password").val();

        localStorage.setItem('username', username);

        // Construct the URL with variables
        var url = "http://172.17.12.56/final.php/login?username=" +username+ "&password=" + password;

        a = $.ajax({
            url: url,
            method: "GET"
        }).done(function(data) {
            console.log(data);
            if(data.status == 0) {
                localStorage.setItem('session', data.session);
                window.location.href = "index.html";
            } else {
                alert(data.message);
            }
        }).fail(function(error) {
            alert("Everything failed")
        });
    }
});
