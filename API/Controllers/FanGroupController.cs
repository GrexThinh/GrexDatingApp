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
            var groups = await unitOfWork.FanGroupRepository.GetFanGroupsAsync(groupParams);

            Response.AddPaginationHeader(groups);

            return Ok(groups);
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

    }
}
