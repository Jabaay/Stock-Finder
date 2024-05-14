document.getElementById('historyForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from being submitted normally

    // Get the form inputs
    var startDate = document.getElementById('startDate').value;
    var endDate = document.getElementById('endDate').value;
    var sortOrder = document.getElementById('sortOrder').value;

    // Fetch the history from localStorage
    var history = JSON.parse(localStorage.getItem('history')) || [];

    // Filter the history based on the start date, end date, and sort order
    var filteredHistory = filterHistory(history, startDate, endDate, sortOrder);

    // Format the history as required
    var formattedHistory = formatHistory(filteredHistory);

    // Display the formatted history in the 'historyContent' div
    document.getElementById('historyContent').innerHTML = formattedHistory;
});

function filterHistory(history, startDate, endDate, sortOrder) {
    // Convert the dates to timestamps for easier comparison
    var startTimestamp = new Date(startDate).getTime();
    var endTimestamp = new Date(endDate).getTime();

    // Filter the history based on the start date and end date
    var filteredHistory = history.filter(function(item) {
        var itemTimestamp = new Date(item.time).getTime();
        return itemTimestamp >= startTimestamp && itemTimestamp <= endTimestamp;
    });

    // Sort the filtered history based on the sort order
    filteredHistory.sort(function(a, b) {
        var aTimestamp = new Date(a.time).getTime();
        var bTimestamp = new Date(b.time).getTime();
        if (sortOrder === 'asc') {
            return aTimestamp - bTimestamp;
        } else { // sortOrder === 'desc'
            return bTimestamp - aTimestamp;
        }
    });

    return filteredHistory;
}

function formatHistory(history) {
    // Format the history as a list of strings
    var formattedHistory = history.map(function(item) {
        return item.time + ': ' + item.action + ' - ' + item.ticker + ' (' + item.name + ')';
    });

    // Join the list of strings into a single string with line breaks
    return formattedHistory.join('<br>');
}