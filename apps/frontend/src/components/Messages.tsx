import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Type definitions
interface Message {
    id: number;
    text: string;
    sender: string;
    timestamp: string;
    isOwn: boolean;
    type: 'system' | 'chat';
}

interface LocationState {
    roomName: string;
}

interface WebSocketMessage {
    type: 'join' | 'chat';
    payload: {
        roomId?: string;
        message?: string;
    };
}

interface ServerMessage {
    type: 'system' | 'chat';
    message: string;
    sender: string;
    timestamp: string;
    isOwn: boolean;
}

export const Messages: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const wsRef = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const locationState = location.state as LocationState | null;
    const roomName: string = locationState?.roomName || 'Unknown Room';

    const scrollToBottom = (): void => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!locationState?.roomName) {
            return;
        }

        const ws = new WebSocket('ws://localhost:8080');
        wsRef.current = ws;

        ws.onopen = (): void => {
            setIsConnected(true);
            const joinMessage: WebSocketMessage = {
                type: 'join',
                payload: { roomId: roomName }
            };
            ws.send(JSON.stringify(joinMessage));
        };

        ws.onmessage = (event: MessageEvent<string>): void => {
            try {
                const serverMessage: ServerMessage = JSON.parse(event.data);
                setMessages(prev => [...prev, {
                    id: Date.now() + Math.random(),
                    text: serverMessage.message,
                    sender: serverMessage.sender,
                    timestamp: new Date(serverMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isOwn: serverMessage.isOwn,
                    type: serverMessage.type
                }]);
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };

        ws.onerror = (error: Event): void => {
            console.error('WebSocket error occurred:', error);
            setIsConnected(false);
        };

        ws.onclose = (): void => {
            setIsConnected(false);
        };

        return (): void => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [roomName, locationState?.roomName]);

    const sendMessage = (): void => {
        if (!inputMessage.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            return;
        }

        const chatMessage: WebSocketMessage = {
            type: 'chat',
            payload: { message: inputMessage }
        };
        wsRef.current.send(JSON.stringify(chatMessage));
        setInputMessage('');
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    if (!locationState?.roomName) {
        return (
            <div className="p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>No room selected. Please select a room first.</p>
                        <Button onClick={() => navigate('/')} className="mt-4">Back to Room Selection</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen p-4">
            <header className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-xl font-bold">{roomName}</h1>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <span className={`relative flex h-2 w-2 mr-2`}>
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} opacity-75`}></span>
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        </span>
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </div>
                </div>
                <Button onClick={() => navigate('/')} variant="outline">Back to Rooms</Button>
            </header>
            <main className="flex-1 overflow-y-auto p-4 bg-muted/40 rounded-lg mb-4">
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div key={message.id} className={`flex items-end gap-2 ${message.isOwn ? 'justify-end' : ''}`}>
                            {!message.isOwn && (
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${message.sender}`} />
                                    <AvatarFallback>{message.sender.slice(0, 2)}</AvatarFallback>
                                </Avatar>
                            )}
                            <div className={`rounded-lg p-3 max-w-xs ${message.isOwn ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                                <p className="text-sm">{message.text}</p>
                                <p className="text-xs text-muted-foreground text-right mt-1">{message.timestamp}</p>
                            </div>
                            {message.isOwn && (
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${message.sender}`} />
                                    <AvatarFallback>You</AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </main>
            <footer className="flex gap-2">
                <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    disabled={!isConnected}
                />
                <Button onClick={sendMessage} disabled={!isConnected || !inputMessage.trim()}>Send</Button>
            </footer>
        </div>
    );
};

export default Messages;
