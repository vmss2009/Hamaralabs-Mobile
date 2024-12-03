/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(pages)/payments/PaymentsReportBox` | `/(pages)/payments/Receipt` | `/(pages)/payments/payments` | `/(pages)/school-data/components/Card` | `/(pages)/school-data/form` | `/(pages)/school-data/report` | `/(pages)/student-data/components/card` | `/(pages)/student-data/form` | `/(pages)/student-data/report` | `/(pages)/student-snapshot/components/CompetitionCard` | `/(pages)/student-snapshot/components/CoursesCard` | `/(pages)/student-snapshot/components/SessionCard` | `/(pages)/student-snapshot/components/Taskscard` | `/(pages)/student-snapshot/components/TinkeringActivityCard` | `/(pages)/student-snapshot/snapshot` | `/(pages)/task-activities/components/Card` | `/(pages)/task-activities/components/Reportbox` | `/(pages)/task-activities/form` | `/(tabs)/login` | `/_sitemap` | `/login` | `/payments/PaymentsReportBox` | `/payments/Receipt` | `/payments/payments` | `/school-data/components/Card` | `/school-data/form` | `/school-data/report` | `/student-data/components/card` | `/student-data/form` | `/student-data/report` | `/student-snapshot/components/CompetitionCard` | `/student-snapshot/components/CoursesCard` | `/student-snapshot/components/SessionCard` | `/student-snapshot/components/Taskscard` | `/student-snapshot/components/TinkeringActivityCard` | `/student-snapshot/snapshot` | `/styles/global.styles` | `/task-activities/components/Card` | `/task-activities/components/Reportbox` | `/task-activities/form`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
