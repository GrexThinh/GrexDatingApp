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
            Moderator = 2,
            Member = 3,
        }
        public enum GroupUserStatus : byte
        {
            Waiting = 1,
            Joined = 2,
            Rejected = 3,
            Banned = 4,
        }
        public enum GroupEventUserStatus : byte
        {
            Waiting = 1,
            Joined = 2,
            Rejected = 3,
            Banned = 4,
            Interested = 5,
        }
        public enum GroupEventRole : byte
        {
            Host = 1,
            CoHost = 2,
            Member = 3,
        }
    }
}
