using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface IGroupPostReactionRepository
    {
        Task<IList<GroupPostReactionDto>> GetGroupPostReactionByPostIdAsync(Guid postId);
        Task<GroupPostReaction?> GetGroupPostReactionByPostIdAndUserIdAsync(Guid postId, int userId);
        void AddGroupPostReactionAsync(GroupPostReaction reaction);
        void DeleteGroupPostReactionAsync(GroupPostReaction reaction);

    }
}
