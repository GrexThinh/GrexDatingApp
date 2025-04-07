namespace API.Entities
{
    public class FanGroup
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public byte ActiveFlag { get; set; }
        public string Type { get; set; }
        public string Location { get; set; }
        public List<Photo> Photos { get; set; } = [];
    }
}
