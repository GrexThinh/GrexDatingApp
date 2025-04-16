using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using static API.ValueObjects.AppValue;

namespace API.Data
{
    public class FanGroupRepository(DataContext context, IMapper mapper) : IFanGroupRepository
    {
        public void AddFanGroup(FanGroup group)
        {
           context.FanGroups.Add(group);
        }

        public async Task<FanGroupDto?> GetFanGroupWithUserByIdAsync(Guid id)
        {
            var fanGroup = await context.FanGroups
                .Include(x => x.Photos)
                .ProjectTo<FanGroupDto>(mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (fanGroup == null)
            {
                return null;
            }

            var groupUsers = context.FanGroupUsers
                .Where(gu => gu.FanGroupId == id)
                .Join(context.Users,
                    gu => gu.UserId,
                    u => u.Id,
                    (gu, u) => new { GroupUser = gu, User = u });

            fanGroup.Members = groupUsers.Select(g => new GroupMembersDto
            {
                Status = g.GroupUser.Status,
                Roles = g.GroupUser.Roles,
                Member = mapper.Map<MemberDto>(g.User)
            }).ToList(); 

            return fanGroup;
        }

        public async Task<PagedList<FanGroupDto>> GetFanGroupsAsync(FanGroupParams groupParams, int currentUserId)
        {
            var query = context.FanGroups.AsQueryable();

            if (groupParams.Type != null)
            {
                query = query.Where(x => x.Type.Contains(groupParams.Type));
            }

            if (groupParams.Location != null)
            {
                query = query.Where(x => x.Location.Contains(groupParams.Location));
            }

            var fanGroupsWithUserStatus = query
               .GroupJoin(context.FanGroupUsers.Where(fgu => fgu.UserId == currentUserId && fgu.ActiveFlag == (byte)ActiveFlag.Active),
                   fg => fg.Id,
                   fgu => fgu.FanGroupId,
                   (fg, userGroup) => new
                   {
                       FanGroup = fg,
                       CurrentUserStatus = userGroup.FirstOrDefault()!.Status
                   });

            if (groupParams.Status != null)
            {
                fanGroupsWithUserStatus = fanGroupsWithUserStatus.Where(x => x.CurrentUserStatus == groupParams.Status);
            }

            var result = fanGroupsWithUserStatus
                .Select(g => new FanGroupDto
                {
                    Id = g.FanGroup.Id,
                    Name = g.FanGroup.Name,
                    Type = g.FanGroup.Type,
                    Location = g.FanGroup.Location,
                    Description = g.FanGroup.Description!,
                    Photos = g.FanGroup.Photos,
                    CurrentUserStatus = g.CurrentUserStatus,
                });

            return await PagedList<FanGroupDto>.CreateAsync(result, groupParams.PageNumber, groupParams.PageSize);
        }

        public async Task<FanGroup?> GetFanGroupByIdAsync(Guid id)
        {
            return await context.FanGroups.SingleOrDefaultAsync(x => x.Id == id);
        }

        public void Update(FanGroup group)
        {
            context.Entry(group).State = EntityState.Modified;
        }
    }
}
