using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class updateGroupEvent6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "GroupEventId",
                table: "GroupEventComments",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_GroupEventComments_GroupEventId",
                table: "GroupEventComments",
                column: "GroupEventId");

            migrationBuilder.AddForeignKey(
                name: "FK_GroupEventComments_GroupEvents_GroupEventId",
                table: "GroupEventComments",
                column: "GroupEventId",
                principalTable: "GroupEvents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupEventComments_GroupEvents_GroupEventId",
                table: "GroupEventComments");

            migrationBuilder.DropIndex(
                name: "IX_GroupEventComments_GroupEventId",
                table: "GroupEventComments");

            migrationBuilder.DropColumn(
                name: "GroupEventId",
                table: "GroupEventComments");
        }
    }
}
