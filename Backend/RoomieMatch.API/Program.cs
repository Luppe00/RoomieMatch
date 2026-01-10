using RoomieMatch.Model.Repositories;
using Npgsql;
using System.IO;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

// 1. Dependency Injection (DI) Container
// This "teaches" our app how to create Repositories.
// "When a Controller asks for 'IUserRepository', give them a 'UserRepository'."
// AddScoped means: "Create a new one for every HTTP Request."
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRoomRepository, RoomRepository>();
builder.Services.AddScoped<IPreferenceRepository, PreferenceRepository>();
builder.Services.AddScoped<ISwipeRepository, SwipeRepository>();
builder.Services.AddScoped<IMatchRepository, MatchRepository>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();

// Configure Cloudinary Settings
builder.Services.Configure<RoomieMatch.API.Helpers.CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));
builder.Services.AddScoped<RoomieMatch.API.Services.IPhotoService, RoomieMatch.API.Services.PhotoService>();

// 2. Configure CORS (Cross-Origin Resource Sharing)
// This asks the browser: "Please allow the Frontend (localhost:4200) to talk to us."
// Without this, the browser blocks the connection for security.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularDev", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 3. Configure Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration.GetSection("AppSettings:Token").Value)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // app.UseSwagger();
    // app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AngularDev");

app.UseStaticFiles(); // Serve files from wwwroot (the Angular app)

app.UseAuthentication(); // Must be before Authorization
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("index.html"); // Handle Angular routing (refreshing pages)

// 3. Database Initialization
// I added this logic to clear/reset the database by running:
// "dotnet run -- --init-db"
if (args.Contains("--init-db"))
{
    using (var scope = app.Services.CreateScope())
    {
        var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
        var rawConn = config.GetConnectionString("AppProgDb");
        var connString = RoomieMatch.Model.Helpers.DbHelper.ParseConnection(rawConn);
        
        try 
        {
            Console.WriteLine("Applying Database Schema...");
            var schemaPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "schema.sql");
            var seedPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "seed.sql");

            Console.WriteLine($"Looking for SQL files at: {schemaPath} and {seedPath}");

            if (!File.Exists(schemaPath) || !File.Exists(seedPath))
            {
               // Fallback for when running from bin directory or different structure
               schemaPath = Path.Combine(Directory.GetCurrentDirectory(), "schema.sql");
               seedPath = Path.Combine(Directory.GetCurrentDirectory(), "seed.sql");
            }

            var schemaSql = File.ReadAllText(schemaPath);
            var seedSql = File.ReadAllText(seedPath);

            using var conn = new Npgsql.NpgsqlConnection(connString);
            conn.Open();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = schemaSql;
            cmd.ExecuteNonQuery();

            Console.WriteLine("Applying Seed Data...");
            cmd.CommandText = seedSql;
            cmd.ExecuteNonQuery();
            
            Console.WriteLine("Database Initialized Successfully.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error initializing database: {ex.Message}");
        }
    }
}
else
{
    Console.WriteLine("Skipping Database Initialization. Use --init-db to reset.");
}

app.Run();
