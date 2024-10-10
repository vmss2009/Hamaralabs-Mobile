/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(pages)/school-data/components/Card` | `/(pages)/school-data/form` | `/(pages)/school-data/report` | `/(pages)/student-data/form` | `/(tabs)/login` | `/_sitemap` | `/login` | `/school-data/components/Card` | `/school-data/form` | `/school-data/report` | `/student-data/form` | `/styles/global.styles`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
