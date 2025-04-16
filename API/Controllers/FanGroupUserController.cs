using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using static API.ValueObjects.AppValue;

namespace API.Controllers
{
    public class FanGroupUserController(IUnitOfWork unitOfWork) : BaseApiController
    {
        [HttpPost("{groupId}")]
        public async Task<ActionResult> CreateFanGroupUser(string groupId)
        {
            if (!Guid.TryParse(groupId, out var fanGroupId))
            {
                return BadRequest("Invalid ID format.");
            }

            var group = await unitOfWork.FanGroupRepository.GetFanGroupByIdAsync(fanGroupId);

            if (group == null) return NotFound();

            var userId = User.GetUserId();

            var groupUser = await unitOfWork.FanGroupUserRepository.GetFanGroupUserByGroupIdAndUserIdAsync(group.Id, userId);

            if (groupUser == null)
            {
                var newGroupUser = new FanGroupUser
                {
                    FanGroupId = group.Id,
                    UserId = userId,
                    ActiveFlag = (byte)ActiveFlag.Active,
                    Status = GroupUserStatus.Waiting,
                };

                unitOfWork.FanGroupUserRepository.AddFanGroupUser(newGroupUser);
            }
            else
            {
                if (groupUser.Status == GroupUserStatus.Rejected)
                {
                    groupUser.Status = GroupUserStatus.Waiting;
                }
                else
                {
                    return BadRequest("User can not join this group");
                }
            }

            if (await unitOfWork.Complete())
                return Ok();

            return BadRequest("Failed to create user in group");
        }

        [HttpDelete("{groupId}")]
        public async Task<ActionResult> DeleteFanGroupUser(string groupId)
        {
            if (!Guid.TryParse(groupId, out var fanGroupId))
            {
                return BadRequest("Invalid ID format.");
            }

            var userId = User.GetUserId();

            var groupUser = await unitOfWork.FanGroupUserRepository.GetFanGroupUserByGroupIdAndUserIdAsync(fanGroupId, userId);

            if (groupUser == null) return NotFound();

            unitOfWork.FanGroupUserRepository.DeleteFanGroupUser(groupUser);

            if (await unitOfWork.Complete())
                return Ok();

            return BadRequest("Failed to delete user in the group");
        }

        [HttpPost("role")]
        public async Task<ActionResult> UpdateFanGroupUserRole([FromBody] FanGroupUserRoleParams groupUserRoleParams)
        {
            var groupUser = await unitOfWork.FanGroupUserRepository.GetFanGroupUserByGroupIdAndUserIdAsync(groupUserRoleParams.GroupId, groupUserRoleParams.UserId);

            if (groupUser == null) return BadRequest("Could not find user in group");

            groupUser.Roles = groupUserRoleParams.Roles;

            if (await unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to update role user in the group");
        }

        [HttpPost("status")]
        public async Task<ActionResult> UpdateFanGroupUserStatus([FromBody] FanGroupUserStatusParams groupUserStatusParams)
        {
            var groupUser = await unitOfWork.FanGroupUserRepository.GetFanGroupUserByGroupIdAndUserIdAsync(groupUserStatusParams.GroupId, groupUserStatusParams.UserId);

            if (groupUser == null) return BadRequest("Could not find user in group");

            groupUser.Status = groupUserStatusParams.Status;
            groupUser.Roles = new List<GroupRole> { GroupRole.Member };

            if (await unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to update status user in the group");
        }
    }
}
