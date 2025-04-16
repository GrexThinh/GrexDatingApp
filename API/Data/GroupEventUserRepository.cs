using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper.QueryableExtensions;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using static API.ValueObjects.AppValue;

namespace API.Data
{
    public class GroupEventUserRepository(DataContext context, IMapper mapper) : IGroupEventUserRepository
    {
        public void AddGroupEventUser(GroupEventUser evtUser)
        {
            context.GroupEventUsers.Add(evtUser);
        }

        public void DeleteGroupEventUser(GroupEventUser evtUser)
        {
            context.GroupEventUsers.Remove(evtUser);
        }

        public async Task<GroupEventUser?> GetGroupEventUserByEventIdAndUserIdAsync(Guid eventId, int userId)
        {
            return await context.GroupEventUsers.FirstOrDefaultAsync(x => x.GroupEventId == eventId
                && x.UserId == userId && x.ActiveFlag == (byte)ActiveFlag.Active);
        }

        public async Task<IList<GroupEventUserDto>> GetGroupEventUserByEventIdAsync(Guid eventId)
        {
            return await context.GroupEventUsers.Where(x => x.GroupEventId == eventId
                && x.ActiveFlag == (byte)ActiveFlag.Active)
                .Include(x => x.User)
                .ProjectTo<GroupEventUserDto>(mapper.ConfigurationProvider)
                .ToListAsync();
        }
    }
}
