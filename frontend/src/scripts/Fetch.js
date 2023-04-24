export function fetchJson(url, method, body) {
  const fetchOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (method !== "GET") fetchOptions.body = JSON.stringify(body);

  return fetch(url, fetchOptions);
}
