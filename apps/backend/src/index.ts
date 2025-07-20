import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket;
    room: string;
    userId: string;
}

interface MessagePayload {
    type: 'system' | 'chat';
    message: string;
    sender: string;
    timestamp: string;
    isOwn?: boolean;
}

let allSockets: User[] = [];
let userIdCounter = 0;

wss.on("connection", (socket) => {
    const userId = `user_${++userIdCounter}`;
    console.log(`User ${userId} connected`);

    socket.on("message", (e) => {
        const parsedMsg = JSON.parse(e.toString());
        
        if (parsedMsg.type === 'join') {
            // Add user to room
            allSockets.push({
                socket,
                room: parsedMsg.payload.roomId,
                userId
            });
            
            console.log(`User ${userId} joined room: ${parsedMsg.payload.roomId}`);
            
            // Send confirmation to the user who joined
            const joinMessage: MessagePayload = {
                type: 'system',
                message: `You have joined ${parsedMsg.payload.roomId}`,
                sender: 'System',
                timestamp: new Date().toISOString(),
                isOwn: true
            };
            socket.send(JSON.stringify(joinMessage));

            // Notify other users in the room
            const currentUserRoom = parsedMsg.payload.roomId;
            allSockets.forEach((s) => {
                if (s.room === currentUserRoom && s.socket !== socket) {
                    const notificationMessage: MessagePayload = {
                        type: 'system',
                        message: `${userId} joined ${currentUserRoom}`,
                        sender: 'System',
                        timestamp: new Date().toISOString(),
                        isOwn: false
                    };
                    s.socket.send(JSON.stringify(notificationMessage));
                }
            });
        }

        if (parsedMsg.type === 'chat') {
            const currentUser = allSockets.find(x => x.socket === socket);
            
            if (currentUser) {
                console.log(`Broadcasting message from ${currentUser.userId} to room: ${currentUser.room}`);
                
                // Send message to all users in the same room
                allSockets.forEach((s) => {
                    if (s.room === currentUser.room) {
                        const chatMessage: MessagePayload = {
                            type: 'chat',
                            message: parsedMsg.payload.message,
                            sender: currentUser.userId,
                            timestamp: new Date().toISOString(),
                            isOwn: s.socket === socket // Mark as own message for sender
                        };
                        s.socket.send(JSON.stringify(chatMessage));
                    }
                });
            }
        }
    });

    socket.on("close", () => {
        console.log(`User ${userId} disconnected`);
        
        // Find and remove user from allSockets
        const userIndex = allSockets.findIndex(user => user.socket === socket);
        if (userIndex !== -1) {
            const user = allSockets[userIndex];
            const userRoom = user.room;
            allSockets.splice(userIndex, 1);
            
            // Notify others in the room about the disconnection
            allSockets.forEach((s) => {
                if (s.room === userRoom) {
                    const leaveMessage: MessagePayload = {
                        type: 'system',
                        message: `${userId} left ${userRoom}`,
                        sender: 'System',
                        timestamp: new Date().toISOString(),
                        isOwn: false
                    };
                    s.socket.send(JSON.stringify(leaveMessage));
                }
            });
        }
    });

    socket.on("error", (error) => {
        console.error(`WebSocket error for user ${userId}:`, error);
    });
});

console.log("WebSocket server running on port 8080");