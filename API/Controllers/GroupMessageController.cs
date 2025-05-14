using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class GroupMessageController(IUnitOfWork unitOfWork, IMapper mapper) : BaseApiController
    {
        [HttpPost]
        public async Task<ActionResult<GroupMessageDto>> CreateMessage(CreateGroupMessageDto createGroupMessageDto)
        {
            var username = User.GetUserName();

            var sender = await unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            var group = await unitOfWork.FanGroupRepository.GetFanGroupByIdAsync(createGroupMessageDto.FanGroupId);

            if (sender == null || sender.UserName == null || group == null) return BadRequest("Cannot send message at this time");

            var message = new GroupMessage
            {
                Sender = sender,
                FanGroup = group,
                Content = createGroupMessageDto.Content
            };

            unitOfWork.GroupMessageRepository.AddMessage(message);

            if (await unitOfWork.Complete()) return Ok(mapper.Map<GroupMessageDto>(message));

            return BadRequest("Failed to save message");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GroupMessageDto>>> GetMessagesForUser([FromQuery] MessageParams messageParams)
        {
            messageParams.Username = User.GetUserName();

            var messages = await unitOfWork.GroupMessageRepository.GetMessagesForUser(messageParams);

            Response.AddPaginationHeader(messages);

            return messages;
        }

        [HttpGet("thread/{fanGroupId}")]
        public async Task<ActionResult<IEnumerable<GroupMessageDto>>> GetMessageThread(Guid fanGroupId)
        {
            return Ok(await unitOfWork.GroupMessageRepository.GetMessageThread(fanGroupId));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var userId = User.GetUserId();

            var message = await unitOfWork.GroupMessageRepository.GetMessage(id);

            if (message == null) return BadRequest("Cannot delete this message");

            if (message.SenderId != userId) return Forbid();

            if (message.SenderId == userId) message.SenderDeleted = true;

            if (message is { SenderDeleted: true })
            {
                unitOfWork.GroupMessageRepository.DeleteMessage(message);
            }

            if (await unitOfWork.Complete()) return Ok();

            return BadRequest("Problem deleting the message");
        }
    }
}
