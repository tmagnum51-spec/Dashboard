// Variable de bascule : true = Mocks locaux | false = Backend P6JS réel
const isDataMocked = true;

const BASE_URL = 'http://localhost:8000/api';

/**
 * Service de Connexion (POST /api/login)
 */
export async function loginUser(username, password) {
  if (isDataMocked) {
    // ---- BRANCHE 1 : MODE MOCK ----
    const response = await fetch('/mock/login.json');
    if (!response.ok) {
      throw new Error('Erreur lors du chargement du mock login');
    }
    return response.json();
  } else {
    // ---- BRANCHE 2 : MODE API RÉELLE ----
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      throw new Error('Identifiants invalides');
    }
    return response.json();
  }
}

/**
 * Service pour les Infos Utilisateur (GET /api/user-info)
 */
export async function getUserInfo(token) {
  if (isDataMocked) {
    // ---- BRANCHE 1 : MODE MOCK ----
    const response = await fetch('/mock/userInfo.json');
    if (!response.ok) {
      throw new Error('Erreur lors du chargement du mock userInfo');
    }
    return response.json();
  } else {
    // ---- BRANCHE 2 : MODE API RÉELLE ----
    const response = await fetch(`${BASE_URL}/user-info`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des infos utilisateur');
    }
    return response.json();
  }
}

/**
 * Service pour l'Activité Utilisateur (GET /api/user-activity)
 */
export async function getUserActivity(token, startWeek = '2024-01-01', endWeek = '2024-02-01') {
  if (isDataMocked) {
    // ---- BRANCHE 1 : MODE MOCK ----
    const response = await fetch('/mock/userActivity.json');
    if (!response.ok) {
      throw new Error('Erreur lors du chargement du mock userActivity');
    }
    return response.json();
  } else {
    // ---- BRANCHE 2 : MODE API RÉELLE ----
    const response = await fetch(`${BASE_URL}/user-activity?startWeek=${startWeek}&endWeek=${endWeek}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des activités');
    }
    return response.json();
  }
}