using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AngularApp.Server.Data;
using AngularApp.Server.Model;

namespace AngularApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriasController : ControllerBase
    {
        private readonly ServerDbContext _context;
        public CategoriasController(ServerDbContext context) => _context = context;

        // GET: api/Categorias
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoriaModel>>> GetAll()
        {
            return await _context.Categorias.AsNoTracking().ToListAsync();
        }

        // GET: api/Categorias/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoriaModel>> Get(int id)
        {
            var cat = await _context.Categorias.FindAsync(id);
            if (cat == null) return NotFound();
            return cat;
        }

        // POST: api/Categorias
        [HttpPost]
        public async Task<ActionResult<CategoriaModel>> Post(CategoriaModel model)
        {
            _context.Categorias.Add(model);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = model.Id }, model);
        }

        // PUT: api/Categorias/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, CategoriaModel model)
        {
            if (id != model.Id) return BadRequest();
            _context.Entry(model).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(model);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Categorias.AnyAsync(e => e.Id == id))
                    return NotFound();
                throw;
            }
        }

        // DELETE: api/Categorias/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var cat = await _context.Categorias.FindAsync(id);
            if (cat == null) return NotFound();

            _context.Categorias.Remove(cat);
            await _context.SaveChangesAsync();
            return Ok(id);
        }
    }
}
