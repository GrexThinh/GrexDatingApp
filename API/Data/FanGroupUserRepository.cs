using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;
using static API.ValueObjects.AppValue;

namespace API.Data
{
    public class FanGroupUserRepository(DataContext context) : IFanGroupUserRepository
    {
        public void AddFanGroupUser(FanGroupUser groupUser)
        {
            context.FanGroupUsers.Add(groupUser);
        }

        public void DeleteFanGroupUser(FanGroupUser groupUser)
        {
            context.FanGroupUsers.Remove(groupUser);
        }

        public async Task<FanGroupUser?> GetFanGroupUserByGroupIdAndUserIdAsync(Guid groupId, int userId)
        {
            var res = await context.FanGroupUsers.FirstOrDefaultAsync(x => x.FanGroupId == groupId
                && x.UserId == userId && x.ActiveFlag == (byte)ActiveFlag.Active);
            return res;
        }
    }
}
