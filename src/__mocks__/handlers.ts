import { http, HttpResponse } from 'msw';

import { Event } from '../types';
import { events } from './response/events.json' assert { type: 'json' };

// ! HARD
// ! 각 응답에 대한 MSW 핸들러를 작성해주세요. GET 요청은 이미 작성되어 있는 events json을 활용해주세요.
let mockEvents = [...events];

export const resetMockEvents = () => {
  mockEvents = [...events];
};

export const addMockEvent = (event: Event) => {
  mockEvents = [...mockEvents, event];
};

export const handlers = [
  http.get('/api/events', () => {
    return HttpResponse.json({ events: mockEvents });
  }),

  http.post('/api/events', async ({ request }) => {
    const newEvent = (await request.json()) as Event;
    newEvent.id = String(mockEvents.length + 1);
    addMockEvent(newEvent);

    return HttpResponse.json(newEvent, { status: 201 });
  }),

  http.put('/api/events/:id', async ({ params, request }) => {
    const { id } = params;
    const updatedEvent = (await request.json()) as Event;
    const index = mockEvents.findIndex((event) => event.id === id);

    if (index !== -1) {
      mockEvents[index] = updatedEvent;
      return HttpResponse.json(updatedEvent);
    }

    return new HttpResponse(null, { status: 404 });
  }),

  http.delete('/api/events/:id', ({ params }) => {
    const { id } = params;
    const index = mockEvents.findIndex((event) => event.id === id);

    if (index !== -1) {
      mockEvents.splice(index, 1);
      return new HttpResponse(null, { status: 204 });
    }

    return new HttpResponse(null, { status: 404 });
  }),
];
