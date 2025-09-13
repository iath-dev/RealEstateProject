using RealEstate.Core.DTOs;
using RealEstate.Core.Entities;
using RealEstate.Core.Interfaces.IRepositories;
using RealEstate.Core.Interfaces.IServices;

namespace RealEstate.Infrastructure.Services
{
    public class OwnerService : IOwnerService
    {
        private readonly IOwnerRepository _ownerRepository;

        public OwnerService(IOwnerRepository ownerRepository)
        {
            _ownerRepository = ownerRepository;
        }

        public async Task<IEnumerable<OwnerDto>> GetAllOwnersAsync()
        {
            var owners = await _ownerRepository.GetAllAsync();
            return owners.Select(owner => new OwnerDto
            {
                IdOwner = owner.IdOwner,
                Name = owner.Name,
                Address = owner.Address,
                Photo = owner.Photo,
                Birthday = owner.Birthday,
            });
        }

        public async Task<OwnerDto?> GetOwnerByIdAsync(int id)
        {
            var owner = await _ownerRepository.GetByIdAsync(id);
            if (owner == null)
                return null;

            return new OwnerDto
            {
                IdOwner = owner.IdOwner,
                Name = owner.Name,
                Address = owner.Address,
                Photo = owner.Photo,
                Birthday = owner.Birthday,
            };
        }

        public async Task<OwnerDto> CreateOwnerAsync(OwnerDto ownerDto)
        {
            // Generar nuevo ID
            var existingOwners = await _ownerRepository.GetAllAsync();
            var newId = existingOwners.Any() ? existingOwners.Max(o => o.IdOwner) + 1 : 1;

            var owner = new Owner
            {
                IdOwner = newId,
                Name = ownerDto.Name,
                Address = ownerDto.Address,
                Photo = ownerDto.Photo,
                Birthday = ownerDto.Birthday,
            };

            await _ownerRepository.AddAsync(owner);

            ownerDto.IdOwner = owner.IdOwner;
            return ownerDto;
        }

        public async Task<OwnerDto?> UpdateOwnerAsync(int id, OwnerDto ownerDto)
        {
            var existingOwner = await _ownerRepository.GetByIdAsync(id);
            if (existingOwner == null)
                return null;

            existingOwner.Name = ownerDto.Name;
            existingOwner.Address = ownerDto.Address;
            existingOwner.Photo = ownerDto.Photo;
            existingOwner.Birthday = ownerDto.Birthday;

            await _ownerRepository.UpdateAsync(existingOwner);

            return new OwnerDto
            {
                IdOwner = existingOwner.IdOwner,
                Name = existingOwner.Name,
                Address = existingOwner.Address,
                Photo = existingOwner.Photo,
                Birthday = existingOwner.Birthday,
            };
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
