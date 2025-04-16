using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using static API.ValueObjects.AppValue;

namespace API.Controllers
{
    public class GroupEventCommentController(IUnitOfWork unitOfWork, IMapper mapper) : BaseApiController
    {
        [HttpGet("{eventId}")]
        public async Task<ActionResult<IList<GroupEventCommentDto>>> GetCommentsByEventId(string eventId, GroupEventUserStatus status)
        {
            if (!Guid.TryParse(eventId, out var groupEventId))
            {
                return BadRequest("Invalid ID format.");
            }

            var cmts = await unitOfWork.GroupEventCommentRepository.GetGroupEventCommentByEventIdAsync(groupEventId);

            return Ok(cmts);
        }

        [HttpPost]
        public async Task<ActionResult> AddGroupEventComment([FromBody] GroupEventCommentCreateParams commentParams)
        {
            var groupEvent = await unitOfWork.GroupEventRepository.GetGroupEventByIdAsync(commentParams.GroupEventId);

            if (groupEvent == null) return BadRequest("Could not find event");

            var comment = new GroupEventComment
            {
                GroupEventId = groupEvent.Id,
                ParentId = commentParams.ParentId,
                Content = commentParams.Content,
                ActiveFlag = (byte)ActiveFlag.Active,
                CreateDate = DateTime.Now,
                SendDate = DateTime.Now,
                SenderId = commentParams.SenderId,
                SenderDeleted = false,
            };

            unitOfWork.GroupEventCommentRepository.AddGroupEventCommentAsync(comment);

            if (await unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to add comment in the event");
        }
    }
}
