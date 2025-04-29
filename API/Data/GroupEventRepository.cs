using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using static API.ValueObjects.AppValue;

namespace API.Data
{
    public class GroupEventRepository(DataContext context, IMapper mapper) : IGroupEventRepository
    {
        public void AddGroupEvent(GroupEvent evt)
        {
           context.GroupEvents.Add(evt);
        }

        public async Task<PagedList<GroupEventDto>> GetGroupEventsAsync(GroupEventParams groupEventParams, int currentUserId)
        {
            var query = context.GroupEvents.AsQueryable();

            if (groupEventParams.Name != null)
            {
                query = query.Where(x => x.Name.Contains(groupEventParams.Name));
            }

            if (groupEventParams.Location != null)
            {
                query = query.Where(x => x.Location.Contains(groupEventParams.Location));
            }

            if (groupEventParams.EventStartTime != null)
            {
                query = query.Where(x => x.EventStartTime >= groupEventParams.EventStartTime);
            }

            if (groupEventParams.EventEndTime != null)
            {
                query = query.Where(x => x.EventEndTime <= groupEventParams.EventEndTime);
            }

            var groupEventsWithUserStatus = query
               .GroupJoin(context.GroupEventUsers.Where(fgu => fgu.UserId == currentUserId && fgu.ActiveFlag == (byte)ActiveFlag.Active),
                   fg => fg.Id,
                   fgu => fgu.GroupEventId,
                   (fg, evtUser) => new
                   {
                       GroupEvent = fg,
                       CurrentUserStatus = evtUser.FirstOrDefault()!.Status,
                   });

            if (groupEventParams.Status != null)
            {
                groupEventsWithUserStatus = groupEventsWithUserStatus.Where(x => x.CurrentUserStatus == groupEventParams.Status);
            }

            var result = groupEventsWithUserStatus
                .Select(g => new GroupEventDto
                {
                    Id = g.GroupEvent.Id,
                    FanGroupId = g.GroupEvent.FanGroupId,
                    Name = g.GroupEvent.Name,
                    Location = g.GroupEvent.Location,
                    EventStartTime = g.GroupEvent.EventStartTime,
                    EventEndTime = g.GroupEvent.EventEndTime,
                    Description = g.GroupEvent.Description!,
                    Photos = g.GroupEvent.Photos,
                    CurrentUserStatus = g.CurrentUserStatus,
                })
                .OrderByDescending(x => x.EventStartTime);

            return await PagedList<GroupEventDto>.CreateAsync(result, groupEventParams.PageNumber, groupEventParams.PageSize);
        }

        public async Task<GroupEventDto?> GetGroupEventDetailByIdAsync(Guid id, int currentUserId)
        {

            var evt = await context.GroupEvents
               .Where(x => x.Id == id && x.ActiveFlag == (byte)ActiveFlag.Active)
               .Include(x => x.Photos)
               .SingleOrDefaultAsync();

            if (evt == null) return null;

            var userStatus = await context.GroupEventUsers
                .Where(fgu => fgu.UserId == currentUserId && fgu.GroupEventId == id && fgu.ActiveFlag == (byte)ActiveFlag.Active)
                .Select(fgu => fgu.Status)
                .FirstOrDefaultAsync();

            var result = new GroupEventDto
            {
                Id = evt.Id,
                FanGroupId = evt.FanGroupId,
                Name = evt.Name,
                Location = evt.Location,
                EventStartTime = evt.EventStartTime,
                EventEndTime = evt.EventEndTime,
                Description = evt.Description ?? string.Empty,
                Photos = evt.Photos,
                CurrentUserStatus = userStatus,
            };

            return result;
        }

        public async Task<GroupEvent?> GetGroupEventByIdAsync(Guid id)
        {
            return await context.GroupEvents.SingleOrDefaultAsync(x => x.Id == id);
        }

        public Task<List<GroupEventDto>> GetIncomingGroupEventsAsync(int currentUserId)
        {
            var query = context.GroupEvents
                .Where(x => x.EventStartTime >= DateTime.Now || x.EventEndTime >= DateTime.Now)
                .AsQueryable();

            var groupEventsWithUserStatus = query
               .Join(context.GroupEventUsers
                       .Where(fgu => fgu.UserId == currentUserId && fgu.ActiveFlag == (byte)ActiveFlag.Active),
                   fg => fg.Id,
                   fgu => fgu.GroupEventId,
                   (fg, fgu) => new { GroupEvent = fg, CurrentUserStatus = fgu.Status })
               .DefaultIfEmpty()
               .Select(g => new GroupEventDto
               {
                   Id = g.GroupEvent.Id,
                   FanGroupId = g.GroupEvent.FanGroupId,
                   Name = g.GroupEvent.Name,
                   Location = g.GroupEvent.Location,
                   EventStartTime = g.GroupEvent.EventStartTime,
                   EventEndTime = g.GroupEvent.EventEndTime,
                   Description = g.GroupEvent.Description,
                   Photos = g.GroupEvent.Photos,
                   CurrentUserStatus = g.CurrentUserStatus
               })
               .OrderByDescending(x => x.EventStartTime)
               .ToListAsync();

            return groupEventsWithUserStatus;
        }
    }
}
