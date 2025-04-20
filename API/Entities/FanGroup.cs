namespace API.Entities
{
    public class FanGroup
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public byte ActiveFlag { get; set; }
        public string Type { get; set; } = null!;
        public string Location { get; set; } = null!;
        public List<Photo> Photos { get; set; } = [];
        public List<GroupPost> Posts { get; set; } = [];
        public List<GroupEvent> Events { get; set; } = [];

    }
}
