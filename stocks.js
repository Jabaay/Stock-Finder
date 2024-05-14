url = "https://api.polygon.io/v3/reference/exchanges?asset_class=stocks&apiKey=I_nqL84e5GI4JU4ZuQ41OTwENV4t0hbP";

$(document).ready(function() {
    // Retrieve data from localStorage on another page
    var dropdown1 = $(".dropdown1");
    var dropdown2 = $(".dropdown2");
    var news = $(".news");
    var volume = $(".volume");
    var logoutButton = $(".logout");
    var mic;
    dropdown2.hide();
    news.hide();
    $(".newsTitle").hide();
    volume.hide();
    getMarkets();
    // getTickersForFavorites();

    // Allows the button with the class favorites to be clicked and the favorite to be added.
    $(".favorites").click(function() {
        addToFavorites();

    });

        // This allows the logoutfunction to occur.
        logoutButton.click(function() {
        var username = localStorage.getItem('username');
        var session = localStorage.getItem('session');
        var url = "http://172.17.12.56/final.php/logout?username="+username+"&session="+session+"";

        localStorage.removeItem('username');

        a = $.ajax({
            url: url,
            method: "GET"
        }).done(function(data) {
            // do nothing.
        }).fail(function(error) {
            alert("Failed to logout")
        });
    });

    $(".showFavorites").click(function() {
        $(".favoritesTable").empty();
        getTickersForFavorites();
    });
    //$(".favorites").click(addToFavorites);
    //$(".favorites").click(".favoritesTable".empty());
    //$(".favorites").click(getFavoritesData);

    // This will get all of the markets that a user can choose from.
    function getMarkets() {

        // Construct the URL with variables
        var url = "https://api.polygon.io/v3/reference/exchanges?asset_class=stocks&apiKey=I_nqL84e5GI4JU4ZuQ41OTwENV4t0hbP";

        a = $.ajax({
            url: url,
            method: "GET"
        }).done(function(data) {
            var selectElement = $(".dropdown1");
            // I need to filter out all reults that do not start with n because for some reason they do not return any stocks...
            for (let i=0; i<data.results.length; i++) {
                if (data.results[i].type == "exchange" && data.results[i].name[0] == "N") {
                    var options = $("<option>");
                    options.attr("value", data.results[i].operating_mic);
                    options.text(data.results[i].name);
                    selectElement.append(options);
                }
            }
        }).fail(function(error) {
            alert("Failed to get stock market data.")
        });
    }

    // Whenever the market changes so will the data held in the second menu.
    dropdown1.change(function() {
        dropdown2.empty();
        mic = dropdown1.val();
        var selectedMarket = dropdown1.find("option:selected").text();

        dropdown2.find("option:first").text("Stocks in: " + selectedMarket);
        dropdown2.show();
        showStocks();
    });

     // This will call all stocks (up to 1000) that are in the selected markets.
    function showStocks() {
        var url = "https://api.polygon.io/v3/reference/tickers?exchange=" +mic+ "&active=true&limit=1000&apiKey=I_nqL84e5GI4JU4ZuQ41OTwENV4t0hbP";

        a = $.ajax({
            url: url,
            method: "GET"
        }).done(function(data) {
            for (let i=0; i<data.results.length; i++) {
                var options = $("<option>");
                options.attr("value", data.results[i].ticker);
                options.text(data.results[i].name +" | "+ data.results[i].ticker);
                dropdown2.append(options);
            }
            news.empty();
            getNews();
            volume.empty();
            // getFavoritesData();
        }).fail(function(error) {
            alert("You have exceded your requests per minute");
        });
    }

    // Whenever the dropdown menu holding stocks changes so will the news, and volume.
    dropdown2.change(function() {
        news.empty();
        getNews();
        getChart(dropdown2.val());
        volume.empty();
        // getFavoritesData();
    });

    // These will get the news for the selected stock.
    function getNews() {
        news.show();
        $(".newsTitle").show();
        var ticker = dropdown2.val();

        var url = "https://api.polygon.io/v2/reference/news?ticker=" +ticker+ "&apiKey=I_nqL84e5GI4JU4ZuQ41OTwENV4t0hbP"

        a = $.ajax({
            url: url,
            method: "GET"
        }).done(function(data) {
            for (let i=0; i<5; i++) {
                var li = $("<li>");
                var anchor = $("<a>");
                anchor.attr("href", data.results[i].article_url);
                anchor.attr("target", "_blank");
                anchor.text(data.results[i].title + " Description: " + data.results[i].description);
                li.append(anchor);
                news.append(li);
            }
        }).fail(function(error) {
            alert("You have exceded your requests per minute");
        });

    }

    // Get 5-day stock data and the chart
    function getChart(ticker) {
        var endDate = new Date();
        var startDate = new Date(endDate); 
        startDate.setDate(endDate.getDate() - 5);
        var startDateStr = formatDate(startDate);
        var endDateStr = formatDate(endDate);
        var apiUrl = "https://api.polygon.io/v2/aggs/ticker/" + ticker + "/range/1/day/" + startDateStr + "/" + endDateStr + "?adjusted=true&sort=asc&limit=5&apiKey=I_nqL84e5GI4JU4ZuQ41OTwENV4t0hbP";
        $.ajax({
            url: apiUrl,
            method: "GET",
            success: function(response) {
                var dates = [];
                var prices = [];
                for (var i = 0; i < response.results.length; i++) {
                    var date = new Date(response.results[i].t);
                    dates.push(formatDate(date));
                    prices.push(response.results[i].c);
                }
                renderChart(dates, prices);
            },
            error: function(xhr, status, error) {
                console.error("Error fetching stock data:", error);
            }
        });
    }
    
    // Date in YYYY-MM-DD format
    function formatDate(date) {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2, "0");
        var day = date.getDate().toString().padStart(2, "0");
        return year + "-" + month + "-" + day;
    }

    // Use Chart.js to render the chart
    function renderChart(dates, prices) {
        var ctx = document.getElementById('stockChart').getContext('2d');
        var stockChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: '5-Day Stock Price',
                    data: prices,
                    borderColor: 'blue',
                    backgroundColor: 'black',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });
    }

  /* NOTE THE VOLUME OF THE STOCKS MUST BE FROM A YEAR AGO TODAY. WHY YOU ASK, BECAUSE MORE RECENT DATA IS CONSIDERED PRIVLAGED AND YOU HAVE TO PAY FOR IT. */
    function getFavoritesData(index, ticker, name) {
        volume.show();

        var currentDate = new Date();
        var oneYearAgo = new Date(currentDate.getFullYear() - 1, currentDate.getMonth()-2, currentDate.getDate()-1);

        var formattedDate = oneYearAgo.toISOString().split('T')[0];

        var url = "https://api.polygon.io/v2/aggs/ticker/"+ticker+"/range/1/day/"+formattedDate+"/"+formattedDate+"?adjusted=true&sort=asc&limit=120&apiKey=I_nqL84e5GI4JU4ZuQ41OTwENV4t0hbP";

        a = $.ajax ({
            url: url,
            method: "GET"
        }).done(function(data) {
            addRowToTable(index, ticker, name, data.results[0].o, data.results[0].h, data.results[0].l, data.results[0].c, ((data.results[0].c - data.results[0].o)/data.results[0].o) * 100, data.results[0].v)
        }).fail(function(error) {
            alert("Exceded max requests (getFavoritesData)");
        });

    }

    function addToFavorites() {
        var ticker = dropdown2.val();
        var name = $(".dropdown2 option:selected").text().split('|')[0].trim();
        var currentDate = new Date();
        var oneYearAgo = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

        var formattedDate = oneYearAgo.toISOString().split('T')[0];


        // These need to be different. They are generic and need to be stored for every user that is currently signed in.
        var username = localStorage.getItem('username');
        console.log("Username for addToFavorites: " + username);
        var session = localStorage.getItem('session');
        console.log(localStorage.getItem('session'));

        // Figure out how to grab the usrname and session and store the data here. This might jsut be another PHP call.

        var url = "http://172.17.12.56/final.php/addToFavorites?username=" +username+ "&session=" +session+ "&ticker=" +ticker+ "&time=" +formattedDate + "&name=" + name;

        a = $.ajax ({
            url: url,
            method: "GET"
        }).done(function(data) {
            if (data.status != 0) {
                alert(data.message);
            }
        }).fail(function(error) {
            alert(error.message);
        });

    }


    function getTickersForFavorites() {
        var username = localStorage.getItem('username');
        console.log("Username for getTickersForFavorites " +username);
        var url = "http://172.17.12.56/final.php/getFavorites?username="+username+"";

        a = $.ajax ({
            url: url,
            method: "GET"
        }).done(function(data) {
            for(var i=0; i < data.results.length; i++) {
                getFavoritesData(i+1, data.results[i].ticker, data.results[i].name);
                console.log(data.results[i].ticker);
            }
        }).fail(function(error) {
            alert("ahh");
        });
    }

    function addRowToTable(index, ticker, name, lastOpen, high, low, lastClose, difference, volume) {
        var tableBody = $(".favoritesTable"); // Assuming there is only one table body with class "favoritesTable"

        var newRow = $("<tr>");
        newRow.append("<th scope='row'>" + ticker + "</th>");
        // newRow.append("<td>" + ticker + "</td>");
        newRow.append("<td>" + name + "</td>");
        newRow.append("<td>" + lastOpen + "</td>");
        newRow.append("<td>" + high + "</td>");
        newRow.append("<td>" + low + "</td>");
         newRow.append("<td>" + lastClose + "</td>");
        var differenceCell = $("<td></td>").text(difference.toFixed(2));
        if (difference < 0) {
            differenceCell.css("color", "red");
        } else {
            differenceCell.css("color", "green");
        }
        newRow.append(differenceCell);
        newRow.append("<td>" + volume + "</td>");

        tableBody.append(newRow);
    }


    /*window.onbeforeunload = function() {
        localStorage.removeItem('username');
    };*/

});
