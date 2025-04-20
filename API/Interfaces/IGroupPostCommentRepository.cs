using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface IGroupPostCommentRepository
    {
        Task<IList<GroupPostCommentDto>> GetGroupPostCommentByPostIdAsync(Guid postId);
        void AddGroupPostCommentAsync(GroupPostComment comment);

    }
}
