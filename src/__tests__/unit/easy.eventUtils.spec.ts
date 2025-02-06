import { Event } from '../../types';
import { getFilteredEvents } from '../../utils/eventUtils';

describe('getFilteredEvents', () => {
  const events: Event[] = [
    {
      id: '1',
      title: '이벤트 1',
      date: '2025-02-01',
      startTime: '14:30',
      endTime: '15:30',
      description: '이벤트 1 설명',
      location: '이벤트 1 장소',
      category: '이벤트 1 카테고리',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    },
    {
      id: '2',
      title: '이벤트 2',
      date: '2025-02-01',
      startTime: '14:30',
      endTime: '15:30',
      description: '이벤트 2 설명',
      location: '이벤트 2 장소',
      category: '이벤트 2 카테고리',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    },
    {
      id: '3',
      title: '이벤트 3',
      date: '2025-02-07',
      startTime: '14:30',
      endTime: '15:30',
      description: '이벤트 3 설명',
      location: '이벤트 3 장소',
      category: '이벤트 3 카테고리',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    },
    {
      id: '4',
      title: '제목 1',
      date: '2025-02-01',
      startTime: '14:30',
      endTime: '15:30',
      description: '제목 1 설명',
      location: '제목 1 장소',
      category: '제목 1 카테고리',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    },
    {
      id: '5',
      title: 'EVENT 1',
      date: '2025-02-11',
      startTime: '14:30',
      endTime: '15:30',
      description: 'EVENT 1 설명',
      location: 'EVENT 1 장소',
      category: 'EVENT 1 카테고리',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    },
  ];

  it("검색어 '이벤트 2'에 맞는 이벤트만 반환한다", () => {
    const result = getFilteredEvents(events, '이벤트 2', new Date('2025-02-01'), 'week');

    expect(result).toEqual([events[1]]);
  });

  it('주간 뷰에서 2025-02-01 주의 이벤트만 반환한다', () => {
    const result = getFilteredEvents(events, '', new Date('2025-02-01'), 'week');

    expect(result).toEqual([events[0], events[1], events[3]]);
  });

  it('월간 뷰에서 2025-02-01 월의 모든 이벤트를 반환한다', () => {
    const result = getFilteredEvents(events, '', new Date('2025-02-01'), 'month');

    expect(result).toEqual(events);
  });

  it("검색어 '이벤트'와 주간 뷰 필터링을 동시에 적용한다", () => {
    const result = getFilteredEvents(events, '이벤트', new Date('2025-02-01'), 'week');

    expect(result).toEqual([events[0], events[1]]);
  });

  it('검색어가 없을 때 모든 이벤트를 반환한다', () => {
    const result = getFilteredEvents(events, '', new Date('2025-02-01'), 'month');

    expect(result).toEqual(events);
  });

  it('검색어가 대소문자를 구분하지 않고 작동한다', () => {
    const result = getFilteredEvents(events, 'event 1', new Date('2025-02-01'), 'month');

    expect(result).toEqual([events[4]]);
  });

  it('월의 경계에 있는 이벤트를 올바르게 필터링한다', () => {
    const result = getFilteredEvents(events, '', new Date('2025-02-01'), 'month');

    expect(result).toEqual(events);
  });

  it('빈 이벤트 리스트에 대해 빈 배열을 반환한다', () => {
    const result = getFilteredEvents([], '', new Date('2025-02-01'), 'month');

    expect(result).toEqual([]);
  });
});
