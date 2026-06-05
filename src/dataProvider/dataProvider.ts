import {
  type DataProvider,
  type DeleteParams,
  type GetManyReferenceParams,
  type GetManyReferenceResult,
  type RaRecord,
  HttpError,
} from "react-admin";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

type SpringPageResponse<RecordType extends RaRecord = RaRecord> = {
  content?: RecordType[];
  totalElements?: number;
};

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("eventsync_admin_token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function httpClient(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();

    throw new HttpError(
      message || `HTTP error ${response.status}`,
      response.status
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function normalizeListResponse<RecordType extends RaRecord = RaRecord>(
  response: SpringPageResponse<RecordType> | RecordType[]
): {
  data: RecordType[];
  total: number;
} {
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

function buildListUrl(
  resource: string,
  page: number,
  perPage: number,
  filter?: Record<string, unknown>
) {
  const params = new URLSearchParams();

  /*
    Important :
    Ton backend EventService fait déjà PageRequest.of(page - 1, size).
    Donc ici, on envoie page=1, page=2, etc.
    Il ne faut pas envoyer page - 1.
  */
  params.set("page", String(page));
  params.set("size", String(perPage));

  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value));
      }
    });
  }

  return `${API_URL}/${resource}?${params.toString()}`;
}

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    try {
      const page = params.pagination?.page || 1;
      const perPage = params.pagination?.perPage || 10;

      const url = buildListUrl(resource, page, perPage, params.filter);
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

  delete: async <RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: DeleteParams<RecordType>
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
        params.ids.map((id) => httpClient(`${API_URL}/${resource}/${id}`))
      );

      return {
        data,
      };
    } catch (error) {
      console.error(`Error fetching many ${resource}`, error);
      throw error;
    }
  },

  getManyReference: async <RecordType extends RaRecord = RaRecord>(
    resource: string,
    params: GetManyReferenceParams
  ): Promise<GetManyReferenceResult<RecordType>> => {
    try {
      const page = params.pagination?.page || 1;
      const perPage = params.pagination?.perPage || 10;
  
      const filter = {
        ...params.filter,
        [params.target]: params.id,
      };
  
      const url = buildListUrl(resource, page, perPage, filter);
      const response = await httpClient(url);
  
      return normalizeListResponse<RecordType>(
        response as SpringPageResponse<RecordType> | RecordType[]
      );
    } catch (error) {
      console.error(`Error fetching references for ${resource}`, error);
      throw error;
    }
  },

  updateMany: async (resource, params) => {
    try {
      const responses = await Promise.all(
        params.ids.map((id) =>
          httpClient(`${API_URL}/${resource}/${id}`, {
            method: "PUT",
            body: JSON.stringify(params.data),
          })
        )
      );

      return {
        data: responses.map((response) => response.id),
      };
    } catch (error) {
      console.error(`Error updating many ${resource}`, error);
      throw error;
    }
  },

  deleteMany: async (resource, params) => {
    try {
      await Promise.all(
        params.ids.map((id) =>
          httpClient(`${API_URL}/${resource}/${id}`, {
            method: "DELETE",
          })
        )
      );

      return {
        data: params.ids,
      };
    } catch (error) {
      console.error(`Error deleting many ${resource}`, error);
      throw error;
    }
  },
};