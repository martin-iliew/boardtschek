using Boardtschek.Data;
using Boardtschek.Data.Models;
using Boardtschek.Services.Data;
using Boardtschek.Services.Data.Interfaces;
using Microsoft.EntityFrameworkCore;
using Boardtschek.WebAPI.Extensions;
using static Boardtschek.Common.EntityValidations.GeneralApplicationConstants;
using Microsoft.AspNetCore.Identity;
using Microsoft.OpenApi.Models;



namespace Boardtschek.WebAPI
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddDbContext<BoardtschekDbContext>(options =>
            {
                if (builder.Environment.IsDevelopment())
                {
                    options.UseSqlServer(
                        builder.Configuration.GetConnectionString("DefaultConnection"),
                        sql =>
                        {
                            sql.MigrationsAssembly("Boardtschek.Data");
                            sql.MigrationsHistoryTable("__EFMigrationsHistory", "SqlServer");
                        });
                }
                else
                {
                    options.UseSqlite(
                        builder.Configuration.GetConnectionString("DefaultConnection"),
                        sqlite =>
                        {
                            sqlite.MigrationsAssembly("Boardtschek.Data");
                            sqlite.MigrationsHistoryTable("__EFMigrationsHistory", "Sqlite");
                        });
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
                options.AddPolicy("AllowFrontend",
                    policy => policy
                    .WithOrigins("http://localhost:5173") // Replace with your frontend URL
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
                    Description = "Enter your token in the text input below.\n\nExample: `abc123`"
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


            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API v1");
                });
            }

            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var db = services.GetRequiredService<BoardtschekDbContext>();

                await db.Database.MigrateAsync();
                await app.SeedAdministratorAsync(DevelopmentAdminEmail);
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
