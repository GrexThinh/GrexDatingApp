using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class updateGroupEvent4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "GroupEventId",
                table: "Photos",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "GroupEventComments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SendDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SenderId = table.Column<int>(type: "int", nullable: false),
                    RecipientId = table.Column<int>(type: "int", nullable: false),
                    ParentCommentId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    SenderDeleted = table.Column<bool>(type: "bit", nullable: false),
                    RecipientDeleted = table.Column<bool>(type: "bit", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ActiveFlag = table.Column<byte>(type: "tinyint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupEventComments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GroupEventComments_AspNetUsers_RecipientId",
                        column: x => x.RecipientId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GroupEventComments_AspNetUsers_SenderId",
                        column: x => x.SenderId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GroupEventComments_GroupEventComments_ParentCommentId",
                        column: x => x.ParentCommentId,
                        principalTable: "GroupEventComments",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "GroupEvents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EventStartTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EventEndTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Location = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ActiveFlag = table.Column<byte>(type: "tinyint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupEvents", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GroupEventUsers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GroupEventId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    JoinDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<byte>(type: "tinyint", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ActiveFlag = table.Column<byte>(type: "tinyint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupEventUsers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GroupEventUsers_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GroupEventUsers_GroupEvents_GroupEventId",
                        column: x => x.GroupEventId,
                        principalTable: "GroupEvents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Photos_GroupEventId",
                table: "Photos",
                column: "GroupEventId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupEventComments_ParentCommentId",
                table: "GroupEventComments",
                column: "ParentCommentId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupEventComments_RecipientId",
                table: "GroupEventComments",
                column: "RecipientId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupEventComments_SenderId",
                table: "GroupEventComments",
                column: "SenderId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupEventUsers_GroupEventId",
                table: "GroupEventUsers",
                column: "GroupEventId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupEventUsers_UserId",
                table: "GroupEventUsers",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_GroupEvents_GroupEventId",
                table: "Photos",
                column: "GroupEventId",
                principalTable: "GroupEvents",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_GroupEvents_GroupEventId",
                table: "Photos");

            migrationBuilder.DropTable(
                name: "GroupEventComments");

            migrationBuilder.DropTable(
                name: "GroupEventUsers");

            migrationBuilder.DropTable(
                name: "GroupEvents");

            migrationBuilder.DropIndex(
                name: "IX_Photos_GroupEventId",
                table: "Photos");

            migrationBuilder.DropColumn(
                name: "GroupEventId",
                table: "Photos");
        }
    }
}
