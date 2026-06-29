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

  const text = await response.text();

  if (!text) {
    return null;
  }

  return JSON.parse(text);
}

function toIsoDateTime(value: unknown) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string") {
    return new Date(value).toISOString();
  }

  return value;
}

function removeEmptyValues(data: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  );
}

function transformData(data: any, resource: string): any {
  if (!data) {
    return data;
  }

  if (resource === "events") {
    return removeEmptyValues({
      title: data.title,
      description: data.description,
      startDate: toIsoDateTime(data.startDate),
      endDate: toIsoDateTime(data.endDate),
      location: data.location,
    });
  }

  if (resource === "sessions") {
    return removeEmptyValues({
      title: data.title,
      description: data.description,
      type: data.type,
      startTime: toIsoDateTime(data.startTime),
      endTime: toIsoDateTime(data.endTime),
      capacity: data.capacity,
      image: data.image,
      eventId: data.eventId,
      roomId: data.roomId,
    });
  }

  if (resource === "rooms") {
    return removeEmptyValues({
      name: data.name,
    });
  }

  if (resource === "speakers") {
    return removeEmptyValues({
      name: data.name,
      role: data.role,
      specialty: data.specialty,
      company: data.company,
      bio: data.bio,
      photo: data.photo,
      initials: data.initials,
      linkedin: data.linkedin,
      twitter: data.twitter,
      website: data.website,
      day: data.day,
      sessionType: data.sessionType,
    });
  }

  return data;
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

  const safePage = Math.max(page || 1, 1);
  const safePerPage = Math.max(perPage || 10, 1);


  params.set("page", String(safePage));
  params.set("size", String(safePerPage));

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
    if (resource === "events") {
      const imageFileValue = params.data.imageFile;
      const uploadedImage = Array.isArray(imageFileValue)
        ? imageFileValue[0]
        : imageFileValue;

      const rawFile = uploadedImage?.rawFile;

      if (rawFile instanceof File) {
        const token = localStorage.getItem("eventsync_admin_token");

        const formData = new FormData();
        formData.append("title", params.data.title);
        formData.append("description", params.data.description || "");
        formData.append("location", params.data.location);
        formData.append("startDate", toIsoDateTime(params.data.startDate) as string);
        formData.append("endDate", toIsoDateTime(params.data.endDate) as string);
        formData.append("imageFile", rawFile);

        const response = await fetch(`${API_URL}/events/upload`, {
          method: "POST",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: formData,
        });

        if (!response.ok) {
          const message = await response.text();

          throw new HttpError(
            message || `HTTP error ${response.status}`,
            response.status
          );
        }

        const data = await response.json();

        return {
          data,
        };
      }
    }

    const data = transformData(params.data, resource);

    const response = await httpClient(`${API_URL}/${resource}`, {
      method: "POST",
      body: JSON.stringify(data),
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
      const data = transformData(params.data, resource);

      const response = await httpClient(`${API_URL}/${resource}/${params.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
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
      if (resource === "rooms") {
        const confirmed = window.confirm(
          "⚠️ Warning: Deleting this room may also affect sessions associated with it.\n\nAre you sure you want to continue?"
        );

        if (!confirmed) {
          return {
            data: params.previousData || ({ id: params.id } as RecordType),
          };
        }
      }

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
      await Promise.all(
        params.ids.map((id) => {
          const data = transformData(params.data, resource);

          return httpClient(`${API_URL}/${resource}/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
          });
        })
      );

      return {
        data: params.ids,
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