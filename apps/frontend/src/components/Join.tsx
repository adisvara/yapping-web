import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Room } from "./Room";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Join = () => {
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleRoomClick = (roomName: string) => {
        setSelectedRoom(roomName);
    }

    const handleJoinClick = () => {
        if (selectedRoom) {
            navigate('/messages', {
                state: { roomName: selectedRoom }
            });
        }
    }

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Select a Room</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <Room roomName="Room 101" selectedRoom={selectedRoom} onClick={handleRoomClick} />
                    <Room roomName="Room 102" selectedRoom={selectedRoom} onClick={handleRoomClick} />
                    <Room roomName="Room 103" selectedRoom={selectedRoom} onClick={handleRoomClick} />
                    <Room roomName="Room 104" selectedRoom={selectedRoom} onClick={handleRoomClick} />
                </div>
                <Button onClick={handleJoinClick} disabled={!selectedRoom} className="w-full">
                    {selectedRoom ? `Join ${selectedRoom}` : 'Select a Room First'}
                </Button>
            </CardContent>
        </Card>
    )
}
