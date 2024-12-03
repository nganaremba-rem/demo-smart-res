import { useToast } from '../context/ToastContext';

export class ApiError extends Error {
  constructor(message, status, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.name = 'ApiError';
  }
}

export const handleApiError = (error, toast) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;

    switch (status) {
      case 401:
        toast('Session expired. Please login again.', 'error');
        // Redirect to login if needed
        break;
      case 403:
        toast('You do not have permission to perform this action', 'error');
        break;
      case 404:
        toast('Resource not found', 'error');
        break;
      case 422:
        // Validation errors
        if (data.errors) {
          Object.values(data.errors).forEach((error) => {
            toast(error, 'error');
          });
        } else {
          toast(data.message || 'Validation failed', 'error');
        }
        break;
      default:
        toast(data.message || 'Something went wrong', 'error');
    }

    throw new ApiError(data.message, status, data.errors);
  } else if (error.request) {
    // Request made but no response received
    toast('Network error. Please check your connection.', 'error');
    throw new ApiError('Network error', 0);
  } else {
    // Something else happened
    toast('An unexpected error occurred', 'error');
    throw error;
  }
};

export const useApiErrorHandler = () => {
  const { addToast } = useToast();

  return (error) => handleApiError(error, addToast);
};
