import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;

      const isAdminRoute = pathname.startsWith("/admin");
      const isAuthRoute = pathname.startsWith("/auth");
      const isProtectedRoute =
        pathname.startsWith("/checkout") ||
        pathname.startsWith("/orders") ||
        pathname.startsWith("/profile") ||
        isAdminRoute;

      if (isProtectedRoute && !isLoggedIn) {
        return false;
      }

      if (isAdminRoute && role !== "ADMIN") {
        return Response.redirect(new URL("/", request.nextUrl));
      }

      if (isAuthRoute && isLoggedIn) {
        const publicAuthPaths = ["/auth/verify-email", "/auth/reset-password"];
        const isPublicAuth = publicAuthPaths.some((path) =>
          pathname.startsWith(path),
        );
        if (!isPublicAuth) {
          return Response.redirect(new URL("/", request.nextUrl));
        }
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "CUSTOMER" | "ADMIN";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
