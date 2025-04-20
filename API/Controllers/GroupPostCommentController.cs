using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using static API.ValueObjects.AppValue;

namespace API.Controllers
{
    public class GroupPostCommentController(IUnitOfWork unitOfWork, IMapper mapper) : BaseApiController
    {
        [HttpGet("{postId}")]
        public async Task<ActionResult<IList<GroupPostCommentDto>>> GetCommentsByPostId(string postId)
        {
            if (!Guid.TryParse(postId, out var groupPostId))
            {
                return BadRequest("Invalid ID format.");
            }

            var cmts = await unitOfWork.GroupPostCommentRepository.GetGroupPostCommentByPostIdAsync(groupPostId);

            return Ok(cmts);
        }

        [HttpPost]
        public async Task<ActionResult> AddGroupPostComment([FromBody] GroupPostCommentCreateParams commentParams)
        {
            var groupPost = await unitOfWork.GroupPostRepository.GetGroupPostByIdAsync(commentParams.GroupPostId);

            if (groupPost == null) return BadRequest("Could not find post");

            var comment = new GroupPostComment
            {
                GroupPostId = groupPost.Id,
                ParentId = commentParams.ParentId,
                Content = commentParams.Content,
                ActiveFlag = (byte)ActiveFlag.Active,
                CreateDate = DateTime.Now,
                SendDate = DateTime.Now,
                SenderId = commentParams.SenderId,
                SenderDeleted = false,
            };

            unitOfWork.GroupPostCommentRepository.AddGroupPostCommentAsync(comment);

            if (await unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to add comment in the post");
        }
    }
}
