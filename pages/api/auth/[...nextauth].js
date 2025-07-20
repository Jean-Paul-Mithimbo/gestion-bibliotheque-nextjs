import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '../../../lib/mongodb';
import User from '../../../lib/models/User';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' }
      },
      async authorize(credentials) {
        try {
          await dbConnect();
          
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error('Aucun utilisateur trouvé avec cet email');
          }

          const isValid = await user.comparePassword(credentials.password);
          if (!isValid) {
            throw new Error('Mot de passe incorrect');
          }

          return {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          throw new Error(error.message);
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google') {
        try {
          await dbConnect();
          
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              googleId: user.id,
              image: user.image,
            });
          } else if (!existingUser.googleId) {
            // Lier le compte Google à un compte existant
            existingUser.googleId = user.id;
            existingUser.image = user.image;
            await existingUser.save();
          }
          
          return true;
        } catch (error) {
          console.error('Erreur lors de la connexion Google:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});