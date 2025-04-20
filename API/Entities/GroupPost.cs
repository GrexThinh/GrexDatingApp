namespace API.Entities
{
    public class GroupPost : BaseEntity
    {
        public required int UserId { get; set; }
        public AppUser User { get; set; } = null!;
        public Guid? FanGroupId { get; set; }
        public FanGroup FanGroup { get; set; } = null!;
        public required string Content { get; set; }
        public List<Photo> Photos { get; set; } = [];
        public List<GroupPostComment> Comments { get; set; } = [];
        public List<GroupPostReaction> Reactions { get; set; } = [];
    }
}
