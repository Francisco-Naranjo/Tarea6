namespace AngularApp.Server.Model
{
    public class UsuariosModel
    {
        public int Id { get; set; }
        public string nombre { get; set; } = string.Empty;
        public string correo { get; set; } = string.Empty;
        public string pwd { get; set; } = string.Empty;

        // NUEVO: roles asignados
        public ICollection<UsuarioRol> UsuarioRoles { get; set; } = new List<UsuarioRol>();
    }
}
