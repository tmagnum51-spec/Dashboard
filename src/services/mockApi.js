import localData from '../data/data.json'; // Ajuste le chemin vers ton data.json si besoin

export const mockApi = {
  getUserById: async (userId) => {
    // Faux délai réseau
    await new Promise((resolve) => setTimeout(resolve, 200));

    // On cherche l'utilisateur dans le tableau [ ... ]
    const user = localData.find((u) => u.id === userId);

    if (!user) {
      console.error(`Utilisateur avec l'ID ${userId} introuvable !`);
      return null;
    }

    return user;
  }
};