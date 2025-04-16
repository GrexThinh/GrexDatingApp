using static API.ValueObjects.AppValue;

namespace API.Entities
{
    public class FanGroupUser
    {
        public Guid Id { get; set; }
        public Guid FanGroupId { get; set; }
        public FanGroup FanGroup { get; set; } = null!;
        public int UserId { get; set; }
        public AppUser User { get; set; } = null!;
        public DateTime JoinDate { get; set; } = DateTime.UtcNow;
        public byte ActiveFlag { get; set; }
        public GroupUserStatus Status { get; set; }
        public IList<GroupRole> Roles { get; set; } = [];
    }
}
