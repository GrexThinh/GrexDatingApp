namespace API.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository { get; }
        IMessageRepository MessageRepository { get; }
        ILikesRepository LikesRepository { get; }
        IFanGroupRepository FanGroupRepository { get; }
        IFanGroupUserRepository FanGroupUserRepository { get; }
        IGroupEventRepository GroupEventRepository { get; }
        IGroupEventUserRepository GroupEventUserRepository { get; }
        IGroupEventCommentRepository GroupEventCommentRepository { get; }
        IGroupPostRepository GroupPostRepository { get; }
        IGroupPostCommentRepository GroupPostCommentRepository { get; }
        IGroupPostReactionRepository GroupPostReactionRepository { get; }
        Task<bool> Complete();
        bool HasChanges();
    }
}
