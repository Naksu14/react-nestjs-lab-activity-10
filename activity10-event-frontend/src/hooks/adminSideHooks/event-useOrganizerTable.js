import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "../../services/adminSideService";

export const useAllOrganizers = () => {
  return useQuery({
    queryKey: ["organizersOnly"],
    queryFn: () => usersService.getOrganizersByRole(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useAllUsers = () => {
  return useQuery({
    queryKey: ["allUsers"],
    queryFn: () => usersService.getAllUsers(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useCreateOrganizer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (organizerData) => usersService.createOrganizer(organizerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      queryClient.invalidateQueries({ queryKey: ["organizersOnly"] });
    },
  });
};

export const useUpdateOrganizer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => usersService.updateOrganizer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      queryClient.invalidateQueries({ queryKey: ["organizersOnly"] });
    },
  });
};

export const useArchiveOrganizer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => usersService.archiveOrganizer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      queryClient.invalidateQueries({ queryKey: ["organizersOnly"] });
    },
  });
};

export const useRestoreOrganizer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => usersService.restoreOrganizer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      queryClient.invalidateQueries({ queryKey: ["organizersOnly"] });
    },
  });
};

export const useAllArchivedOrganizers = () => {
  return useQuery({
    queryKey: ["archivedOrganizers"],
    queryFn: () => usersService.getAllArchivedOrganizers(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};