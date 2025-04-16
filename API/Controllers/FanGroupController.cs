using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using static API.ValueObjects.AppValue;

namespace API.Controllers
{
    public class FanGroupController(IUnitOfWork unitOfWork, IPhotoService photoService, IMapper mapper) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FanGroupDto>>> GetFanGroups([FromQuery] FanGroupParams groupParams)
        {
            int currentUserId = User.GetUserId();
            var groups = await unitOfWork.FanGroupRepository.GetFanGroupsAsync(groupParams, currentUserId);

            Response.AddPaginationHeader(groups);

            return Ok(groups);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FanGroupDto>> GetFanGroupById(string id)
        {
            if (!Guid.TryParse(id, out var groupId))
            {
                return BadRequest("Invalid ID format.");
            }

            var group = await unitOfWork.FanGroupRepository.GetFanGroupWithUserByIdAsync(groupId);

            if (group == null) return NotFound();

            return Ok(group);
        }

        [HttpPost]
        public async Task<ActionResult> CreateFanGroup([FromForm] FanGroupCreateDto grouptoCreate)
        {
            var group = mapper.Map<FanGroup>(grouptoCreate);
            if (grouptoCreate.GroupPhotos != null && grouptoCreate.GroupPhotos.Any())
            {
                foreach (var file in grouptoCreate.GroupPhotos)
                {
                    var result = await photoService.AddPhotoAsync(file.File, file.IsMainImage);

                    if (result.Error != null)
                        return BadRequest(result.Error.Message);

                    var photo = new Photo
                    {
                        Url = result.SecureUrl.AbsoluteUri,
                        PublicId = result.PublicId,
                        IsMain = file.IsMainImage,
                    };

                    group.Photos.Add(photo);
                }
            }

            group.ActiveFlag = (byte)ActiveFlag.Active;

            unitOfWork.FanGroupRepository.AddFanGroup(group);

            if (await unitOfWork.Complete())
            {
                var groupUser = new FanGroupUser
                {
                    FanGroupId = group.Id,
                    UserId = User.GetUserId(),
                    ActiveFlag = (byte)ActiveFlag.Active,
                    Status = GroupUserStatus.Joined,
                    Roles = new List<GroupRole> { GroupRole.Admin }
                };

                unitOfWork.FanGroupUserRepository.AddFanGroupUser(groupUser);

                if (await unitOfWork.Complete())
                    return Ok();
            }
            
            return BadRequest("Failed to create group");
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateGroup(string id, FanGroupUpdateDto groupUpdateDto)
        {
            if (!Guid.TryParse(id, out var groupId))
            {
                return BadRequest("Invalid ID format.");
            }

            var group = await unitOfWork.FanGroupRepository.GetFanGroupByIdAsync(groupId);

            if (group == null) return BadRequest("Could not find group");

            mapper.Map(groupUpdateDto, group);

            if (await unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to update the group");
        }

    }
}
