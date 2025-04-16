using API.Entities;
using static API.ValueObjects.AppValue;

namespace API.DTOs
{
    public class GroupEventUserDto
    {
        public Guid GroupEventId { get; set; }
        public int UserId { get; set; }
        public MemberDto User { get; set; }
        public DateTime JoinDate { get; set; }
        public GroupEventUserStatus Status { get; set; }
        public IList<GroupEventRole> Roles { get; set; } = [];
        public string? Description { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }
        public byte ActiveFlag { get; set; }
    }
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
