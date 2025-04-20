using static API.ValueObjects.AppValue;

namespace API.Entities
{
    public class GroupPostReaction : BaseEntity
    {
        public Guid GroupPostId { get; set; }
        public GroupPost GroupPost { get; set; } = null!;
        public DateTime ReactionDate { get; set; }
        public int ReacterId { get; set; }
        public AppUser Reacter { get; set; } = null!;
        public ReactionType ReactionType { get; set; }
    }
}
