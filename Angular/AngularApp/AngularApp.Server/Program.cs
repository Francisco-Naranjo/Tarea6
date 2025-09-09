using AngularApp.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// === DB (igual que tenías) ===
var conexion = builder.Configuration.GetConnectionString("cn")
    ?? throw new InvalidOperationException("No existe la base de datos");

builder.Services.AddDbContext<ServerDbContext>(
    op => op.UseMySql(conexion, ServerVersion.Parse("5.7.24")));

// === Controllers + JSON (evitar ciclos) ===
builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// === Swagger: doc v1 + esquemas únicos + conflictos de acciones ===
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "AngularApp API", Version = "v1" });
    c.CustomSchemaIds(t => t.FullName); // evita choque por clases con el mismo nombre
    c.ResolveConflictingActions(apiDescriptions => apiDescriptions.First()); // si hay acciones duplicadas
    c.MapType<DateOnly>(() => new OpenApiSchema { Type = "string", Format = "date" });
    c.MapType<TimeOnly>(() => new OpenApiSchema { Type = "string", Format = "time" });
});

// === CORS (igual que tenías) ===
builder.Services.AddCors(options =>
{
    options.AddPolicy("MyPolicy",
        p => p.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
    .AllowCredentials()
    );
});

var app = builder.Build();

// === Archivos estáticos (SPA) ===
app.UseDefaultFiles();
app.UseStaticFiles();

// === Dev: mostrar detalle del error + Swagger ===
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage(); // mostrará la causa si algo rompe /swagger/v1/swagger.json
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "AngularApp API v1"));
}

app.UseCors("MyPolicy");
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// Healthcheck para aislar problemas básicos
app.MapGet("/healthz", () => "OK");

// SPA fallback
app.MapFallbackToFile("/index.html");

app.Run();
