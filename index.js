const PORT = process.env.PORT || 8080;

const io = require("socket.io")(PORT, {
	cors: {
		origin: ["http://localhost:3000", "http://localhost:3001"],
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	const { userId, username } = socket.handshake.query;
	socket.join(userId);
	setInterval(() => {
		const allSockets = io.of("/").sockets;
		const connectedSockets = {};
		for (let socket of allSockets) {
			if (socket[1].connected) {
				connectedSockets[socket[1].handshake.query.userId] =
					socket[1].handshake.query.username;
			}
		}
		console.log(connectedSockets);
		io.emit("chat-data", connectedSockets);
	}, 5000);
	socket.on("send-message", (message) => {
		socket.broadcast.emit("message", message);
	});
});
