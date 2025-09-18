using RealEstate.Core.DTOs;
using RealEstate.Core.Entities;

namespace RealEstate.Tests.Helpers
{
    public static class TestDataHelper
    {
        #region Method to create Owners
        public static Owner CreateTestOwner(int id = 1, string name = "Test Owner")
        {
            return new Owner
            {
                IdOwner = id,
                Name = name,
                Address = $"Test Address {id}",
                Photo = $"https://example.com/photo{id}.jpg",
                Birthday = DateTime.Now.AddYears(-30),
            };
        }

        public static OwnerDto CreateTestOwnerDto(int id = 1, string name = "Test Owner")
        {
            return new OwnerDto
            {
                IdOwner = id,
                Name = name,
                Address = $"Test Address {id}",
                Photo = $"https://example.com/photo{id}.jpg",
                Birthday = DateTime.Now.AddYears(-30),
            };
        }

        public static List<Owner> CreateTestOwners(int count = 3)
        {
            var owners = new List<Owner>();
            for (int i = 1; i <= count; i++)
            {
                owners.Add(CreateTestOwner(i, $"Owner {i}"));
            }
            return owners;
        }

        #endregion

        #region Methods to create Properties
        public static Property CreateTestProperty(
            int id = 1,
            int ownerId = 1,
            string name = "Test Property"
        )
        {
            return new Property
            {
                IdProperty = id,
                Name = name,
                Address = $"Test Address {id}",
                Price = 100000m * id,
                CodeInternal = $"PROP{id:000}",
                Year = 2020 + id,
                IdOwner = ownerId,
            };
        }

        public static PropertyDto CreateTestPropertyDto(
            int id = 1,
            int ownerId = 1,
            string name = "Test Property"
        )
        {
            return new PropertyDto
            {
                IdProperty = id,
                Name = name,
                Address = $"Test Address {id}",
                Price = 100000m * id,
                CodeInternal = $"PROP{id:000}",
                Year = 2020 + id,
                IdOwner = ownerId,
                OwnerName = $"Owner {ownerId}",
            };
        }

        public static PropertyDetailDto CreateTestPropertyDetailDto(int id = 1, int ownerId = 1)
        {
            return new PropertyDetailDto
            {
                IdProperty = id,
                Name = $"Test Property {id}",
                Address = $"Test Address {id}",
                Price = 100000m * id,
                CodeInternal = $"PROP{id:000}",
                Year = 2020 + id,
                Owner = CreateTestOwnerDto(ownerId),
                Images = CreateTestPropertyImageDtos(id),
                Traces = CreateTestPropertyTraceDtos(id),
            };
        }

        public static List<Property> CreateTestProperties(int count = 3)
        {
            var properties = new List<Property>();
            for (int i = 1; i <= count; i++)
            {
                properties.Add(CreateTestProperty(i, 1, $"Property {i}"));
            }
            return properties;
        }

        #endregion

        #region Methods to create PropertyImages
        public static PropertyImage CreateTestPropertyImage(int id = 1, int propertyId = 1)
        {
            return new PropertyImage
            {
                IdPropertyImage = id,
                IdProperty = propertyId,
                File = $"test-image-{id}.jpg",
                Enabled = true,
            };
        }

        public static PropertyImageDto CreateTestPropertyImageDto(int id = 1)
        {
            return new PropertyImageDto
            {
                IdPropertyImage = id,
                File = $"test-image-{id}.jpg",
                Enabled = true,
            };
        }

        public static List<PropertyImage> CreateTestPropertyImages(
            int propertyId = 1,
            int count = 2
        )
        {
            var images = new List<PropertyImage>();
            for (int i = 1; i <= count; i++)
            {
                images.Add(CreateTestPropertyImage(i, propertyId));
            }
            return images;
        }

        public static List<PropertyImageDto> CreateTestPropertyImageDtos(
            int propertyId = 1,
            int count = 2
        )
        {
            var images = new List<PropertyImageDto>();
            for (int i = 1; i <= count; i++)
            {
                images.Add(CreateTestPropertyImageDto(i));
            }
            return images;
        }

        #endregion

        #region Methods to create PropertyTraces
        public static PropertyTrace CreateTestPropertyTrace(int id = 1, int propertyId = 1)
        {
            return new PropertyTrace
            {
                IdPropertyTrace = id,
                IdProperty = propertyId,
                DateSale = DateTime.Now.AddMonths(-id),
                Name = $"Sale {id}",
                Value = 50000m * id,
                Tax = 5000m * id,
            };
        }

        public static PropertyTraceDto CreateTestPropertyTraceDto(int id = 1)
        {
            return new PropertyTraceDto
            {
                IdPropertyTrace = id,
                DateSale = DateTime.Now.AddMonths(-id),
                Name = $"Sale {id}",
                Value = 50000m * id,
                Tax = 5000m * id,
            };
        }

        public static List<PropertyTrace> CreateTestPropertyTraces(
            int propertyId = 1,
            int count = 2
        )
        {
            var traces = new List<PropertyTrace>();
            for (int i = 1; i <= count; i++)
            {
                traces.Add(CreateTestPropertyTrace(i, propertyId));
            }
            return traces;
        }

        public static List<PropertyTraceDto> CreateTestPropertyTraceDtos(int count = 2)
        {
            var traces = new List<PropertyTraceDto>();
            for (int i = 1; i <= count; i++)
            {
                traces.Add(CreateTestPropertyTraceDto(i));
            }
            return traces;
        }

        #endregion

        #region Filter methods
        public static PropertyFilterDto CreateTestPropertyFilter()
        {
            return new PropertyFilterDto { Page = 1, PageSize = 10 };
        }

        public static PropertyFilterDto CreateTestPropertyFilterWithName(string name)
        {
            return new PropertyFilterDto
            {
                Name = name,
                Page = 1,
                PageSize = 10,
            };
        }

        public static PropertyFilterDto CreateTestPropertyFilterWithPriceRange(
            decimal? minPrice,
            decimal? maxPrice
        )
        {
            return new PropertyFilterDto
            {
                MinPrice = minPrice,
                MaxPrice = maxPrice,
                Page = 1,
                PageSize = 10,
            };
        }

        #endregion

        #region Methods for PagedResult
        public static PagedResultDto<T> CreateTestPagedResult<T>(List<T> items, int totalCount = 0)
        {
            return new PagedResultDto<T>
            {
                Items = items,
                TotalCount = totalCount > 0 ? totalCount : items.Count,
                Page = 1,
                PageSize = 10,
            };
        }

        #endregion
    }
}
