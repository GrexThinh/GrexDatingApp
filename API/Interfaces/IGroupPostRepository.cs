using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IGroupPostRepository
    {
        Task<GroupPost?> GetGroupPostByIdAsync(Guid id);
        void AddGroupPost(GroupPost evt);
        Task<PagedList<GroupPostDto>> GetGroupPostsAsync(GroupPostParams groupPostParams, int currentUserId);

    }
}
