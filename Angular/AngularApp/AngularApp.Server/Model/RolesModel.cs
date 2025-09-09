namespace AngularApp.Server.Model
{
    public class RolesModel
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }

        // Agrega esta propiedad de navegación para la relación con UsuarioRol
        public ICollection<UsuarioRol> UsuarioRoles { get; set; }
    }
}
