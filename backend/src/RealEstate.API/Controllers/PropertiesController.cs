using Microsoft.AspNetCore.Mvc;
using RealEstate.Core.DTOs;
using RealEstate.Core.Interfaces.IServices;

namespace RealEstate.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PropertiesController : ControllerBase
    {
        private readonly IPropertyService _propertyService;
        private readonly ILogger<PropertiesController> _logger;

        public PropertiesController(
            IPropertyService propertyService,
            ILogger<PropertiesController> logger
        )
        {
            _propertyService = propertyService;
            _logger = logger;
        }

        /// <summary>
        /// Gets a paginated list of properties with optional filters.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<PagedResultDto<PropertyDto>>> GetProperties(
            [FromQuery] PropertyFilterDto filters
        )
        {
            try
            {
                var result = await _propertyService.GetPropertiesAsync(filters);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener las propiedades");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Gets the full details of a specific property.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<PropertyDetailDto>> GetProperty(int id)
        {
            try
            {
                var property = await _propertyService.GetPropertyByIdAsync(id);
                if (property == null)
                {
                    return NotFound(new { message = "Propiedad no encontrada" });
                }

                return Ok(property);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener la propiedad con ID {Id}", id);
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Creates a new property.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<PropertyDto>> CreateProperty(
            [FromBody] PropertyDto propertyDto
        )
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var createdProperty = await _propertyService.CreatePropertyAsync(propertyDto);
                return CreatedAtAction(
                    nameof(GetProperty),
                    new { id = createdProperty.IdProperty },
                    createdProperty
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear la propiedad");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Updates an existing property.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<PropertyDto>> UpdateProperty(
            int id,
            [FromBody] PropertyDto propertyDto
        )
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var updatedProperty = await _propertyService.UpdatePropertyAsync(id, propertyDto);
                if (updatedProperty == null)
                {
                    return NotFound(new { message = "Propiedad no encontrada" });
                }

                return Ok(updatedProperty);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar la propiedad con ID {Id}", id);
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Deletes a property.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProperty(int id)
        {
            try
            {
                var deleted = await _propertyService.DeletePropertyAsync(id);
                if (!deleted)
                {
                    return NotFound(new { message = "Propiedad no encontrada" });
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar la propiedad con ID {Id}", id);
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Checks if a property exists.
        /// </summary>
        [HttpHead("{id}")]
        public async Task<IActionResult> PropertyExists(int id)
        {
            try
            {
                var exists = await _propertyService.PropertyExistsAsync(id);
                return exists ? Ok() : NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Error al verificar la existencia de la propiedad con ID {Id}",
                    id
                );
                return StatusCode(500);
            }
        }
    }
}
