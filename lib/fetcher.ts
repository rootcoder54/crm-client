export class FetchError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "FetchError";
  }
}

export const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new FetchError(
      response.status === 401
        ? "Votre session a expiré. Reconnectez-vous."
        : response.status === 403
          ? "Vous ne disposez pas de l’autorisation de consulter ces données."
          : `Impossible de charger les données (${response.status}).`,
      response.status,
    );
  }
  return response.json();
};
