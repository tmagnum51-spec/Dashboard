const isDataMocked = true; 

const BASE_URL = 'http://localhost:8000/api';

export async function loginUser(login, password) {
  if(isDataMocked){
    const response = await fetch('/mock/login.json')
    if (!response.ok) {
      throw new Error('Erreur lors du chargement du mock userActivity');
    }

    // Avant de return le JSON, tu vas récupérer les données
    // Et vérifier si un utilisateur correspond (dans ton tableau) au login et au password
    // Si c'est le cas, tu renvoi un objet JSON avec TOKEN et USERID (te référer à postman pour voir ce qu'il envoit)

    return {
              "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMTIzIiwiaWF0IjoxNzg4OTY0OTk0LCJleHAiOjE3ODkwNTEzOTR9.qPs7avVq0sxc-9Wk1_rJ8k90LQbquZW0w0-FM76hS1g",
              "userId": "user123"
            }
  } else {
    // Faire l'appel API en méthode POST et envoyer dans le body login et password
  }
}

// Fonction "façade" qui regroupe les données pour le Dashboard
export async function getUserById(userIdOrToken) {
  if (isDataMocked) {
    // MODE MOCK : Charge les deux fichiers JSON locaux en même temps
    const [infoRes, activityRes] = await Promise.all([
      fetch('/mock/userInfo.json'),
      fetch('/mock/userActivity.json')
    ]);

    if (!infoRes.ok || !activityRes.ok) {
      throw new Error('Erreur lors du chargement des fichiers mock');
    }

    const userInfo = await infoRes.json();
    const userActivity = await activityRes.json();

    // On combine tout dans un seul objet identique à ton ancien système
    return {
      userInfos: userInfo.profile || userInfo.userInfos,
      runningData: userActivity.runningData || userActivity
    };
  } else {
    // MODE API RÉEL : Appelle les 2 endpoints backend en même temps
    const [infoData, activityData] = await Promise.all([
      getUserInfo(userIdOrToken),
      getUserActivity(userIdOrToken)
    ]);

    return {
      userInfos: infoData.profile || infoData.userInfos,
      runningData: activityData.runningData || activityData
    };
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