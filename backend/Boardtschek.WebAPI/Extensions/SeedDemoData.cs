using Boardtschek.Data;
using Boardtschek.Data.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Boardtschek.WebAPI.Extensions
{
    public static class SeedDemoData
    {
        public static async Task SeedDemoDataAsync(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<BoardtschekDbContext>();
            var users = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
            var roles = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();

            // Seed ONLY when using SQLite
            var provider = db.Database.ProviderName;
            if (provider == null || !provider.Contains("Sqlite", StringComparison.OrdinalIgnoreCase))
                return;

            // Admin
            const string adminEmail = "admin@demo.com";
            const string adminPass = "Admin123!";
            const string adminRole = "Administrator";

            if (!await roles.RoleExistsAsync(adminRole))
                await roles.CreateAsync(new IdentityRole<Guid>(adminRole));

            var admin = await users.FindByEmailAsync(adminEmail);
            if (admin == null)
            {
                admin = new AppUser
                {
                    Email = adminEmail,
                    UserName = adminEmail,
                    FirstName = "Demo",
                    LastName = "Admin",
                    EmailConfirmed = true
                };

                await users.CreateAsync(admin, adminPass);
                await users.AddToRoleAsync(admin, adminRole);
            }

            // Skip if already seeded
            if (await db.Games.AnyAsync())
                return;

            var games = new List<Game>
            {
                new() { Title = "Catan", Description = "Trade, build, settle", ImageUrl="https://i.imgur.com/3QY1qZj.jpeg" },
                new() { Title = "Ticket to Ride", Description = "Railway strategy board game", ImageUrl="https://i.imgur.com/Tx9yrQH.jpeg" },
                new() { Title = "Carcassonne", Description = "Tile-placement medieval city game", ImageUrl="https://i.imgur.com/eeS9WQ9.jpeg" },
                new() { Title = "Codenames", Description = "Party word game", ImageUrl="https://i.imgur.com/jZ9x9Sw.jpeg" },
                new() { Title = "Gloomhaven", Description = "Epic dungeon crawling campaign", ImageUrl="https://i.imgur.com/7bP0kuc.jpeg" }
            };

            db.Games.AddRange(games);
            await db.SaveChangesAsync();
        }
    }
}
