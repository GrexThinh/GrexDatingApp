using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class GroupMessageRepository(DataContext context, IMapper mapper) : IGroupMessageRepository
    {
        public void AddGroup(Group group)
        {
            context.Groups.Add(group);
        }

        public void AddMessage(GroupMessage message)
        {
            context.GroupMessages.Add(message);
        }

        public void DeleteMessage(GroupMessage message)
        {
            context.GroupMessages.Remove(message);
        }

        public async Task<Connection?> GetConnection(string connectionId)
        {
            return await context.Connections.FindAsync(connectionId);
        }

        public async Task<Group?> GetGroupForConnection(string connectionId)
        {
            return await context.Groups
                .Include(x => x.Connections)
                .Where(x => x.Connections.Any(c => c.ConnectionId == connectionId))
                .FirstOrDefaultAsync();
        }

        public async Task<GroupMessage?> GetMessage(int id)
        {
            return await context.GroupMessages.FindAsync(id);
        }

        public async Task<Group?> GetMessageGroup(string groupName)
        {
            return await context.Groups.Include(x => x.Connections)
                .FirstOrDefaultAsync(x => x.Name == groupName);
        }

        public async Task<PagedList<GroupMessageDto>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = context.GroupMessages
                .OrderByDescending(x => x.MessageSent)
                .Include(x => x.Sender)
                .AsQueryable();

            query = messageParams.Container switch
            {
                "Inbox" => query.Where(x => true),
                "Outbox" => query.Where(x => x.Sender.UserName == messageParams.Username && x.SenderDeleted == false),
                _ => query.Where(x => x.DateRead == null)
            };

            var messages = query.ProjectTo<GroupMessageDto>(mapper.ConfigurationProvider);

            return await PagedList<GroupMessageDto>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<GroupMessageDto>> GetMessageThread(Guid fanGroupId)
        {
            var query = context.GroupMessages
                .Where(x => x.FanGroupId == fanGroupId && x.SenderDeleted == false)
                .OrderBy(x => x.MessageSent)
                .Include(x => x.Sender)
                .AsQueryable();

            var unreadMessages = query.Where(x => x.DateRead == null).ToList();

            if (unreadMessages.Count != 0)
            {
                unreadMessages.ForEach(x => x.DateRead = DateTime.UtcNow);
            }

            return await query.ProjectTo<GroupMessageDto>(mapper.ConfigurationProvider).ToListAsync();
        }

        public void RemoveConnection(Connection connection)
        {
            context.Connections.Remove(connection);
        }
    }
}
