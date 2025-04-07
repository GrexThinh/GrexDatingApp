using API.Entities;
using API.Helpers;

namespace API.DTOs
{
    public class FanGroupCreateDto
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public string Type { get; set; }
        public string Location { get; set; }
        public IEnumerable<GroupPhotoCreateDto> GroupPhotos  { get; set; } 
    }

    public class FanGroupParams : PaginationParams
    {
        public string? Type { get; set; }
        public string? Location { get; set; }
        public int? MinNumberOfMembers { get; set; }
    }

    public class FanGroupDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public byte ActiveFlag { get; set; }
        public string Type { get; set; }
        public string Location { get; set; }
        public List<Photo> Photos { get; set; } = [];
    }
}
