import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRegistrationsByEventId, getRegistrationsByOrganizerId } from "../../services/organizerService";

export const useAttendeesByEvent = (eventId) => {
  return useQuery({
    queryKey: ["attendeesByEvent", eventId],
    queryFn: () => getRegistrationsByEventId(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useAttendeesByOrganizer = (organizerId) => {
  return useQuery({
    queryKey: ["attendeesByOrganizer", organizerId],
    queryFn: () => getRegistrationsByOrganizerId(organizerId),
    enabled: !!organizerId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
