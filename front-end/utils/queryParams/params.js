export const setParams = (id) => {
  let url = new URL(window.location);

  url.searchParams.set("cancel_order", id);

  window.history.pushState({}, "", url);
};

export const removeParam = () => {
  let url = new URL(window.location);

  url.searchParams.delete("cancel_order");

  window.history.pushState({}, "", url);
};

export const getParam = () => {
  let url = new URL(window.location);

  return url.searchParams.get("cancel_order");
};
