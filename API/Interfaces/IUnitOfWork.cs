namespace API.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository { get; }
        IMessageRepository MessageRepository { get; }
        ILikesRepository LikesRepository { get; }
        IFanGroupRepository FanGroupRepository { get; }
        IFanGroupUserRepository FanGroupUserRepository { get; }
        Task<bool> Complete();
        bool HasChanges();
    }
}
