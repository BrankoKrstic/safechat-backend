const PORT = process.env.PORT || 8080;

const io = require("socket.io")(PORT, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	const id = socket.handshake.query.id;
	socket.join(id);
	socket.on("send-message", (data) => {
		console.log(data.message);
	});
});
