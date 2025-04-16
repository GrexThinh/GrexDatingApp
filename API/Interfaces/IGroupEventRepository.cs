using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IGroupEventRepository
    {
        Task<GroupEvent?> GetGroupEventByIdAsync(Guid id);
        void AddGroupEvent(GroupEvent evt);
        Task<PagedList<GroupEventDto>> GetGroupEventsAsync(GroupEventParams groupEventParams, int currentUserId);

    }
}
