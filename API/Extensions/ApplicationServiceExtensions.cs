using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
using API.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                }
            );
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlServer(config.GetConnectionString("DefaultConnection"));
            });
            services.AddCors();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<ILikesRepository, LikesRepository>();
            services.AddScoped<IPhotoService, PhotoService>();
            services.AddScoped<IMessageRepository, MessageRepository>();
            services.AddScoped<IFanGroupRepository, FanGroupRepository>();
            services.AddScoped<IFanGroupUserRepository, FanGroupUserRepository>();
            services.AddScoped<IGroupEventRepository, GroupEventRepository>();
            services.AddScoped<IGroupEventUserRepository, GroupEventUserRepository>();
            services.AddScoped<IGroupEventCommentRepository, GroupEventCommentRepository>();
            services.AddScoped<IGroupPostRepository, GroupPostRepository>();
            services.AddScoped<IGroupPostCommentRepository, GroupPostCommentRepository>();
            services.AddScoped<IGroupPostReactionRepository, GroupPostReactionRepository>();
            services.AddScoped<IGroupMessageRepository, GroupMessageRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<LogUserActivity>();
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
            services.AddSignalR();
            services.AddSingleton<PresenceTracker>();

            return services;
        }
    }
}
