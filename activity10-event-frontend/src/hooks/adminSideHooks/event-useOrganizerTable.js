import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "../../services/adminSideService";

export const useAllOrganizers = () => {
  return useQuery({
    queryKey: ['organizers'],
    queryFn: () => usersService.getAllOrganizers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export const useCreateOrganizer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (organizerData) => usersService.createOrganizer(organizerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizers'] });
    }
  });
}

export const useUpdateOrganizer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => usersService.updateOrganizer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizers'] });
    }
  });
}

export const useArchiveOrganizer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => usersService.archiveOrganizer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizers'] });
    }
  });
}

export const useRestoreOrganizer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => usersService.restoreOrganizer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizers'] });
    }
  });
}

export const useAllArchivedOrganizers = () => {
  return useQuery({
    queryKey: ['archivedOrganizers'],
    queryFn: () => usersService.getAllArchivedOrganizers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}