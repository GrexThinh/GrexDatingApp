using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class updateGroupEvent5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupEventComments_GroupEventComments_ParentCommentId",
                table: "GroupEventComments");

            migrationBuilder.RenameColumn(
                name: "ParentCommentId",
                table: "GroupEventComments",
                newName: "ParentId");

            migrationBuilder.RenameIndex(
                name: "IX_GroupEventComments_ParentCommentId",
                table: "GroupEventComments",
                newName: "IX_GroupEventComments_ParentId");

            migrationBuilder.AddColumn<string>(
                name: "Roles",
                table: "GroupEventUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "[]");

            migrationBuilder.AlterColumn<DateTime>(
                name: "EventStartTime",
                table: "GroupEvents",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateTime>(
                name: "EventEndTime",
                table: "GroupEvents",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddForeignKey(
                name: "FK_GroupEventComments_GroupEventComments_ParentId",
                table: "GroupEventComments",
                column: "ParentId",
                principalTable: "GroupEventComments",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupEventComments_GroupEventComments_ParentId",
                table: "GroupEventComments");

            migrationBuilder.DropColumn(
                name: "Roles",
                table: "GroupEventUsers");

            migrationBuilder.RenameColumn(
                name: "ParentId",
                table: "GroupEventComments",
                newName: "ParentCommentId");

            migrationBuilder.RenameIndex(
                name: "IX_GroupEventComments_ParentId",
                table: "GroupEventComments",
                newName: "IX_GroupEventComments_ParentCommentId");

            migrationBuilder.AlterColumn<DateTime>(
                name: "EventStartTime",
                table: "GroupEvents",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "EventEndTime",
                table: "GroupEvents",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_GroupEventComments_GroupEventComments_ParentCommentId",
                table: "GroupEventComments",
                column: "ParentCommentId",
                principalTable: "GroupEventComments",
                principalColumn: "Id");
        }
    }
}
