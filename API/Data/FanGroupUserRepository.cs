using API.Entities;
using API.Interfaces;
using AutoMapper;

namespace API.Data
{
    public class FanGroupUserRepository(DataContext context) : IFanGroupUserRepository
    {
        public void AddFanGroupUser(FanGroupUser groupUser)
        {
            context.FanGroupUsers.Add(groupUser);
        }
    }
}
