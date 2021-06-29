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
	io.emit("chat-join", username, userId);
	socket.on("send-message", (message) => {
		socket.broadcast.emit("message", message);
	});
});
