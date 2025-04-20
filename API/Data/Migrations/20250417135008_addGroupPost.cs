using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class addGroupPost : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "GroupPostId",
                table: "Photos",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FanGroupId",
                table: "GroupEvents",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "GroupPosts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    FanGroupId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ActiveFlag = table.Column<byte>(type: "tinyint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupPosts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GroupPosts_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GroupPosts_FanGroups_FanGroupId",
                        column: x => x.FanGroupId,
                        principalTable: "FanGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GroupPostComments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GroupPostId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SendDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SenderId = table.Column<int>(type: "int", nullable: false),
                    ParentId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    SenderDeleted = table.Column<bool>(type: "bit", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ActiveFlag = table.Column<byte>(type: "tinyint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupPostComments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GroupPostComments_AspNetUsers_SenderId",
                        column: x => x.SenderId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GroupPostComments_GroupPostComments_ParentId",
                        column: x => x.ParentId,
                        principalTable: "GroupPostComments",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GroupPostComments_GroupPosts_GroupPostId",
                        column: x => x.GroupPostId,
                        principalTable: "GroupPosts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Photos_GroupPostId",
                table: "Photos",
                column: "GroupPostId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupEvents_FanGroupId",
                table: "GroupEvents",
                column: "FanGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupPostComments_GroupPostId",
                table: "GroupPostComments",
                column: "GroupPostId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupPostComments_ParentId",
                table: "GroupPostComments",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupPostComments_SenderId",
                table: "GroupPostComments",
                column: "SenderId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupPosts_FanGroupId",
                table: "GroupPosts",
                column: "FanGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupPosts_UserId",
                table: "GroupPosts",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_GroupEvents_FanGroups_FanGroupId",
                table: "GroupEvents",
                column: "FanGroupId",
                principalTable: "FanGroups",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_GroupPosts_GroupPostId",
                table: "Photos",
                column: "GroupPostId",
                principalTable: "GroupPosts",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupEvents_FanGroups_FanGroupId",
                table: "GroupEvents");

            migrationBuilder.DropForeignKey(
                name: "FK_Photos_GroupPosts_GroupPostId",
                table: "Photos");

            migrationBuilder.DropTable(
                name: "GroupPostComments");

            migrationBuilder.DropTable(
                name: "GroupPosts");

            migrationBuilder.DropIndex(
                name: "IX_Photos_GroupPostId",
                table: "Photos");

            migrationBuilder.DropIndex(
                name: "IX_GroupEvents_FanGroupId",
                table: "GroupEvents");

            migrationBuilder.DropColumn(
                name: "GroupPostId",
                table: "Photos");

            migrationBuilder.DropColumn(
                name: "FanGroupId",
                table: "GroupEvents");
        }
    }
}
