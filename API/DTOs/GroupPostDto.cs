using API.Entities;
using API.Helpers;
using static API.ValueObjects.AppValue;

namespace API.DTOs
{
    public class GroupPostCreateDto
    {
        public required int UserId { get; set; }
        public required string Content { get; set; }
        public string? Description { get; set; }
        public Guid? FanGroupId { get; set; }
        public IEnumerable<IFormFile>? Files { get; set; }
    }

    public class GroupPostUpdateDto
    {
        public required string Content { get; set; }
        public string? Description { get; set; }
        // public IEnumerable<IFormFile>? Files { get; set; }
    }

    public class GroupPostParams : PaginationParams
    {
        public Guid? FanGroupId { get; set; }
        public string? Content { get; set; }
        public DateTime? PostStartTime { get; set; }
        public DateTime? PostEndTime { get; set; }
    }

    public class GroupPostDto
    {
        public Guid Id { get; set; }
        public required string Content { get; set; }
        public int UserId { get; set; }
        public required MemberDto User { get; set; }
        public Guid? FanGroupId { get; set; }
        public FanGroupDto? FanGroup { get; set; }
        public string? Description { get; set; }
        public byte ActiveFlag { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }
        public List<Photo> Photos { get; set; } = [];
        public List<GroupPostComment> Comments { get; set; } = [];
        public List<GroupPostReaction> Reactions { get; set; } = [];
        public ReactionType? ReactionByCurrentUser { get; set; }

    }
}
