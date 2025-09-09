using System.Xml.Linq;

namespace AngularApp.Server.Model
{

    public class UsuarioRol
    {
        public int UsuarioId { get; set; }
        public UsuariosModel Usuario { get; set; } = default!;

        public int RolId { get; set; }
        public RolesModel Rol { get; set; } = default!;
    }
}
