namespace API.Entities
{
    public class GroupMessage : BaseEntity
    {
        public int SenderId { get; set; }
        public AppUser Sender { get; set; } = null!;
        public Guid FanGroupId { get; set; }
        public FanGroup FanGroup { get; set; } = null!;
        public string Content { get; set; } = null!;
        public DateTime? DateRead { get; set; }
        public DateTime MessageSent { get; set; } = DateTime.Now;
        public bool SenderDeleted { get; set; }
    }
}
