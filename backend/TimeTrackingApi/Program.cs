using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

builder.Services.AddDbContext<TimeTrackingDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("TimeTrackingDb")));

var app = builder.Build();
app.UseCors();

app.MapGet("/api/projects", async (TimeTrackingDbContext db) =>
    await db.Projects.ToListAsync());

app.MapPost("/api/projects", async (TimeTrackingDbContext db, Project project) =>
{
    db.Projects.Add(project);
    await db.SaveChangesAsync();
    return Results.Created($"/api/projects/{project.Id}", project);
});

app.MapGet("/api/timeentries", async (TimeTrackingDbContext db) =>
    await db.TimeEntries.Include(e => e.Project).ToListAsync());

app.MapPost("/api/timeentries", async (TimeTrackingDbContext db, TimeEntry entry) =>
{
    db.TimeEntries.Add(entry);
    await db.SaveChangesAsync();
    return Results.Created($"/api/timeentries/{entry.Id}", entry);
});

app.Run();

public class TimeTrackingDbContext : DbContext
{
    public TimeTrackingDbContext(DbContextOptions<TimeTrackingDbContext> options)
        : base(options) {}

    public DbSet<Project> Projects => Set<Project>();
    public DbSet<TimeEntry> TimeEntries => Set<TimeEntry>();
}

public class Project
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public List<TimeEntry> Entries { get; set; } = new();
}

public class TimeEntry
{
    public int Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Hours { get; set; }
    public DateTime Date { get; set; }
    public int ProjectId { get; set; }
    public Project? Project { get; set; }
}
