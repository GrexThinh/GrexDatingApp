namespace API.DTOs
{
    public class GroupPostReactionDto
    {
        public Guid Id { get; set; }
        public string? Description { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }
        public byte ActiveFlag { get; set; }
        public Guid GroupPostId { get; set; }
        public DateTime ReactionDate { get; set; }
        public int SenderId { get; set; }
        public bool SenderDeleted { get; set; }
        public required MemberDto Sender { get; set; }
    }

    public class GroupPostReactionCreateParams
    {
        public required Guid GroupPostId { get; set; }
        public required string Content { get; set; }
        public required int SenderId { get; set; }
        public int? RecipientId { get; set; } = null;
        public Guid? ParentId { get; set; } = null;
    }
}
