using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IFanGroupRepository
    {
        Task<PagedList<FanGroupDto>> GetFanGroupsAsync(FanGroupParams groupParams, int currentUserId);
        void AddFanGroup(FanGroup group);
        Task<FanGroupDto?> GetFanGroupWithUserByIdAsync(Guid id);
        Task<FanGroup?> GetFanGroupByIdAsync(Guid id);
        void Update(FanGroup group);
    }
}
