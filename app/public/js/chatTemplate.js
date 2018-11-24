function iniciaChat(name) {
	let socket = io.connect("http://localhost:3000");
	var onChat = false;
	// if ($(''))
	$('.chat-online').click((e) => {
		e.preventDefault();
		$("#chat").fadeIn();
		let time = new Date();
		$("#name").html(name);
		onChat = true;
		$("#time").html('Última vez logado: ' + time.getHours() + ':' + time.getMinutes());
		socket.emit("join", name);
	});

	$("#textarea").keypress(function (e) {
		if (e.which == 13) {
			let text = $("#textarea").val();
			$("#textarea").val('');
			let time = new Date();
			$(".chat").append(`
				<li class="self">
					<div class="msg">
						<span> ${name}
						</span>
						<p> ${text} 
						</p>
						<time> ${time.getHours()}:${time.getMinutes()}
						</time>
					</div>
				</li>
			`);
			document.querySelector(".chat").scrollTop = document.querySelector(".chat").scrollHeight
			socket.emit("send", text);
		};
	});


	socket.on("update", function (msg) {
		if (onChat) {
			$('.chat').append(`<li class="info"> ${msg} </li>`);
		}
		document.querySelector(".chat").scrollTop = document.querySelector(".chat").scrollHeight
	});

	socket.on("chat", function (client, msg) {
		if (onChat) {
			let time = new Date();
			$(".chat").append(`
				<li class="other">
					<div class="msg">
					<span> ${client}:
					</span>
					<p> ${msg} 
					</p>
					<time> ${time.getHours()} : ${time.getMinutes()}
					</time>
				</div>
			</li>`);
		}
		document.querySelector(".chat").scrollTop = document.querySelector(".chat").scrollHeight
	});
};