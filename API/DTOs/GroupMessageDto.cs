namespace API.DTOs
{
    public class GroupMessageDto
    {
        public Guid Id { get; set; }
        public int SenderId { get; set; }
        public required string SenderPhotoUrl { get; set; }
        public required string Content { get; set; }
        public DateTime? DateRead { get; set; }
        public DateTime MessageSent { get; set; }
    }

    public class CreateGroupMessageDto
    {
        public required Guid FanGroupId { get; set; }
        public required string Content { get; set; }
    }
}
