import {privateApi} from "@/api/axios.ts";

const FILES_API = "/files";

export async function uploadFile(chatRoomId: string, file: File): Promise<{ fileName: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await privateApi.post<{ fileName: string }>(
    `${FILES_API}/upload?chatRoomId=${chatRoomId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

export async function getFileMetadata(chatRoomId: string, fileName: string) {
  const response = await privateApi.get(`${FILES_API}/${fileName}`, {
    params: { chatRoomId },
    responseType: "blob",
  });

  const disposition = response.headers["content-disposition"];
  const contentType = response.headers["content-type"];

  return {
    blob: response.data,
    contentType,
    disposition,
    originalFileName: getFileNameFromDisposition(disposition),
  };
}

function getFileNameFromDisposition(disposition: string): string {
  const match = disposition?.match(/filename="(.+?)"/);
  return match ? match[1] : "file";
}