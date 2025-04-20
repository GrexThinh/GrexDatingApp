using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using static API.ValueObjects.AppValue;

namespace API.Controllers
{
    public class GroupPostController(IUnitOfWork unitOfWork, IPhotoService photoService, IMapper mapper) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GroupPostDto>>> GetGroupPosts([FromQuery] GroupPostParams groupPostParams)
        {
            var userId = User.GetUserId();

            var groups = await unitOfWork.GroupPostRepository.GetGroupPostsAsync(groupPostParams, userId);

            Response.AddPaginationHeader(groups);

            return Ok(groups);
        }

        [HttpPost]
        public async Task<ActionResult> CreateGroupPost([FromForm] GroupPostCreateDto postToCreate)
        {
            var post = mapper.Map<GroupPost>(postToCreate);
            if (postToCreate.Files != null && postToCreate.Files.Any())
            {
                foreach (var file in postToCreate.Files)
                {
                    var result = await photoService.AddPhotoAsync(file, false);

                    if (result.Error != null)
                        return BadRequest(result.Error.Message);

                    var photo = new Photo
                    {
                        Url = result.SecureUrl.AbsoluteUri,
                        PublicId = result.PublicId,
                        IsMain = postToCreate.Files.Count() == 1,
                    };

                    post.Photos.Add(photo);
                }
            }

            post.ActiveFlag = (byte)ActiveFlag.Active;
            post.CreateDate = DateTime.Now;

            unitOfWork.GroupPostRepository.AddGroupPost(post);

            if (await unitOfWork.Complete())
                return Ok();

            return BadRequest("Failed to create post");
        }

    }
}
