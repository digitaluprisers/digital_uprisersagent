import type { CanvasEventBusEvents } from '@/types';
import { createEventBus } from '@Digital Uprisers/utils/event-bus';

export const canvasEventBus = createEventBus<CanvasEventBusEvents>();
