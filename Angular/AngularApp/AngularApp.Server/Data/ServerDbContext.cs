using AngularApp.Server.Model;
using Microsoft.EntityFrameworkCore;

namespace AngularApp.Server.Data
{
    public class ServerDbContext: DbContext
    {
        public ServerDbContext(DbContextOptions db):base(db)
        {
           
        }
        public DbSet<ClientesModel> Clientes { get; set; }
        public DbSet<CategoriaModel> Categorias { get; set; }
        public DbSet<RolesModel> Roles { get; set; }                // <- ya lo tienes
        public DbSet<UsuarioRol> UsuarioRoles { get; set; }
        public DbSet<AngularApp.Server.Model.UsuariosModel> UsuariosModel { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Clave compuesta en la tabla de unión
            modelBuilder.Entity<UsuarioRol>()
                .HasKey(ur => new { ur.UsuarioId, ur.RolId });

            modelBuilder.Entity<UsuarioRol>()
                .HasOne(ur => ur.Usuario)
                .WithMany(u => u.UsuarioRoles)
                .HasForeignKey(ur => ur.UsuarioId);

            modelBuilder.Entity<UsuarioRol>()
                .HasOne(ur => ur.Rol)
                .WithMany(r => r.UsuarioRoles)
                .HasForeignKey(ur => ur.RolId);
        }
    }
}
