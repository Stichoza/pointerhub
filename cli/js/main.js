if(typeof(Storage) == "undefined") {
	console.warn("localStorage not supported");
	var pid = Math.floor(Math.random() * 1000000);
	var name = window.prompt("Enter your name") || "user"+pid;
} else {
	var pid = localStorage.pid || Math.floor(Math.random() * 1000);
	var name = window.prompt("Enter your name", localStorage.name || "") || "user"+pid;
	localStorage.pid = pid;
	localStorage.name = name;
}


console.log("pid:\t" . pid);
console.log("name:\t" . name);



var host = location.origin.replace(/^http/, 'ws'),
	ws = new WebSocket(host),
	dawgs = {},
	online = [0, 0],
	online_text = "";

ws.onmessage = function (data) {
	dawgs = JSON.parse(data.data);
	//console.log(dawgs);
	$.each(dawgs, function(index, dawg) {
		if (index == pid) {
			return 1;
		} else if (index == "stats") {
			online = dawg;
			if (online[0] < 1) {
				online_text = "Loading data...";
			} else if (online[0] == 1) {
				online_text = "Sorry, <b>you are alone</b> here."
					+ "<br>ask someone to join :)";
			} else {
				online_text = "<b>" + online[0]
					+ "</b> people online";
			}
			return 1;
		} else if (dawg == null) {
			$(".dawg-" + index).remove();
			return 1;
		}

		var d = $(".dawg-" + index);

		if (!!d.length) {
			var op = (!!dawg.a) ? "1" : "0.5";
			$(d[0]).css({
				top: dawg.y + "px",
				left: dawg.x + "px",
				opacity: op
			});
		} else {
			$("#pointer-area").append("<div class='dawg dawg-" +
				index +
				"'><span>" +
				dawg.n +
				"</span></div>");
		}
	});
}


$("body").on("mousemove", function(e) {
	try {
		ws.send(JSON.stringify({
			id: pid,
			lb: name,
			mx: e.pageX,
			my: e.pageY
		}));
	} catch (err) {
		console.warn("daym dawg, keep calm");
	}
});

var onlineSetter = setInterval(function() {
	$("#stats").html(online_text);
}, 500);