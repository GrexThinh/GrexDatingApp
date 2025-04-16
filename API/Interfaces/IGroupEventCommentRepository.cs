using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface IGroupEventCommentRepository
    {
        Task<IList<GroupEventCommentDto>> GetGroupEventCommentByEventIdAsync(Guid eventId);
        void AddGroupEventCommentAsync(GroupEventComment comment);
    }
}
