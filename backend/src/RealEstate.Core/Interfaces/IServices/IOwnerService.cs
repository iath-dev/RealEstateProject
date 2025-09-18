using RealEstate.Core.DTOs;

namespace RealEstate.Core.Interfaces.IServices
{
    public interface IOwnerService
    {
        Task<IEnumerable<OwnerDto>> GetAllOwnersAsync();
        Task<OwnerDto?> GetOwnerByIdAsync(int id);
        Task<OwnerDto> CreateOwnerAsync(OwnerDto ownerDto);
        Task<OwnerDto?> UpdateOwnerAsync(int id, OwnerDto ownerDto);
        Task<bool> DeleteOwnerAsync(int id);
    }
}
