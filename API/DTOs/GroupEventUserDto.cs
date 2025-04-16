using static API.ValueObjects.AppValue;

namespace API.DTOs
{
    public class GroupEventUserRoleParams
    {
        public Guid EventId { get; set; }
        public int UserId { get; set; }
        public IList<GroupEventRole> Roles { get; set; }
    }

    public class GroupEventUserStatusParams
    {
        public Guid EventId { get; set; }
        public int UserId { get; set; }
        public GroupEventUserStatus Status { get; set; }
    }
}
