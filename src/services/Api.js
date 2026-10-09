const isDataMocked = true; 

const BASE_URL = 'http://localhost:8000/api';

export async function loginUser(login, password) {
  if (!login?.trim() || !password) {
    throw new Error('Le login et le mot de passe sont requis');
  }

  const cleanLogin = login.trim();

  if (isDataMocked) {
    const response = await fetch('/mock/login.json');
    if (!response.ok) {
      throw new Error('Erreur lors du chargement du mock login');
    }

    const users = await response.json();
    const user = users.find(
      u => u.username === cleanLogin && u.password === password
    );

    if (!user) {
      throw new Error('Login et/ou mot de passe incorrect');
    }

    return {
      token: `fake-jwt-token-${user.id}`,
      userId: user.id
    };
  } 

  // MODE API RÉELLE
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: cleanLogin, password })
  });

  const user = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(user?.message || `Erreur d'authentification (${response.status})`);
  }

  return {
    token: user.token,
    userId: user.userId || user.id || user.user?.id
  };
}

// Fonction "façade" qui regroupe les données pour le Dashboard
export async function getUserById(token, userId = null) {
  if (isDataMocked) {
    // MODE MOCK : Charge les deux fichiers JSON locaux
    const [infoRes, activityRes] = await Promise.all([
      fetch('/mock/userInfo.json'),
      fetch('/mock/userActivity.json')
    ]);

    if (!infoRes.ok || !activityRes.ok) {
      throw new Error('Erreur lors du chargement des fichiers mock');
    }

    const userInfo = await infoRes.json();
    const userActivity = await activityRes.json();

    const info = userInfo.find(u => u.id == userId);
    const activity = userActivity.find(u => u.id == userId);

    return {
      userInfos: info?.userInfos || info,
      userActivity: activity?.runningData || activity
    }
  } 

  // MODE API RÉEL : Appelle les 2 endpoints backend
  const [infoData, activityData] = await Promise.all([
    getUserInfo(token),
    getUserActivity(token)
  ]);

  return {
    userInfos: infoData.profile || infoData.userInfos,
    userActivity: activityData.runningData || activityData
  };
  
}

/**
 * Service pour les Infos Utilisateur (GET /api/user-info)
 */
export async function getUserInfo(token) {
  if (isDataMocked) {
    const response = await fetch('/mock/userInfo.json');
    if (!response.ok) {
      throw new Error('Erreur lors du chargement du mock userInfo');
    }
    return response.json();
  }

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

  return await response.json();

}

/**
 * Service pour l'Activité Utilisateur (GET /api/user-activity)
 */
export async function getUserActivity(token, startWeek = '2025-01-06', endWeek = '2026-02-01') {
  if (isDataMocked) {
    const response = await fetch('/mock/userActivity.json');
    if (!response.ok) {
      throw new Error('Erreur lors du chargement du mock userActivity');
    }
    return response.json();
  }
    
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
    return await response.json();
}