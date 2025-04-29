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
            var events = await unitOfWork.GroupEventRepository.GetGroupEventsAsync(groupEventParams, currentUserId);

            Response.AddPaginationHeader(events);

            return Ok(events);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GroupEventDto>> GetGroupEventDetailById(Guid id)
        {
            int currentUserId = User.GetUserId();
            var evt = await unitOfWork.GroupEventRepository.GetGroupEventDetailByIdAsync(id, currentUserId);

            return Ok(evt);
        }

        [HttpGet("incoming")]
        public async Task<ActionResult<IEnumerable<GroupEventDto>>> GetIncomingGroupEvents()
        {
            int currentUserId = User.GetUserId();
            var events = await unitOfWork.GroupEventRepository.GetIncomingGroupEventsAsync(currentUserId);

            return Ok(events);
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


        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateGroupEvent(string id, GroupEventUpdateDto eventUpdateDto)
        {
            if (!Guid.TryParse(id, out var eventId))
            {
                return BadRequest("Invalid ID format.");
            }

            var evt = await unitOfWork.GroupEventRepository.GetGroupEventByIdAsync(eventId);

            if (evt == null) return BadRequest("Could not find event");

            mapper.Map(eventUpdateDto, evt);

            if (await unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to update the event");
        }
    }
}
