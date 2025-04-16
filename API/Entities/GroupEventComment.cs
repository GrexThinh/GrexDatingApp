namespace API.Entities
{
    public class GroupEventComment : BaseEntity
    {
        public Guid GroupEventId { get; set; }
        public GroupEvent GroupEvent { get; set; } = null!;
        public string Content { get; set; } = null!;
        public DateTime SendDate { get; set; }
        public int SenderId { get; set; }
        public AppUser Sender { get; set; } = null!;
        public Guid? ParentId { get; set; } = null;
        public GroupEventComment? Parent { get; set; } = null;
        public bool SenderDeleted { get; set; }
    }
}
