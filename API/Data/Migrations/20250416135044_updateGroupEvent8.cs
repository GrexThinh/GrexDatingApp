using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class updateGroupEvent8 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupEventComments_AspNetUsers_RecipientId",
                table: "GroupEventComments");

            migrationBuilder.DropIndex(
                name: "IX_GroupEventComments_RecipientId",
                table: "GroupEventComments");

            migrationBuilder.DropColumn(
                name: "RecipientDeleted",
                table: "GroupEventComments");

            migrationBuilder.DropColumn(
                name: "RecipientId",
                table: "GroupEventComments");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "RecipientDeleted",
                table: "GroupEventComments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "RecipientId",
                table: "GroupEventComments",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_GroupEventComments_RecipientId",
                table: "GroupEventComments",
                column: "RecipientId");

            migrationBuilder.AddForeignKey(
                name: "FK_GroupEventComments_AspNetUsers_RecipientId",
                table: "GroupEventComments",
                column: "RecipientId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
