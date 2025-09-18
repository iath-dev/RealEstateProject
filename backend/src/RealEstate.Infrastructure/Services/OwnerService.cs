using AutoMapper;
using RealEstate.Core.DTOs;
using RealEstate.Core.Entities;
using RealEstate.Core.Interfaces.IRepositories;
using RealEstate.Core.Interfaces.IServices;

namespace RealEstate.Infrastructure.Services
{
    public class OwnerService : IOwnerService
    {
        private readonly IOwnerRepository _ownerRepository;
        private readonly IMapper _mapper;

        public OwnerService(IOwnerRepository ownerRepository, IMapper mapper)
        {
            _ownerRepository = ownerRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<OwnerDto>> GetAllOwnersAsync()
        {
            var owners = await _ownerRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<OwnerDto>>(owners);
        }

        public async Task<OwnerDto?> GetOwnerByIdAsync(int id)
        {
            var owner = await _ownerRepository.GetByIdAsync(id);
            return owner != null ? _mapper.Map<OwnerDto>(owner) : null;
        }

        public async Task<OwnerDto> CreateOwnerAsync(OwnerDto ownerDto)
        {
            // Generar nuevo ID
            var existingOwners = await _ownerRepository.GetAllAsync();
            var newId = existingOwners.Any() ? existingOwners.Max(o => o.IdOwner) + 1 : 1;

            var owner = _mapper.Map<Owner>(ownerDto);
            owner.IdOwner = newId;

            await _ownerRepository.AddAsync(owner);

            return _mapper.Map<OwnerDto>(owner);
        }

        public async Task<OwnerDto?> UpdateOwnerAsync(int id, OwnerDto ownerDto)
        {
            var existingOwner = await _ownerRepository.GetByIdAsync(id);
            if (existingOwner == null)
                return null;

            _mapper.Map(ownerDto, existingOwner);
            existingOwner.IdOwner = id; // Asegurar que el ID no cambie

            await _ownerRepository.UpdateAsync(existingOwner);

            return _mapper.Map<OwnerDto>(existingOwner);
        }

        public async Task<bool> DeleteOwnerAsync(int id)
        {
            var owner = await _ownerRepository.GetByIdAsync(id);
            if (owner == null)
                return false;

            await _ownerRepository.DeleteAsync(owner);
            return true;
        }
    }
}
