interface IResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export const sendData = async (event: string, data?: any | null): Promise<IResponse> => {
  const response = await window.electron.ipcRenderer.invoke(event, data);
  return response;
}