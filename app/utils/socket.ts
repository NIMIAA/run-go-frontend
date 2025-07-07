import { io, Socket } from "socket.io-client";

export function createDriverSocket(token: string): Socket {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
        auth: { token },
        transports: ["websocket", "polling"],
        autoConnect: false,
    });
    return socket;
} 