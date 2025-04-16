using API.Interfaces;

namespace API.Data
{
    public class UnitOfWork(DataContext context, IUserRepository userRepository, IMessageRepository messageRepository, ILikesRepository likesRepository,
        IFanGroupRepository fanGroupRepository, IFanGroupUserRepository fanGroupUserRepository, IGroupEventRepository groupEventRepository, IGroupEventUserRepository groupEventUserRepository, IGroupEventCommentRepository groupEventCommentRepository) : IUnitOfWork
    {
        public IUserRepository UserRepository => userRepository;

        public IMessageRepository MessageRepository => messageRepository;

        public ILikesRepository LikesRepository => likesRepository;

        public IFanGroupRepository FanGroupRepository => fanGroupRepository;
        public IFanGroupUserRepository FanGroupUserRepository => fanGroupUserRepository;
        public IGroupEventRepository GroupEventRepository => groupEventRepository;
        public IGroupEventUserRepository GroupEventUserRepository => groupEventUserRepository;
        public IGroupEventCommentRepository GroupEventCommentRepository => groupEventCommentRepository;

        public async Task<bool> Complete()
        {
            return await context.SaveChangesAsync() > 0;
        }

        public bool HasChanges()
        {
            return context.ChangeTracker.HasChanges();
        }
    }
}
