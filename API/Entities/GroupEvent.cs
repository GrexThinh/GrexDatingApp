namespace API.Entities
{
    public class GroupEvent : BaseEntity
    {
        public string Name { get; set; } = null!;
        public DateTime? EventStartTime { get; set; }
        public DateTime? EventEndTime { get; set; }
        public string Location { get; set; } = null!;
        public Guid? FanGroupId { get; set; }
        public FanGroup FanGroup { get; set; } = null!;
        public List<Photo> Photos { get; set; } = [];
        public List<GroupEventComment> Comments { get; set; } = [];
    }
}
