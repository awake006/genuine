$(window).ready(function () {
    if ($("#locust_count").length > 0) {
        $("#locust_count").focus().select();
    }
});

$("#box_stop a.stop-button").click(function (event) {
    event.preventDefault();
    $.get($(this).attr("href"));
    $("#status_text").html("stopped");
    $("body").attr("class", "stopped");
    $(".box_stop").hide();
    $("a.new_test").show();
});

$("#new_test").click(function (event) {
    event.preventDefault();
    $("#start").show();
    $("#locust_count").focus().select();
});

$("#connect_test").click(function (event) {
    event.preventDefault();
    $("#connect").show();
    $("#locust_count").focus().select();
});

$(".close_link").click(function (event) {
    event.preventDefault();
    $(this).parent().parent().hide();
    $("#status").show()
});

var alternate = false;

$("ul.tabs").tabs("div.panes > div").on("onClick", function (event) {
    if (event.target == $(".chart-tab-link")[0]) {
        // trigger resizing of charts
        tpsChart.resize();
        sendSpeedChart.resize();
        usersChart.resize();
    }
});

var stats_tpl = $('#stats-template');
var errors_tpl = $('#errors-template');

$('#swarm_form').submit(function (event) {
    event.preventDefault();
    $.post($(this).attr("action"), $(this).serialize(),
        function (response) {
            $("#start_error").html("");
            if (response.data) {
                $("#status_text").html("running");
                $("body").attr("class", "hatching");
                $("#start").fadeOut();
                $("#status").fadeIn();
                $(".box_running").fadeIn();
                $("a.new_test").fadeOut();
            }else{
                $("#start_error").html(response.msg);
            }
        }
    );
});

$('#start_connect').submit(function (event) {
    event.preventDefault();
    $.post($(this).attr("action"), $(this).serialize(),
        function (response) {
            console.log(response.data);
            $("#connect_error").html("");
            if (response.data) {
                $("body").attr("class", "ready");
                $("#connect").fadeOut();  
            }else{
                $("#connect_error").html(response.msg);
            }
        }
    );
});
var sortBy = function (field, reverse, primer) {
    reverse = (reverse) ? -1 : 1;
    return function (a, b) {
        a = a[field];
        b = b[field];
        if (typeof (primer) != 'undefined') {
            a = primer(a);
            b = primer(b);
        }
        if (a < b) return reverse * -1;
        if (a > b) return reverse * 1;
        return 0;
    }
}

// Sorting by column
var sortAttribute = "name";
var slaveSortAttribute = "id";
var desc = false;
var report;
$(".stats_label").click(function (event) {
    event.preventDefault();
    sortAttribute = $(this).attr("data-sortkey");
    desc = !desc;

    $('#stats tbody').empty();
    $('#errors tbody').empty();
    alternate = false;
    totalRow = report.stats.pop();
    sortedStats = (report.stats).sort(sortBy(sortAttribute, desc));
    sortedStats.push(totalRow);
    $('#stats tbody').jqoteapp(stats_tpl, sortedStats);
    alternate = false;
    $('#errors tbody').jqoteapp(errors_tpl, (report.errors).sort(sortBy(sortAttribute, desc)));
});

// init charts
var tpsChart = new LocustLineChart($(".charts-container"), "Total Requests per Second", ["TPS"], "reqs/s");
var sendSpeedChart = new LocustLineChart($(".charts-container"), "Send Speed per Second", ["SendSpeed"], "sends/s");
var usersChart = new LocustLineChart($(".charts-container"), "Number of Users", ["Users"], "users");

function updateStats() {
    $.get('./stats/requests', function (report) {
        report = report.data;
        $("#total_rps").html(Math.round(report.tps * 100) / 100);
        $("#status_text").html(report.state);

        $('#errors tbody').empty();

        // alternate = false;
        // $('#errors tbody').jqoteapp(errors_tpl, (report.errors).sort(sortBy(sortAttribute, desc)));

        if (report.state !== "stopped") {
            // update charts
            tpsChart.addValue([report.tps]);
            sendSpeedChart.addValue([report.send_speed]);
            usersChart.addValue([report.user_count]);
            $("body").attr("class", "hatching");
            $("#start").fadeOut();
            $("#status").fadeIn();
            $(".box_running").fadeIn();
            $("a.new_test").fadeOut();
            $(".user_count").fadeIn();
        } else {
            $("body").attr("class", "stopped");
            $(".box_stop").hide();
            $("a.new_test").show();
            $(".user_count").hide();
        }

        setTimeout(updateStats, 2000);
    });

}
updateStats();
var nodeinfo;
function getNodeInfo() {
    $.get('./node', function (node) {
        nodeinfo = node.data;
        
    });

}
getNodeInfo();