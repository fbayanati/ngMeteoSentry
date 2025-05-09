import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import * as Sentry from '@sentry/angular';

// bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));

Sentry.init({
  dsn: 'https://9c7efd25b55a953687e35906052c5731@o4509261258293248.ingest.us.sentry.io/4509285372133376',
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      // Additional SDK configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.browserProfilingIntegration(), // Add browser profiling integration to the list of integrations
  ],
  // Tracing
  tracesSampleRate: 0.5, // between 0 to 1, 1 means Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

Sentry.startSpan(
  {
    name: 'bootstrap-angular-application',
    op: 'ui.angular.bootstrap',
  },
  async () => {
    await bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
  }
);
