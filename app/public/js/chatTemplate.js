function iniciaChat(usuario) {
	let socket = io.connect("http://localhost:3000");
	var user;
	var onChat = false;
	// if ($(''))
	$('.chat-online').click((e) => {
		user = JSON.parse(decodeURIComponent(usuario));
		$("#chat").fadeIn();
		let time = new Date();
		console.log();
		$("#name").html(user.nome);
		onChat = true;
		$("#time").html('Última vez logado: ' + time.getHours() + ':' + time.getMinutes());
		socket.emit("join", JSON.stringify(user));
	});

	$("#textarea").keypress(function (e) {
		if (e.which == 13) {
			let text = $("#textarea").val();
			$("#textarea").val('');
			let time = new Date();
			$(".chat").append(`
				<li class="self">
					<div class="msg">
						<span> ${user.nome}
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
			$('.user-online').html(msg);
			$('.user-online').removeAttr('hidden');
			$('.user-online').fadeIn();
			setTimeout(() => {
				$('.user-online').fadeOut();
				$('.user-online').attr('hidden', 'hidden');
			}, 5000);
		}
		document.querySelector(".chat").scrollTop = document.querySelector(".chat").scrollHeight
	});

	socket.on("chat", function (client, msg) {
		if (onChat) {
			let time = new Date();
			$(".chat").append(`
				<li class="other">
					<div class="msg">
					<span> ${client.nome}:
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