namespace API.ValueObjects
{
    public class AppValue
    {
        public enum ActiveFlag : byte
        {
            Active = 1,
            Deactive = 2,
            Delete = 3
        }
        public enum GroupRole : byte
        {
            Admin = 1,
            Member = 2,
            Moderator = 3
        }
        public enum GroupUserStatus : byte
        {
            Waiting = 1,
            Joined = 2,
            Banned = 3,
        }
    }
}
