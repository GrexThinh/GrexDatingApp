using API.Entities;

namespace API.Interfaces
{
    public interface IFanGroupUserRepository
    {
        Task<FanGroupUser?> GetFanGroupUserByGroupIdAndUserIdAsync(Guid groupId, int userId);
        void AddFanGroupUser(FanGroupUser groupUser);
        void DeleteFanGroupUser(FanGroupUser groupUser);
    }
}
