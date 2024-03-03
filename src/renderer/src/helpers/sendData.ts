interface IResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export const sendData = async (event: string, data?: any | null): Promise<IResponse> => {
  const response = await window.electron.ipcRenderer.invoke(event, data);
  return response;
}

export const onEvent = (event: string, callback: (...args: any) => void) => {
  window.electron.ipcRenderer.on(event, callback);
}