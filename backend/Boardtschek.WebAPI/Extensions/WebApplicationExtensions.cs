using Boardtschek.Data.Models;
using Microsoft.AspNetCore.Identity;

namespace Boardtschek.WebAPI.Extensions
{
    public static class WebApplicationExtensions
    {
        public static async Task SeedAdministratorAsync(this WebApplication app, string email)
        {
            using var scope = app.Services.CreateScope();
            var services = scope.ServiceProvider;

            var userManager = services.GetRequiredService<UserManager<AppUser>>();
            var roleManager = services.GetRequiredService<RoleManager<IdentityRole<Guid>>>();

            const string adminRole = "Administrator";

            if (!await roleManager.RoleExistsAsync(adminRole))
            {
                await roleManager.CreateAsync(new IdentityRole<Guid>(adminRole));
            }

            var adminUser = await userManager.FindByEmailAsync(email);

            if (adminUser != null && !await userManager.IsInRoleAsync(adminUser, adminRole))
            {
                await userManager.AddToRoleAsync(adminUser, adminRole);
            }
        }
    }
}
