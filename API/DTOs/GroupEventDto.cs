using API.Entities;
using API.Helpers;
using static API.ValueObjects.AppValue;

namespace API.DTOs
{
    public class GroupEventCreateDto
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public DateTime? EventStartTime { get; set; }
        public DateTime? EventEndTime { get; set; }
        public string? Location { get; set; }
        public IEnumerable<IFormFile>? Files { get; set; }
    }

    public class GroupEventUpdateDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public DateTime? EventStartTime { get; set; }
        public DateTime? EventEndTime { get; set; }
        public string? Location { get; set; }
        //public IEnumerable<IFormFile>? Files { get; set; }
    }

    public class GroupEventParams : PaginationParams
    {
        public string? Name { get; set; }
        public string? Location { get; set; }
        public DateTime? EventStartTime { get; set; }
        public DateTime? EventEndTime { get; set; }
        public GroupEventUserStatus? Status { get; set; }
    }

    public class GroupEventMembersDto
    {
        public MemberDto? Member { get; set; } = null;
        public IList<GroupEventRole> Roles { get; set; } = [];
        public GroupEventUserStatus? Status { get; set; }
    }

    public class GroupEventDto
    {
        public Guid Id { get; set; }
        public Guid? FanGroupId { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public byte ActiveFlag { get; set; }
        public string Location { get; set; }
        public DateTime? EventStartTime { get; set; }
        public DateTime? EventEndTime { get; set; }
        public GroupEventUserStatus? CurrentUserStatus { get; set; }
        public List<Photo> Photos { get; set; } = [];
        public List<GroupEventMembersDto> Members { get; set; } = [];
    }
}
