import { Event } from '../../types';
import {
  convertEventToDateRange,
  findOverlappingEvents,
  isOverlapping,
  parseDateTime,
} from '../../utils/eventOverlap';

expect.extend({
  toBeInvalidDate(received: Date) {
    const pass = received instanceof Date && isNaN(received.getTime());
    return {
      pass,
      message: () => `expected ${received} to be an Invalid Date`,
    };
  },
});

describe('parseDateTime', () => {
  it('2024-07-01 14:30을 정확한 Date 객체로 변환한다', () => {
    const date = parseDateTime('2024-07-01', '14:30');
    expect(date).toEqual(new Date('2024-07-01T14:30:00'));
  });

  it('잘못된 날짜 형식에 대해 Invalid Date를 반환한다', () => {
    const date = parseDateTime('invalid date', '14:30');
    expect(date).toBeInvalidDate();
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    const date = parseDateTime('2024-07-01', 'invalid time');
    expect(date).toBeInvalidDate();
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    const date = parseDateTime('', '14:30');
    expect(date).toBeInvalidDate();
  });
});

describe.only('convertEventToDateRange', () => {
  it('일반적인 이벤트를 올바른 시작 및 종료 시간을 가진 객체로 변환한다', () => {
    const dateRange = convertEventToDateRange({
      id: '1',
      title: '일반적인 이벤트',
      date: '2024-07-01',
      startTime: '14:30',
      endTime: '15:30',
      description: '일반적인 이벤트 설명',
      location: '일반적인 이벤트 장소',
      category: '일반',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    });

    expect(dateRange).toEqual({
      start: new Date('2024-07-01T14:30:00'),
      end: new Date('2024-07-01T15:30:00'),
    });
  });

  it('잘못된 날짜 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const dateRange = convertEventToDateRange({
      id: '1',
      title: '잘못된 날짜 형식의 이벤트',
      date: 'invalid date',
      startTime: '14:30',
      endTime: '15:30',
      description: '잘못된 날짜 형식의 이벤트 설명',
      location: '잘못된 날짜 형식의 이벤트 장소',
      category: '잘못된 날짜 형식의 이벤트 카테고리',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    });

    expect(dateRange.start).toBeInvalidDate();
    expect(dateRange.end).toBeInvalidDate();
  });

  it('잘못된 시간 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const dateRange = convertEventToDateRange({
      id: '1',
      title: '잘못된 시간 형식의 이벤트',
      date: '2024-07-01',
      startTime: 'invalid time',
      endTime: 'invalid time',
      description: '잘못된 시간 형식의 이벤트 설명',
      location: '잘못된 시간 형식의 이벤트 장소',
      category: '잘못된 시간 형식의 이벤트 카테고리',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    });

    expect(dateRange.start).toBeInvalidDate();
    expect(dateRange.end).toBeInvalidDate();
  });
});

describe('isOverlapping', () => {
  it('두 이벤트가 겹치는 경우 true를 반환한다', () => {});

  it('두 이벤트가 겹치지 않는 경우 false를 반환한다', () => {});
});

describe('findOverlappingEvents', () => {
  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {});

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {});
});
