using static API.ValueObjects.AppValue;

namespace API.DTOs
{
    public class FanGroupUserRoleParams
    {
        public Guid GroupId { get; set; }
        public int UserId { get; set; }
        public IList<GroupRole> Roles { get; set; }
    }

    public class FanGroupUserStatusParams
    {
        public Guid GroupId { get; set; }
        public int UserId { get; set; }
        public GroupUserStatus Status { get; set; }
    }
}
