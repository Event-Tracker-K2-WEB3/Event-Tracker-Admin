import type { DataProvider, DeleteParams, RaRecord } from "react-admin";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

async function httpClient(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("eventsync_admin_token");

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `HTTP error ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function normalizeListResponse(response: any) {
  if (Array.isArray(response)) {
    return {
      data: response,
      total: response.length,
    };
  }

  return {
    data: response.content || [],
    total: response.totalElements || 0,
  };
}

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    try {
      const page = params.pagination?.page || 1;
      const perPage = params.pagination?.perPage || 10;

      const springPage = page - 1;

      const url = `${API_URL}/${resource}?page=${springPage}&size=${perPage}`;
      const response = await httpClient(url);

      return normalizeListResponse(response);
    } catch (error) {
      console.error(`Error fetching ${resource}`, error);
      throw error;
    }
  },

  getOne: async (resource, params) => {
    try {
      const response = await httpClient(`${API_URL}/${resource}/${params.id}`);

      return {
        data: response,
      };
    } catch (error) {
      console.error(`Error fetching ${resource}`, error);
      throw error;
    }
  },

  create: async (resource, params) => {
    try {
      const response = await httpClient(`${API_URL}/${resource}`, {
        method: "POST",
        body: JSON.stringify(params.data),
      });

      return {
        data: response,
      };
    } catch (error) {
      console.error(`Error creating ${resource}`, error);
      throw error;
    }
  },

  update: async (resource, params) => {
    try {
      const response = await httpClient(`${API_URL}/${resource}/${params.id}`, {
        method: "PUT",
        body: JSON.stringify(params.data),
      });

      return {
        data: response,
      };
    } catch (error) {
      console.error(`Error updating ${resource}`, error);
      throw error;
    }
  },

  delete: async <RecordType extends RaRecord = any>(
    resource: string,
    params: DeleteParams<RecordType>,
  ) => {
    try {
      await httpClient(`${API_URL}/${resource}/${params.id}`, {
        method: "DELETE",
      });

      return {
        data: params.previousData || ({ id: params.id } as RecordType),
      };
    } catch (error) {
      console.error(`Error deleting ${resource}`, error);
      throw error;
    }
  },

  getMany: async (resource, params) => {
    try {
      const data = await Promise.all(
        params.ids.map((id) => httpClient(`${API_URL}/${resource}/${id}`)),
      );

      return { data };
    } catch (error) {
      console.error(`Error fetching many ${resource}`, error);
      throw error;
    }
  },

  getManyReference: async (resource, params) => {
    try {
      const page = params.pagination?.page || 1;
      const perPage = params.pagination?.perPage || 10;
      const springPage = page - 1;

      const url = `${API_URL}/${resource}?page=${springPage}&size=${perPage}`;
      const response = await httpClient(url);

      return normalizeListResponse(response);
    } catch (error) {
      console.error(`Error fetching references for ${resource}`, error);
      throw error;
    }
  },

  updateMany: async () => {
    throw new Error("updateMany is not implemented yet");
  },

  deleteMany: async () => {
    throw new Error("deleteMany is not implemented yet");
  },
};