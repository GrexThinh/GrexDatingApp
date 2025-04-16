using API.Entities;
using API.Helpers;
using static API.ValueObjects.AppValue;

namespace API.DTOs
{
    public class FanGroupCreateDto
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public string Type { get; set; }
        public string Location { get; set; }
        public IEnumerable<GroupPhotoCreateDto>? GroupPhotos  { get; set; } 
    }

    public class FanGroupUpdateDto
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public string Type { get; set; }
        public string Location { get; set; }
        public IEnumerable<GroupPhotoCreateDto>? GroupPhotos { get; set; }
    }

    public class FanGroupParams : PaginationParams
    {
        public string? Type { get; set; }
        public string? Location { get; set; }
        public GroupUserStatus? Status { get; set; }
    }

    public class GroupMembersDto
    {
        public MemberDto? Member { get; set; } = null;
        public IList<GroupRole> Roles { get; set; } = [];
        public GroupUserStatus? Status { get; set; }
    }

    public class FanGroupDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public byte ActiveFlag { get; set; }
        public string Type { get; set; }
        public string Location { get; set; }
        public GroupUserStatus? CurrentUserStatus { get; set; }
        public List<Photo> Photos { get; set; } = [];
        public List<GroupMembersDto> Members { get; set; } = [];
    }
}
