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
    public class GroupPostRepository(DataContext context, IMapper mapper) : IGroupPostRepository
    {
        public void AddGroupPost(GroupPost evt)
        {
           context.GroupPosts.Add(evt);
        }

        public async Task<PagedList<GroupPostDto>> GetGroupPostsAsync(GroupPostParams groupPostParams, int currentUserId)
        {
            var query = context.GroupPosts.AsQueryable();

            if (groupPostParams.Content != null)
            {
                query = query.Where(x => x.Content.ToLower().Contains(groupPostParams.Content.ToLower()));
            }

            if (groupPostParams.PostStartTime != null)
            {
                query = query.Where(x => x.CreateDate >= groupPostParams.PostStartTime);
            }

            if (groupPostParams.PostEndTime != null)
            {
                query = query.Where(x => x.CreateDate <= groupPostParams.PostEndTime);
            }

            var result = query.OrderByDescending(x => x.CreateDate)
                .Include(x => x.User)
                .Include(x => x.FanGroup)
                .Include(x => x.Comments)
                .Include(x => x.Reactions)
                .GroupJoin(context.GroupPostReactions.Where(pr => pr.ReacterId == currentUserId && pr.ActiveFlag == (byte)ActiveFlag.Active),
                p => p.Id,
                pr => pr.GroupPostId,
                (p, pr) => new
                {
                    GroupPost = p,
                    ReactionByCurrentUser = pr.FirstOrDefault()!.ReactionType,
                })
                .Select(x => new GroupPostDto
                {
                    Id = x.GroupPost.Id,
                    Content = x.GroupPost.Content,
                    UserId = x.GroupPost.UserId,
                    User = mapper.Map<MemberDto>(x.GroupPost.User),
                    FanGroupId = x.GroupPost.FanGroupId,
                    FanGroup = mapper.Map<FanGroupDto>(x.GroupPost.FanGroup),
                    Description = x.GroupPost.Description,
                    CreateDate = x.GroupPost.CreateDate,
                    UpdateDate = x.GroupPost.UpdateDate,
                    Photos = x.GroupPost.Photos,
                    Comments = x.GroupPost.Comments,
                    Reactions = x.GroupPost.Reactions,
                    ReactionByCurrentUser = x.ReactionByCurrentUser,
                });

            return await PagedList<GroupPostDto>.CreateAsync(result, groupPostParams.PageNumber, groupPostParams.PageSize);
        }

        public async Task<GroupPost?> GetGroupPostByIdAsync(Guid id)
        {
            return await context.GroupPosts.SingleOrDefaultAsync(x => x.Id == id);
        }
    }
}
