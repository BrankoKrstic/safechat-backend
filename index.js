if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const io = require("socket.io")(process.env.PORT, {
	cors: {
		origin: ["http://localhost:3000"],
		methods: ["GET", "POST"],
	},
});

let i;

io.on("connection", (socket) => {
	const { userId } = socket.handshake.query;
	socket.join(userId);
	clearInterval(i);
	i = setInterval(() => {
		const allSockets = io.of("/").sockets;
		const connectedSockets = {};
		for (let socket of allSockets) {
			if (socket[1].connected) {
				connectedSockets[socket[1].handshake.query.userId] =
					socket[1].handshake.query.username;
			}
		}
		io.emit("chat-data", connectedSockets);
	}, 5000);
	socket.on("send-message", (message) => {
		socket.broadcast.emit("message", message);
	});
});
