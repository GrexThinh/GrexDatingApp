using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IGroupMessageRepository
    {
        void AddMessage(GroupMessage message);
        void DeleteMessage(GroupMessage message);
        Task<GroupMessage?> GetMessage(int id);
        Task<PagedList<GroupMessageDto>> GetMessagesForUser(MessageParams messageParams);
        Task<IEnumerable<GroupMessageDto>> GetMessageThread(Guid fanGroupId);
        void AddGroup(Group group);
        void RemoveConnection(Connection connection);
        Task<Connection?> GetConnection(string connectionId);
        Task<Group?> GetMessageGroup(string groupName);
        Task<Group?> GetGroupForConnection(string connectionId);

    }
}
