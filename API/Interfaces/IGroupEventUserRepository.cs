using API.Entities;

namespace API.Interfaces
{
    public interface IGroupEventUserRepository
    {
        void AddGroupEventUser(GroupEventUser evtUser);
        void DeleteGroupEventUser(GroupEventUser evtUser);
        Task<GroupEventUser?> GetGroupEventUserByEventIdAndUserIdAsync(Guid eventId, int userId);

    }
}
