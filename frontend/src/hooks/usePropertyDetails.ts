import { useQuery } from '@tanstack/react-query';

import { getPropertyDetail } from '@/api/services';
import { usePropertyStore } from '@/store';

const usePropertyDetails = () => {
  const { selectedPropertyId } = usePropertyStore();

  return useQuery({
    queryKey: ['propertyDetail', selectedPropertyId],
    queryFn: () => getPropertyDetail(selectedPropertyId!),
    enabled: selectedPropertyId !== null,
  });
};

export default usePropertyDetails;
