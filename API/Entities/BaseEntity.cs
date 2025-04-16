namespace API.Entities
{
    public class BaseEntity
    {
        public Guid Id { get; set; }
        public string? Description { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime UpdateDate { get; set; }
        public byte ActiveFlag { get; set; }
    }
}
