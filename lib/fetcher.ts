export const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      response.status === 401
        ? "Votre session a expiré. Reconnectez-vous."
        : `Impossible de charger les données (${response.status}).`,
    );
  }
  return response.json();
};
