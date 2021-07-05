if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const io = require("socket.io")(process.env.PORT, {
	cors: {
		origin: process.env.ORIGIN,
		methods: ["GET", "POST"],
	},
});

const regexExp =
	/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

function getActiveRooms(io) {
	const arr = Array.from(io.sockets.adapter.rooms);
	const filtered = arr.filter(
		(room) => !room[1].has(room[0]) && !regexExp.test(room[1])
	);
	const res = filtered.map((i) => i[0]);
	return res;
}

const connectedSockets = {};

io.on("connection", (socket) => {
	const { userId, username } = socket.handshake.query;
	socket.join(userId);
	if (userId !== "null") {
		connectedSockets[userId] = username;
	}
	socket.on("disconnect", (reason) => {
		if (connectedSockets[userId]) {
			delete connectedSockets[userId];
		}
	});
	socket.on("send-message", (message, room) => {
		if (room === "") {
			socket.broadcast.emit("message", message);
		} else {
			socket.to(room).emit("message", message);
		}
	});
	socket.on("join-room", (room, cb) => {
		socket.join(room);
		cb();
	});
});

const socketInterval = setInterval(() => {
	const roomData = getActiveRooms(io);
	const activeRooms = roomData.filter(
		(room) => connectedSockets[room] === undefined && room !== ""
	);
	io.emit("chat-data", connectedSockets, activeRooms);
}, 2000);
