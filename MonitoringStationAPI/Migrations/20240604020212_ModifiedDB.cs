using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MonitoringStationAPI.Migrations
{
    /// <inheritdoc />
    public partial class ModifiedDB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DataRangeMax",
                table: "SensorsData");

            migrationBuilder.DropColumn(
                name: "DataRangeMin",
                table: "SensorsData");

            migrationBuilder.DropColumn(
                name: "NormalThresholdMax",
                table: "SensorsData");

            migrationBuilder.DropColumn(
                name: "NormalThresholdMin",
                table: "SensorsData");

            migrationBuilder.RenameColumn(
                name: "Warning",
                table: "SensorsData",
                newName: "Alert");

            migrationBuilder.RenameColumn(
                name: "Parameter",
                table: "SensorsData",
                newName: "SensorName");

            migrationBuilder.AddColumn<string>(
                name: "DataCollectionInterval",
                table: "Sensors",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DataCollectionInterval",
                table: "Sensors");

            migrationBuilder.RenameColumn(
                name: "SensorName",
                table: "SensorsData",
                newName: "Parameter");

            migrationBuilder.RenameColumn(
                name: "Alert",
                table: "SensorsData",
                newName: "Warning");

            migrationBuilder.AddColumn<float>(
                name: "DataRangeMax",
                table: "SensorsData",
                type: "REAL",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "DataRangeMin",
                table: "SensorsData",
                type: "REAL",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "NormalThresholdMax",
                table: "SensorsData",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "NormalThresholdMin",
                table: "SensorsData",
                type: "REAL",
                nullable: true);
        }
    }
}
