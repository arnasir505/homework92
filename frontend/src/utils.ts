export const blobUrlToFile = async (blobUrl: string): Promise<File> => {
  const response = await fetch(blobUrl);
  const blob = await response.blob();

  const filename = blobUrl.substring(blobUrl.lastIndexOf('/') + 1);
  const file = new File([blob], filename, { type: blob.type });

  return file;
};
