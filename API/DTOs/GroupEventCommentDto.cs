namespace API.DTOs
{
    public class GroupEventCommentDto
    {
        public Guid Id { get; set; }
        public string? Description { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }
        public byte ActiveFlag { get; set; }
        public Guid GroupEventId { get; set; }
        public string Content { get; set; } = null!;
        public DateTime SendDate { get; set; }
        public int SenderId { get; set; }
        public Guid? ParentId { get; set; } = null;
        public bool SenderDeleted { get; set; }
        public MemberDto Sender { get; set; }
    }

    public class GroupEventCommentCreateParams
    {
        public required Guid GroupEventId { get; set; }
        public required string Content { get; set; }
        public required int SenderId { get; set; }
        public int? RecipientId { get; set; } = null;
        public Guid? ParentId { get; set; } = null;
    }
}
