using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using static API.ValueObjects.AppValue;

namespace API.Controllers
{
    public class GroupPostReactionController(IUnitOfWork unitOfWork, IMapper mapper) : BaseApiController
    {
        [HttpGet("{postId}")]
        public async Task<ActionResult<IList<GroupPostReactionDto>>> GetReactionsByPostId(string postId)
        {
            if (!Guid.TryParse(postId, out var groupPostId))
            {
                return BadRequest("Invalid ID format.");
            }

            var reacts = await unitOfWork.GroupPostReactionRepository.GetGroupPostReactionByPostIdAsync(groupPostId);

            return Ok(reacts);
        }

        [HttpGet("me/reaction/{postId}")]
        public async Task<ActionResult> AddGroupPostReaction(string postId)
        {
            if (!Guid.TryParse(postId, out var groupPostId))
            {
                return BadRequest("Invalid ID format.");
            }

            var userId = User.GetUserId();

            var reaction = await unitOfWork.GroupPostReactionRepository.GetGroupPostReactionByPostIdAndUserIdAsync(groupPostId, userId);

            if (reaction == null)
            {
                GroupPostReaction newReaction = new()
                {
                    GroupPostId = groupPostId,
                    ReactionDate = DateTime.Now,
                    ReacterId = userId,
                    ReactionType = ReactionType.Love,
                    ActiveFlag = (byte)ActiveFlag.Active,
                    CreateDate = DateTime.Now
                };
                unitOfWork.GroupPostReactionRepository.AddGroupPostReactionAsync(newReaction);
            }
            else
            {
                unitOfWork.GroupPostReactionRepository.DeleteGroupPostReactionAsync(reaction);
            }

            if (await unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to react in the post");
        }

        [HttpPost]
        public async Task<ActionResult> AddGroupPostReaction([FromBody] GroupPostReactionCreateParams reactionParams)
        {
            var groupPost = await unitOfWork.GroupPostRepository.GetGroupPostByIdAsync(reactionParams.GroupPostId);

            if (groupPost == null) return BadRequest("Could not find post");

            var reaction = new GroupPostReaction
            {
                GroupPostId = groupPost.Id,
                ActiveFlag = (byte)ActiveFlag.Active,
                CreateDate = DateTime.Now,
                ReactionDate = DateTime.Now,
                ReacterId = reactionParams.SenderId,
            };

            unitOfWork.GroupPostReactionRepository.AddGroupPostReactionAsync(reaction);

            if (await unitOfWork.Complete()) return NoContent();

            return BadRequest("Failed to react in the post");
        }
    }
}
