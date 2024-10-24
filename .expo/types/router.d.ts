/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(pages)/chat/chat` | `/(pages)/chat/components/MediaViewer` | `/(pages)/chat/dashboard` | `/(pages)/payments/payments` | `/(pages)/student-snapshot/components/CompetitionCard` | `/(pages)/student-snapshot/components/CoursesCard` | `/(pages)/student-snapshot/components/SessionCard` | `/(pages)/student-snapshot/components/TinkeringActivityCard` | `/(pages)/student-snapshot/snapshot` | `/(tabs)/login` | `/_sitemap` | `/chat/chat` | `/chat/components/MediaViewer` | `/chat/dashboard` | `/login` | `/payments/payments` | `/student-snapshot/components/CompetitionCard` | `/student-snapshot/components/CoursesCard` | `/student-snapshot/components/SessionCard` | `/student-snapshot/components/TinkeringActivityCard` | `/student-snapshot/snapshot`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
