export const fileSizeConverter = (sizeInBytes) => {
  if (sizeInBytes < 1024) {
    return { size: sizeInBytes, unit: "B" };
  } else if (sizeInBytes < 1048576) {
    const sizeInKB = sizeInBytes / 1024;
    return { size: sizeInKB.toFixed(1), unit: "KB" };
  } else if (sizeInBytes < 1073741824) {
    const sizeInMB = sizeInBytes / 1048576;
    return { size: sizeInMB.toFixed(1), unit: "MB" };
  } else {
    const sizeInGB = sizeInBytes / 1073741824;
    return { size: sizeInGB.toFixed(1), unit: "GB" };
  }
};

export const convertFileExtension = (string) => {
  const extensionsToConvert = ["doc", "ppt", "xls"];
  const newExtensions = { doc: "docx", ppt: "pptx", xls: "xlsx" };

  const fileExtension = string.split(".").pop().toLowerCase();

  if (extensionsToConvert.includes(fileExtension)) {
    const newFileName = string.replace(
      `.${fileExtension}`,
      `.${newExtensions[fileExtension]}`
    );
    return newFileName;
  } else {
    return string;
  }
};

export const formatDateFromString = (date) => {
  const parsedDate = new Date(date);
  const formattedDate = new Date(parsedDate).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return formattedDate;
};

export const formattedTimeFromString = (time) => {
  const parsedTime = new Date(time);
  const hours = parsedTime.getHours();
  const minutes = parsedTime.getMinutes();
  const seconds = parsedTime.getSeconds();
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  return formattedTime;
};

export const getExtension = (str) => {
  const index = str?.lastIndexOf("/");
  let extension = index !== -1 ? str?.substring(index + 1) : str;
  if (
    extension === "vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    extension = "docx";
  }
  if (
    extension ===
    "vnd.openxmlformats-officedocument.presentationml.presentation"
  ) {
    extension = "pptx";
  }
  if (extension === "vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    extension = "xlsx";
  }

  // Check for "plain" type and replace with "txt"
  return extension?.toLowerCase() === "plain" ? "txt" : extension;
};

export const previewFileInfo = (file) => {
  let fileName;
  if (file.name.length < 25) {
    fileName = file.name.substring(0, 25);
  } else {
    fileName = file.name.substring(0, 22).concat("...");
  }

  const name = fileName;
  const type = getExtension(file.type);
  const size = `${file.info.size} ${file.info.unit}`;
  const uploadedDate = formatDateFromString(file.creationDate);
  const uploadedTime = formattedTimeFromString(file.creationTime);

  return {
    name,
    type,
    size,
    uploadedDate,
    uploadedTime,
  };
};
