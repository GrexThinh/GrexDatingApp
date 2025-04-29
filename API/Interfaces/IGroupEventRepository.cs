using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IGroupEventRepository
    {
        Task<GroupEvent?> GetGroupEventByIdAsync(Guid id);
        Task<GroupEventDto?> GetGroupEventDetailByIdAsync(Guid id, int currentUserId);
        void AddGroupEvent(GroupEvent evt);
        Task<PagedList<GroupEventDto>> GetGroupEventsAsync(GroupEventParams groupEventParams, int currentUserId);
        Task<List<GroupEventDto>> GetIncomingGroupEventsAsync(int currentUserId);

    }
}
