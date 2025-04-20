namespace API.Entities
{
    public class GroupPostComment : BaseEntity
    {
        public Guid GroupPostId { get; set; }
        public GroupPost GroupPost { get; set; } = null!;
        public string Content { get; set; } = null!;
        public DateTime SendDate { get; set; }
        public int SenderId { get; set; }
        public AppUser Sender { get; set; } = null!;
        public Guid? ParentId { get; set; } = null;
        public GroupPostComment? Parent { get; set; } = null;
        public bool SenderDeleted { get; set; }
    }
}
