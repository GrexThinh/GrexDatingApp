using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using static API.ValueObjects.AppValue;

namespace API.Data
{
    public class GroupEventCommentRepository(DataContext context, IMapper mapper) : IGroupEventCommentRepository
    {
        public void AddGroupEventCommentAsync(GroupEventComment comment)
        {
            context.GroupEventComments.Add(comment);
        }

        public async Task<IList<GroupEventCommentDto>> GetGroupEventCommentByEventIdAsync(Guid eventId)
        {
            return await context.GroupEventComments
                .Where(x => x.GroupEventId == eventId && x.ActiveFlag == (byte)ActiveFlag.Active)
                .OrderByDescending(x => x.SendDate)
                .Include(x => x.Sender)
                .ProjectTo<GroupEventCommentDto>(mapper.ConfigurationProvider)
                .ToListAsync();
        }
    }
}
