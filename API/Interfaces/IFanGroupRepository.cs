using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IFanGroupRepository
    {
        Task<PagedList<FanGroupDto>> GetFanGroupsAsync(FanGroupParams groupParams);
        void AddFanGroup(FanGroup group);
    }
}
