var influx = require('influx');

var client = influx({
    host: 'localhost',
    port: 8086, // optional, default 8086 
    protocol: 'http', // optional, default 'http' 
    username: 'root',
    password: 'root',
    database: 'grafana'
});

console.log(client);

client.dropMeasurement('tickets', function () {
    year = 2015;
    totalTickets = 0;
    for (var d = new Date(year, 1, 1); d.getFullYear() == year; d.setDate(d.getDate() + 1)) {
        console.log(d);
        var ticketsClosed = Math.round(Math.random() * 10) + 1;
        var newTickets = Math.round(Math.random() * 9) + 1;
        totalTickets += newTickets;
        totalTickets -= ticketsClosed;
        totalTickets = Math.max(0, totalTickets); // no fewer than 0 tickets ;)
        var writePointCallback = function (err, response) {
            if (err) {
                console.log('err:', err);
            }
            if (response) {
                console.log('response:', response);
            }
        };
        client.writePoint('tickets', {time: d, value: ticketsClosed}, {type: 'closed'}, writePointCallback);
        client.writePoint('tickets', {time: d, value: newTickets}, {type: 'new'}, writePointCallback);
        client.writePoint('tickets', {time: d, value: totalTickets}, {type: 'total'}, writePointCallback);
    }
});