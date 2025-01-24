interface User {
  id: string;
  username: string;
  globalname: string;
  discriminator: string;
  avatarUrl: string;
  registeredAt: string;
}

export type { User};
