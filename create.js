$(document).ready(function() {
    $("#newAcc").click(createAccount)

    function createAccount() {
        var name = $("#name").val();
        var username = $("#username").val();
        var password = $("#password").val();

        var url = "http://172.17.12.56/final.php/signUp?name=" +name+ "&username=" +username+ "&password=" +password;
        a = $.ajax({
            url: url,
            method: "GET"
        }).done(function(data) {
            console.log(data);
            if(data.status == 0) {
                alert(data.message);
                window.location.href = "login.html";
            } else {
                alert(data.message);
            }
        }).fail(function(error) {
            alert("Everything failed")
        });
    }

});
