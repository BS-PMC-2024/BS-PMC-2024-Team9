export const url = "http://localhost:5050/api";
export const urlBP = "http://localhost:8000/api";

export const setHeaders = () => {
    const headers = {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    };
  
    return headers;
  };