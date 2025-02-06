import { Event } from '../../types';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';

describe('getUpcomingEvents', () => {
  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {});

  it('이미 알림이 간 이벤트는 제외한다', () => {});

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {});

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {});
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', () => {
    const result = createNotificationMessage({
      id: '1',
      title: '이벤트 1',
      date: '2025-02-01',
      startTime: '14:30',
      endTime: '15:30',
      description: '이벤트 1 설명',
      location: '이벤트 1 장소',
      category: '이벤트 1 카테고리',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    });

    expect(result).toBe('10분 후 이벤트 1 일정이 시작됩니다.');
  });
});
