export interface GroupMessage {
  id: string;
  senderId: number;
  senderUsername: string;
  senderPhotoUrl: string;
  fanGroupId: string;
  content: string;
  dateRead?: Date;
  messageSent: Date;
  senderDeleted: boolean;
}
