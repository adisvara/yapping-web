import { Button } from "@/components/ui/button";

type RoomButtonProps = {
  roomName: string;
  selectedRoom: string | null;
  onClick: (roomName: string) => void;
};

export const Room = ({ roomName, selectedRoom, onClick }: RoomButtonProps) => (
  <Button
    onClick={() => onClick(roomName)}
    variant={selectedRoom === roomName ? "default" : "outline"}
  >
    {roomName}
  </Button>
);