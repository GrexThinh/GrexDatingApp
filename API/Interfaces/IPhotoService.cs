﻿using CloudinaryDotNet.Actions;

namespace API.Interfaces
{
    public interface IPhotoService
    {
        Task<ImageUploadResult> AddPhotoAsync(IFormFile file, bool isAvatar);
        Task<DeletionResult> DeletePhotoAsync(string publicId);
    }
}
