import 'reflect-metadata';

jest.mock('@sentry/node');
jest.mock('@digitaluprisers.com/license-sdk');
jest.mock('@/telemetry');
jest.mock('@/eventbus/message-event-bus/message-event-bus');
jest.mock('@/push');
jest.mock('node:fs');
jest.mock('node:fs/promises');
