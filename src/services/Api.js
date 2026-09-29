const isDataMocked = true; 

const BASE_URL = 'http://localhost:8000/api';

export async function loginUser(login, password) {
  if(!login?.trim() || !password){
    throw new Error('Le login et le mot de passe sont requis')
  }

  const cleanLogin = login.trim()
  if(isDataMocked){
    const response = await fetch('/mock/login.json')
    if (!response.ok) {
      throw new Error('Erreur lors du chargement du mock userActivity');
    }

    // console.log(response) // Promise() → Pour pas afficher la promesse
    // Pour afficher la promesse qui a été résolue (le résultat)
    // On doit lui dire deux choses :
    // 1. On ATTEND (await) que la promesse soit résolue
    // 2. On veut ensuite pouvoir traiter les données grâce à notre front/code JS, pour cela on récupère la réponse dans un format utilisable .json()
    const users = await response.json()

    // Ceci se passe normalement côté back, sauf en MOCK de données
    const user = users.find(
      u => u.username === cleanLogin && u.password === password
    )

    if(!user){
      throw new Error('Login et/ou mot de passe incorrect')
    }

    return {
      "token": `fake-jwt-token-${user.id}`,
      "userId": user.id
    }
  } 
  // À partir d'ici on n'est PLUS sur le mock
  // Faire l'appel API en méthode POST et envoyer dans le body login et password
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login: cleanLogin, password })
  })

  // Le filtre pour récupérer un seul user sera fait sur le back directement
  const user = await response.json().catch(() => null)

  if(!response.ok){
    throw new Error(data?.message || `Erreur d'authentification (${response.status})`)
  }

  // Si on arrive ici, ça signifie que l'appel API est OK et que la réponse est OK
  // data = 
  /*
  {
    "token": `fake-jwt-token-${user.id}`,
    "userId": user.id
    }
    
    Qui proviennent de l'API
    */
  return user 
}

// Fonction "façade" qui regroupe les données pour le Dashboard
export async function getUserById(userId) {
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
    console.log(userInfo)

    // On recupère les données de l'utilisateur connecté (userId)
    const info = userInfo.find(u => u.id == userId)
    const activity = userActivity.find(u => u.id == userId)

    // On combine tout dans un seul objet identique à ton ancien système
    return {
      userInfos: info,
      userActivity: activity
    };
  } else {
    // MODE API RÉEL : Appelle les 2 endpoints backend en même temps
    const [infoData, activityData] = await Promise.all([
      getUserInfo(userId),
      getUserActivity(userId)
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