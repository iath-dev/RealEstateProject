using AutoMapper;
using RealEstate.Core.DTOs;
using RealEstate.Core.Entities;

namespace RealEstate.Core.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Property mappings
            CreateMap<Property, PropertyDto>()
                .ForMember(
                    dest => dest.OwnerName,
                    opt => opt.MapFrom(src => src.Owner != null ? src.Owner.Name : string.Empty)
                )
                .ForMember(dest => dest.Image, opt => opt.Ignore()); // Se maneja en el servicio

            CreateMap<PropertyDto, Property>()
                .ForMember(dest => dest.Owner, opt => opt.Ignore())
                .ForMember(dest => dest.PropertyImages, opt => opt.Ignore())
                .ForMember(dest => dest.PropertyTraces, opt => opt.Ignore());

            CreateMap<Property, PropertyDetailDto>()
                .ForMember(dest => dest.Owner, opt => opt.MapFrom(src => src.Owner))
                .ForMember(dest => dest.Images, opt => opt.MapFrom(src => src.PropertyImages))
                .ForMember(dest => dest.Traces, opt => opt.MapFrom(src => src.PropertyTraces));

            // Owner mappings
            CreateMap<Owner, OwnerDto>().ReverseMap();

            // PropertyImage mappings
            CreateMap<PropertyImage, PropertyImageDto>().ReverseMap();

            // PropertyTrace mappings
            CreateMap<PropertyTrace, PropertyTraceDto>().ReverseMap();

            // PagedResult mapping
            CreateMap<PagedResultDto<Property>, PagedResultDto<PropertyDto>>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.Items));
        }
    }
}
