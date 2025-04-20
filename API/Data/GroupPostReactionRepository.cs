using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using static API.ValueObjects.AppValue;

namespace API.Data
{
    public class GroupPostReactionRepository(DataContext context, IMapper mapper) : IGroupPostReactionRepository
    {
        public void AddGroupPostReactionAsync(GroupPostReaction reaction)
        {
            context.GroupPostReactions.Add(reaction);
        }

        public void DeleteGroupPostReactionAsync(GroupPostReaction reaction)
        {
            context.GroupPostReactions.Remove(reaction);
        }

        public async Task<GroupPostReaction?> GetGroupPostReactionByPostIdAndUserIdAsync(Guid postId, int userId)
        {
            return await context.GroupPostReactions.SingleOrDefaultAsync(x => x.GroupPostId == postId && x.ReacterId == userId && x.ActiveFlag == (byte)ActiveFlag.Active);
        }

        public async Task<IList<GroupPostReactionDto>> GetGroupPostReactionByPostIdAsync(Guid postId)
        {
            return await context.GroupPostReactions
                .Where(x => x.GroupPostId == postId && x.ActiveFlag == (byte)ActiveFlag.Active)
                .OrderByDescending(x => x.ReactionDate)
                .Include(x => x.Reacter)
                .ProjectTo<GroupPostReactionDto>(mapper.ConfigurationProvider)
                .ToListAsync();
        }
    }
}
