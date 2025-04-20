using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using static API.ValueObjects.AppValue;

namespace API.Data
{
    public class GroupPostCommentRepository(DataContext context, IMapper mapper) : IGroupPostCommentRepository
    {
        public void AddGroupPostCommentAsync(GroupPostComment comment)
        {
            context.GroupPostComments.Add(comment);
        }

        public async Task<IList<GroupPostCommentDto>> GetGroupPostCommentByPostIdAsync(Guid postId)
        {
            return await context.GroupPostComments
                .Where(x => x.GroupPostId == postId && x.ActiveFlag == (byte)ActiveFlag.Active)
                .OrderByDescending(x => x.SendDate)
                .Include(x => x.Sender)
                .ProjectTo<GroupPostCommentDto>(mapper.ConfigurationProvider)
                .ToListAsync();
        }
    }
}
