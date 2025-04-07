using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace API.Data
{
    public class FanGroupRepository(DataContext context, IMapper mapper) : IFanGroupRepository
    {
        public void AddFanGroup(FanGroup group)
        {
           context.FanGroups.Add(group);
        }

        public async Task<PagedList<FanGroupDto>> GetFanGroupsAsync(FanGroupParams groupParams)
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

            var fanGroupsWithUserCount = query
                .Select(fg => new
                {
                    FanGroup = fg,
                    UserCount = context.FanGroupUsers
                        .Where(fgu => fgu.FanGroupId == fg.Id)
                        .Count()
                });

            if (groupParams.MinNumberOfMembers.HasValue)
            {
                fanGroupsWithUserCount = fanGroupsWithUserCount
                    .Where(fg => fg.UserCount >= groupParams.MinNumberOfMembers.Value);
            }

            return await PagedList<FanGroupDto>.CreateAsync(fanGroupsWithUserCount.Select(fg => fg.FanGroup).ProjectTo<FanGroupDto>(mapper.ConfigurationProvider),
                groupParams.PageNumber, groupParams.PageSize);
        }
    }
}
