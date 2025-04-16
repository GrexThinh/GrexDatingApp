using static API.ValueObjects.AppValue;

namespace API.Entities
{
    public class GroupEventUser : BaseEntity
    {
        public Guid GroupEventId { get; set; }
        public GroupEvent GroupEvent { get; set; } = null!;
        public int UserId { get; set; }
        public AppUser User { get; set; } = null!;
        public DateTime JoinDate { get; set; } = DateTime.UtcNow;
        public GroupEventUserStatus Status { get; set; }
        public IList<GroupEventRole> Roles { get; set; } = [];

    }
}
