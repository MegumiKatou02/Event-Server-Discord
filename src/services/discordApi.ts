import axios from 'axios';

const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
const clientSecret = import.meta.env.VITE_DISCORD_CLIENT_SECRET;
const redirectUri = import.meta.env.VITE_DISCORD_REDIRECT_URI;

export async function getAccessToken(code: string) {
  const url = 'https://discord.com/api/oauth2/token';
  const data = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
  });

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const response = await axios.post(url, data, { headers });
  return response.data;
}

export async function getUserInfo(accessToken: string) {
  const url = 'https://discord.com/api/users/@me';
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const response = await axios.get(url, { headers });
  return response.data;
}

export const getGuilds = async (accessToken: string): Promise<Guild[]> => {
  const response = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.json();
};

interface Guild {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: string;
  features: string[];
}
