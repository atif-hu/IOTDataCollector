using Microsoft.EntityFrameworkCore;
using backend.Models;
using System.Collections.Generic;

namespace backend.Database
{
    public class IOTDataCollectorDbContext : DbContext
    {
        public IOTDataCollectorDbContext(DbContextOptions<IOTDataCollectorDbContext> options)
            : base(options)
        {
        }

        public DbSet<UserRegister> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlite("Data Source=GroupMonitoringStation.db");
            }
        }
    }
}
