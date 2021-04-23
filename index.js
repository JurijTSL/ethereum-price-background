window.wallpaperPropertyListener = {
    applyUserProperties: function(properties) {
        if (properties.style) {
            if (properties.style.value) {
                switch (properties.style.value) {
                    case "normal":
                        $("#area").css("--bckgColor", "#4e54c8");
                        break;
                    case "dark":
                        $("#area").css("--bckgColor", "#202225");
                        break;
                }
            }
        }
    }
}


var chartData = new Array();
var chartLabels = new Array();

var ethCanvas = document.getElementById("speedChart");
Chart.defaults.global.defaultFontFamily = "Varela Round";

var speedData = {
    labels: chartLabels,
    datasets: [{
        label: "Car Speed",
        data: chartData,
        lineTension: 0,
        fill: false,
        borderColor: '#FFFFFF',
        backgroundColor: 'transparent',
        pointBorderColor: '#FFFFFF',
        pointBackgroundColor: '#FFFFFF',
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHitRadius: 5,
        pointBorderWidth: 2,
        pointStyle: 'point'
    }]
};

var chartOptions = {
    tooltips: {
        callbacks: {
            label: function(tooltipItems, data) {
                return "$ " + tooltipItems.yLabel.toString();
            }
        }
    },

    legend: {
        display: false
    },

    scales: {
        xAxes: [{
            gridLines: {
                display: true,
                color: "white",
                borderDash: [2, 5]
            },

            ticks: {
                display: true,
                fontColor: "white",
                maxTicksLimit: 7,
                maxRotation: 0,
                minRotation: 0
            }
        }],

        yAxes: [{
            gridLines: {
                color: "white",
                borderDash: [2, 5]
            },

            ticks: {
                fontColor: "white"
            }
        }]
    }
};

var lineChart = new Chart(ethCanvas, {
    type: 'line',
    data: speedData,
    options: chartOptions
});

let price = 0;

function formateDate(timestamp) {
    var date = new Date(timestamp);

    var month = date.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }

    return month + '/' + date.getDate() + '/' + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
};

function retreivePrice() {
    $.get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd", function(data) {
        var updPrice = data.ethereum.usd;

        chartData.push(updPrice);
        chartLabels.push(formateDate(Date.now()));
        chartData.splice(0, 1); 

        lineChart.update();

        $("#eth-price").text("$" + updPrice);

        if (updPrice > price) {
            $("#arrow-sign").removeAttr('class');
            $("#arrow-sign").addClass("fas").addClass("arrow").addClass("green").addClass("fa-arrow-up");
        } else if (updPrice == price) {

        } else {
            $("#arrow-sign").removeAttr('class');
            $("#arrow-sign").addClass("fas").addClass("arrow").addClass("red").addClass("fa-arrow-down");
        }

        price = updPrice;
    });
}

$.get("https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=1", function(data) {
    var i;
    for (i = 0; i < data.prices.length; i++) {
        var priceToAdd = parseFloat(data.prices[i][1]).toFixed(2);
        var label = data.prices[i][0];

        chartData.push(priceToAdd);
        chartLabels.push(formateDate(label));
    }

    lineChart.update();
});

setInterval(function() {
    retreivePrice();
}, 300000);

retreivePrice();