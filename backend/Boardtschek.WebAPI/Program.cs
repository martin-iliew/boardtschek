using Boardtschek.Data;
using Boardtschek.Data.Models;
using Boardtschek.Services.Data;
using Boardtschek.Services.Data.Interfaces;
using Boardtschek.WebAPI.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

namespace Boardtschek.WebAPI
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var isEfTool = AppDomain.CurrentDomain.FriendlyName.Contains("ef", StringComparison.OrdinalIgnoreCase);
            if (isEfTool)
                builder.Environment.EnvironmentName = "Development";

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddDbContext<BoardtschekDbContext>(options =>
            {
                var sqlServerConn = builder.Configuration.GetConnectionString("DefaultConnection");
                var sqliteConn = builder.Configuration.GetConnectionString("SqliteConnection");

                if (isEfTool)
                {
                    options.UseSqlServer(sqlServerConn, b =>
                        b.MigrationsAssembly("Boardtschek.Data"));
                }
                else if (builder.Environment.IsDevelopment())
                {
                    options.UseSqlServer(sqlServerConn);
                }
                else
                {
                    options.UseSqlite(sqliteConn);
                }
            });

            builder.Services.AddAuthorization();

            builder.Services.AddIdentityApiEndpoints<AppUser>(options =>
            {
                options.Password.RequiredLength = 5;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
            })
            .AddRoles<IdentityRole<Guid>>()
            .AddEntityFrameworkStores<BoardtschekDbContext>();

            builder.Services.AddScoped<IGameService, GameService>();
            builder.Services.AddScoped<IRatingService, RatingService>();
            builder.Services.AddScoped<IRentalService, RentalService>();
            builder.Services.AddScoped<IUserService, UserService>();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy => policy
                    .WithOrigins("http://localhost:5173")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials());
            });

            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter your token. Example: abc123"
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });

            var app = builder.Build();

            using (var scope = app.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<BoardtschekDbContext>();
                await db.Database.MigrateAsync();
            }
            await app.SeedDemoDataAsync();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API v1");
                });
            }

            app.MapIdentityApi<AppUser>();

            app.UseHttpsRedirection();
            app.UseCors("AllowFrontend");
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
