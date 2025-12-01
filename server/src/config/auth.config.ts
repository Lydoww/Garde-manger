if (!process.env.JWT_SECRET) {
  throw new Error('❌ JWT_SECRET is not defined in environment variables');
}

if (!process.env.JWT_REFRESH_SECRET) {
  throw new Error(
    '❌ JWT_REFRESH_SECRET is not defined in environment variables'
  );
}

interface AuthConfig {
  jwt: {
    secret: string;
    expiresIn: string | number;
  };
  jwtRefresh: {
    secret: string;
    expiresIn: string | number;
  };
}

const authConfig: AuthConfig = {
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  },
  jwtRefresh: {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
};

export default authConfig;
