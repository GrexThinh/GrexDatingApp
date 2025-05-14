using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class GroupMessageHub(IUnitOfWork unitOfWork, IMapper mapper, IHubContext<PresenceHub> presenceHub) : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            string groupId = httpContext?.Request.Query["group"]!;

            if (groupId is null) throw new Exception("Group is null");

            var groupIdGuid = Guid.Parse(groupId);

            if (Context.User == null || groupIdGuid == Guid.Empty) throw new Exception("Cannot join group");

            var groupName = GetGroupName(groupId);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            var group = await AddToGroup(groupName);

            await Clients.Group(groupName).SendAsync("UpdatedGroup", group);

            var messages = await unitOfWork.GroupMessageRepository.GetMessageThread(groupIdGuid);

            if (unitOfWork.HasChanges()) await unitOfWork.Complete();
            
            await Clients.Caller.SendAsync("ReceiveMessageThread", messages);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var group = await RemoveFromMessageGroup();
            await Clients.Group(group.Name).SendAsync("UpdatedGroup", group);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(CreateGroupMessageDto createGroupMessageDto)
        {
            var username = Context.User?.GetUserName() ?? throw new Exception("Could not get user");

            var sender = await unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            var fanGroup = await unitOfWork.FanGroupRepository.GetFanGroupByIdAsync(createGroupMessageDto.FanGroupId);

            if (sender == null || sender.UserName == null || fanGroup == null) throw new HubException("Cannot send message at this time");

            var message = new GroupMessage
            {
                Sender = sender,
                FanGroup = fanGroup,
                Content = createGroupMessageDto.Content
            };

            var groupName = GetGroupName(fanGroup.Id.ToString());
            var group = await unitOfWork.GroupMessageRepository.GetMessageGroup(groupName);

            if (group != null && group.Connections.Any(x => x.Username == sender.UserName))
            {
                message.DateRead = DateTime.UtcNow;
            }
            else
            {
                var connections = await PresenceTracker.GetConnectionsForUser(sender.UserName);
                if (connections != null && connections?.Count() != null)
                {
                    await presenceHub.Clients.Clients(connections).SendAsync("NewMessageReceived",
                        new { username = sender.UserName, knownAs = sender.KnownAs });
                }
            }

            unitOfWork.GroupMessageRepository.AddMessage(message);

            if (await unitOfWork.Complete())
            {
               await Clients.Group(groupName).SendAsync("NewMessage", mapper.Map<GroupMessageDto>(message));
            }
        }

        private async Task<Group> AddToGroup(string groupName)
        {
            var username = Context.User?.GetUserName() ?? throw new Exception("Cannot get username");
            var group = await unitOfWork.GroupMessageRepository.GetMessageGroup(groupName);
            var connection = new Connection { ConnectionId = Context.ConnectionId, Username = username };

            if (group == null)
            {
                group = new Group { Name = groupName };
                unitOfWork.GroupMessageRepository.AddGroup(group);
            }

            group.Connections.Add(connection);

            if (await unitOfWork.Complete()) return group;

            throw new HubException("Failed to join group");
        }

        private async Task<Group> RemoveFromMessageGroup()
        {
            var group = await unitOfWork.GroupMessageRepository.GetGroupForConnection(Context.ConnectionId);

            var connection = group?.Connections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            if (connection != null && group != null)
            {
                unitOfWork.GroupMessageRepository.RemoveConnection(connection);
                if (await unitOfWork.Complete()) return group;
            }

            throw new Exception("Failed to remove from group");
        }

        private string GetGroupName(string groupId)
        {
            return groupId;
        }
    }
}
