using Microsoft.AspNetCore.Mvc;
using RealEstate.Core.DTOs;
using RealEstate.Core.Interfaces.IServices;

namespace RealEstate.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OwnersController : ControllerBase
    {
        private readonly IOwnerService _ownerService;
        private readonly ILogger<OwnersController> _logger;

        public OwnersController(IOwnerService ownerService, ILogger<OwnersController> logger)
        {
            _ownerService = ownerService;
            _logger = logger;
        }

        /// <summary>
        /// Obtiene todos los propietarios
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OwnerDto>>> GetOwners()
        {
            try
            {
                var owners = await _ownerService.GetAllOwnersAsync();
                return Ok(owners);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener los propietarios");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Obtiene un propietario específico por ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<OwnerDto>> GetOwner(int id)
        {
            try
            {
                var owner = await _ownerService.GetOwnerByIdAsync(id);
                if (owner == null)
                {
                    return NotFound(new { message = "Propietario no encontrado" });
                }

                return Ok(owner);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener el propietario con ID {Id}", id);
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Crea un nuevo propietario
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<OwnerDto>> CreateOwner([FromBody] OwnerDto ownerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var createdOwner = await _ownerService.CreateOwnerAsync(ownerDto);
                return CreatedAtAction(
                    nameof(GetOwner),
                    new { id = createdOwner.IdOwner },
                    createdOwner
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear el propietario");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Actualiza un propietario existente
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<OwnerDto>> UpdateOwner(int id, [FromBody] OwnerDto ownerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var updatedOwner = await _ownerService.UpdateOwnerAsync(id, ownerDto);
                if (updatedOwner == null)
                {
                    return NotFound(new { message = "Propietario no encontrado" });
                }

                return Ok(updatedOwner);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar el propietario con ID {Id}", id);
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Elimina un propietario
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOwner(int id)
        {
            try
            {
                var deleted = await _ownerService.DeleteOwnerAsync(id);
                if (!deleted)
                {
                    return NotFound(new { message = "Propietario no encontrado" });
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar el propietario con ID {Id}", id);
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }
    }
}
