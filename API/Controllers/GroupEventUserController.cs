using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using static API.ValueObjects.AppValue;

namespace API.Controllers
{
    public class GroupEventUserController(IUnitOfWork unitOfWork) : BaseApiController
    {
        [HttpPost("{eventId}/{status}")]
        public async Task<ActionResult> CreateGroupEventUser(string eventId, GroupEventUserStatus status)
        {
            if (!Guid.TryParse(eventId, out var groupEventId))
            {
                return BadRequest("Invalid ID format.");
            }

            var evt = await unitOfWork.GroupEventRepository.GetGroupEventByIdAsync(groupEventId);

            if (evt == null) return NotFound();

            var userId = User.GetUserId();

            var evtUser = await unitOfWork.GroupEventUserRepository.GetGroupEventUserByEventIdAndUserIdAsync(evt.Id, userId);

            if (evtUser == null)
            {
                var newEventUser = new GroupEventUser
                {
                    GroupEventId = evt.Id,
                    UserId = userId,
                    ActiveFlag = (byte)ActiveFlag.Active,
                    Status = status,
                    CreateDate = DateTime.Now
                };

                unitOfWork.GroupEventUserRepository.AddGroupEventUser(newEventUser);
            }
            else
            {
                if (evtUser.Status == GroupEventUserStatus.Rejected || evtUser.Status == GroupEventUserStatus.Interested)
                {
                    evtUser.Status = status;
                }
                else
                {
                    return BadRequest("User can not join the event");
                }
            }

            if (await unitOfWork.Complete())
                return Ok();

            return BadRequest("Failed to create user in the event");
        }

        [HttpDelete("{eventId}")]
        public async Task<ActionResult> DeleteGroupEventUser(string eventId)
        {
            if (!Guid.TryParse(eventId, out var groupEventId))
            {
                return BadRequest("Invalid ID format.");
            }

            var userId = User.GetUserId();

            var evtUser = await unitOfWork.GroupEventUserRepository.GetGroupEventUserByEventIdAndUserIdAsync(groupEventId, userId);

            if (evtUser == null) return NotFound();

            unitOfWork.GroupEventUserRepository.DeleteGroupEventUser(evtUser);

            if (await unitOfWork.Complete())
                return Ok();

            return BadRequest("Failed to delete user in the event");
        }

        [HttpPost("status")]
        public async Task<ActionResult> UpdateGroupEventUserStatus([FromBody] GroupEventUserStatusParams groupEventUserStatusParams)
        {
            var evtUser = await unitOfWork.GroupEventUserRepository.GetGroupEventUserByEventIdAndUserIdAsync(groupEventUserStatusParams.EventId, groupEventUserStatusParams.UserId);

            if (evtUser == null) return BadRequest("Could not find user in event");

            evtUser.Status = groupEventUserStatusParams.Status;
            if (groupEventUserStatusParams.Status == GroupEventUserStatus.Joined)
                evtUser.Roles = new List<GroupEventRole> { GroupEventRole.Member };

            if (await unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to update status user in the event");
        }

    }
}
