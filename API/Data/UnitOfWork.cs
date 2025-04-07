using API.Interfaces;

namespace API.Data
{
    public class UnitOfWork(DataContext context, IUserRepository userRepository, IMessageRepository messageRepository, ILikesRepository likesRepository,
        IFanGroupRepository fanGroupRepository, IFanGroupUserRepository fanGroupUserRepository) : IUnitOfWork
    {
        public IUserRepository UserRepository => userRepository;

        public IMessageRepository MessageRepository => messageRepository;

        public ILikesRepository LikesRepository => likesRepository;

        public IFanGroupRepository FanGroupRepository => fanGroupRepository;
        public IFanGroupUserRepository FanGroupUserRepository => fanGroupUserRepository;

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
