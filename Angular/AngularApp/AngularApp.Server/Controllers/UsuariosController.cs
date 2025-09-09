using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AngularApp.Server.Data;
using AngularApp.Server.Model;

namespace AngularApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly ServerDbContext _context;
        public UsuariosController(ServerDbContext context) => _context = context;

        // ===== CRUD BÁSICO (igual que tenías) =====
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsuariosModel>>> GetUsuariosModel()
        {
            return await _context.UsuariosModel.AsNoTracking().ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UsuariosModel>> GetUsuariosModel(int id)
        {
            var usuariosModel = await _context.UsuariosModel.FindAsync(id);
            if (usuariosModel == null) return NotFound();
            return usuariosModel;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuariosModel(int id, UsuariosModel usuariosModel)
        {
            if (id != usuariosModel.Id) return BadRequest();
            _context.Entry(usuariosModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(usuariosModel);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.UsuariosModel.Any(e => e.Id == id)) return NotFound();
                throw;
            }
        }

        // POST = Registrar usuario (también sirve como "register")
        [HttpPost]
        public async Task<ActionResult<UsuariosModel>> PostUsuariosModel(UsuariosModel usuariosModel)
        {
            // Evita duplicados por correo
            var existe = await _context.UsuariosModel.AnyAsync(u => u.correo == usuariosModel.correo);
            if (existe) return Conflict(new { ok = false, message = "El correo ya existe" });

            _context.UsuariosModel.Add(usuariosModel);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetUsuariosModel", new { id = usuariosModel.Id }, usuariosModel);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuariosModel(int id)
        {
            var usuariosModel = await _context.UsuariosModel.FindAsync(id);
            if (usuariosModel == null) return NotFound();

            _context.UsuariosModel.Remove(usuariosModel);
            await _context.SaveChangesAsync();
            return Ok(id);
        }

        private bool UsuariosModelExists(int id) => _context.UsuariosModel.Any(e => e.Id == id);

        // ====== LOGIN con COOKIE + SESSION + LOGOUT ======
        public record LoginDto(string Email, string Password);

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest(new { ok = false, message = "Datos inválidos" });

            var user = await _context.UsuariosModel
                .FirstOrDefaultAsync(u => u.correo == dto.Email && u.pwd == dto.Password);

            if (user is null) return Unauthorized(new { ok = false, message = "Credenciales inválidas" });

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,                 // HTTPS
                SameSite = SameSiteMode.None,  // para Angular (4200 → 7112)
                Expires = DateTimeOffset.UtcNow.AddHours(8)
            };

            // Guarda nombre e id (si quieres)
            Response.Cookies.Append("session_user", user.nombre, cookieOptions);
            Response.Cookies.Append("session_uid", user.Id.ToString(), cookieOptions);

            return Ok(new { ok = true, nombre = user.nombre });
        }

        [HttpGet("session")]
        public IActionResult Session()
        {
            if (Request.Cookies.TryGetValue("session_user", out var nombre))
                return Ok(new { ok = true, nombre });
            return Unauthorized(new { ok = false });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            var opts = new CookieOptions { Secure = true, SameSite = SameSiteMode.None };
            Response.Cookies.Delete("session_user", opts);
            Response.Cookies.Delete("session_uid", opts);
            return Ok(new { ok = true });
        }

        // ====== ROLES POR USUARIO ======

        // GET: api/Usuarios/{id}/roles -> devuelve todos los roles del usuario
        [HttpGet("{id}/roles")]
        public async Task<IActionResult> GetRolesDeUsuario(int id)
        {
            var existe = await _context.UsuariosModel.AnyAsync(u => u.Id == id);
            if (!existe) return NotFound();

            var roles = await _context.UsuarioRoles
                .Where(ur => ur.UsuarioId == id)
                .Select(ur => new { ur.RolId, ur.Rol.Nombre })
                .ToListAsync();

            return Ok(roles);
        }

        // POST: api/Usuarios/{id}/roles/{rolId} -> asigna rol
        [HttpPost("{id}/roles/{rolId}")]
        public async Task<IActionResult> AsignarRol(int id, int rolId)
        {
            var user = await _context.UsuariosModel.FindAsync(id);
            if (user is null) return NotFound(new { message = "Usuario no existe" });

            var rolExiste = await _context.Roles.AnyAsync(r => r.Id == rolId);
            if (!rolExiste) return NotFound(new { message = "Rol no existe" });

            var yaTiene = await _context.UsuarioRoles.AnyAsync(ur => ur.UsuarioId == id && ur.RolId == rolId);
            if (yaTiene) return Conflict(new { message = "El usuario ya tiene ese rol" });

            _context.UsuarioRoles.Add(new UsuarioRol { UsuarioId = id, RolId = rolId });
            await _context.SaveChangesAsync();
            return Ok(new { ok = true });
        }

        // DELETE: api/Usuarios/{id}/roles/{rolId} -> quita rol
        [HttpDelete("{id}/roles/{rolId}")]
        public async Task<IActionResult> QuitarRol(int id, int rolId)
        {
            var ur = await _context.UsuarioRoles.FirstOrDefaultAsync(x => x.UsuarioId == id && x.RolId == rolId);
            if (ur is null) return NotFound();

            _context.UsuarioRoles.Remove(ur);
            await _context.SaveChangesAsync();
            return Ok(new { ok = true });
        }
    }
}

