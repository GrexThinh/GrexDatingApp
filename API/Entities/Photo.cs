using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Photos")]
    public class Photo
    {
        public int Id { get; set; } 
        public string Url { get; set; }
        public bool IsMain { get; set; }
        public string? PublicId { get; set; }

        public int? AppUserId { get; set; }
        public AppUser AppUser { get; set; } = null!;

        public Guid? FanGroupId { get; set; } = null;
        public FanGroup FanGroup { get; set; } = null!;

        public Guid? GroupEventId { get; set; } = null;
        public GroupEvent GroupEvent { get; set; } = null!;

        public Guid? GroupPostId { get; set; } = null;
        public GroupPost GroupPost { get; set; } = null!;
    }
}
