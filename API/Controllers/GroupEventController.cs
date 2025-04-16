using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using static API.ValueObjects.AppValue;

namespace API.Controllers
{
    public class GroupEventController(IUnitOfWork unitOfWork, IPhotoService photoService, IMapper mapper) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GroupEventDto>>> GetGroupEvents([FromQuery] GroupEventParams groupEventParams)
        {
            int currentUserId = User.GetUserId();
            var groups = await unitOfWork.GroupEventRepository.GetGroupEventsAsync(groupEventParams, currentUserId);

            Response.AddPaginationHeader(groups);

            return Ok(groups);
        }

        [HttpPost]
        public async Task<ActionResult> CreateGroupEvent([FromForm] GroupEventCreateDto eventToCreate)
        {
            var evt = mapper.Map<GroupEvent>(eventToCreate);
            if (eventToCreate.Files != null && eventToCreate.Files.Any())
            {
                foreach (var file in eventToCreate.Files)
                {
                    var result = await photoService.AddPhotoAsync(file, false);

                    if (result.Error != null)
                        return BadRequest(result.Error.Message);

                    var photo = new Photo
                    {
                        Url = result.SecureUrl.AbsoluteUri,
                        PublicId = result.PublicId,
                        IsMain = eventToCreate.Files.Count() == 1,
                    };

                    evt.Photos.Add(photo);
                }
            }

            evt.ActiveFlag = (byte)ActiveFlag.Active;
            evt.CreateDate = DateTime.Now;

            unitOfWork.GroupEventRepository.AddGroupEvent(evt);

            if (await unitOfWork.Complete())
            {
                var evtUser = new GroupEventUser
                {
                    GroupEventId = evt.Id,
                    UserId = User.GetUserId(),
                    ActiveFlag = (byte)ActiveFlag.Active,
                    Status = GroupEventUserStatus.Joined,
                    Roles = new List<GroupEventRole> { GroupEventRole.Host },
                    CreateDate = DateTime.Now
                };

                unitOfWork.GroupEventUserRepository.AddGroupEventUser(evtUser);

                if (await unitOfWork.Complete())
                    return Ok();
            }
            
            return BadRequest("Failed to create event");
        }

    }
}
