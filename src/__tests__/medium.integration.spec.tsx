import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, within, act, cleanup } from '@testing-library/react';
import { UserEvent, userEvent } from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { ReactElement } from 'react';

import { addMockEvent } from '../__mocks__/handlers';
import App from '../App';
import { server } from '../setupTests';
import { Event } from '../types';

describe('일정 CRUD 및 기본 기능', () => {
  let user: UserEvent;

  beforeEach(() => {
    vi.setSystemTime('2024-10-01');

    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    user = userEvent.setup();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('제목, 날짜, 시작 시간, 종료 시간을 입력하지 않으면 "필수 정보를 모두 입력해주세요." 토스트 메시지가 표시된다.', async () => {
    const addButton = screen.getByRole('button', { name: '일정 추가' });
    await user.click(addButton);

    const toastMessage = await screen.getByText('필수 정보를 모두 입력해주세요.');
    expect(toastMessage).toBeInTheDocument();
  });

  it('제목, 날짜, 시작 시간, 종료 시간, 설명, 위치, 카테고리를 입력 후 이벤트를 추가하면 이벤트 리스트에서 확인 할 수 있다.', async () => {
    const newEvent = {
      title: '테스트 일정',
      date: '2024-10-01',
      startTime: '10:00',
      endTime: '11:00',
      description: '테스트 일정에 대한 설명',
      location: '테스트 일정의 장소',
      category: '업무',
    };

    const titleInput = screen.getByLabelText('제목');
    await user.type(titleInput, newEvent.title);

    const dateInput = screen.getByLabelText('날짜');
    await user.type(dateInput, newEvent.date);

    const startTimeInput = screen.getByLabelText('시작 시간');
    await user.type(startTimeInput, newEvent.startTime);

    const endTimeInput = screen.getByLabelText('종료 시간');
    await user.type(endTimeInput, newEvent.endTime);

    const descriptionInput = screen.getByLabelText('설명');
    await user.type(descriptionInput, newEvent.description);

    const locationInput = screen.getByLabelText('위치');
    await user.type(locationInput, newEvent.location);

    const categorySelect = screen.getByLabelText('카테고리');
    await user.selectOptions(categorySelect, newEvent.category);

    const addButton = screen.getByRole('button', { name: '일정 추가' });
    await user.click(addButton);

    const eventList = await screen.findByTestId('event-list');
    const updatedEvents = await within(eventList).findAllByRole('listitem');
    screen.debug(eventList);
    const latestEvent = updatedEvents[updatedEvents.length - 1];

    expect(within(latestEvent).getByText(newEvent.title)).toBeInTheDocument();
    expect(within(latestEvent).getByText(newEvent.date)).toBeInTheDocument();
    expect(within(latestEvent).getByText(new RegExp(newEvent.startTime))).toBeInTheDocument();
    expect(within(latestEvent).getByText(new RegExp(newEvent.endTime))).toBeInTheDocument();
    expect(within(latestEvent).getByText(newEvent.description)).toBeInTheDocument();
    expect(within(latestEvent).getByText(newEvent.location)).toBeInTheDocument();
    expect(within(latestEvent).getByText(new RegExp(newEvent.category))).toBeInTheDocument();
  });

  it('기존 일정의 제목, 날짜, 시간, 설명, 위치, 카테고리, 알림을 수정하면 변경사항이 반영된다', async () => {
    const eventList = await screen.findByTestId('event-list');
    const eventItems = await within(eventList).findAllByRole('listitem');
    const targetEvent = eventItems[0];

    const editButton = within(targetEvent).getByLabelText('Edit event');
    await user.click(editButton);

    const titleInput = screen.getByLabelText('제목');
    await user.clear(titleInput);
    await user.type(titleInput, '수정된 일정');

    const dateInput = screen.getByLabelText('날짜');
    await user.clear(dateInput);
    await user.type(dateInput, '2024-10-02');

    const startTimeInput = screen.getByLabelText('시작 시간');
    await user.clear(startTimeInput);
    await user.type(startTimeInput, '11:00');

    const endTimeInput = screen.getByLabelText('종료 시간');
    await user.clear(endTimeInput);
    await user.type(endTimeInput, '12:00');

    const descriptionInput = screen.getByLabelText('설명');
    await user.clear(descriptionInput);
    await user.type(descriptionInput, '수정된 일정에 대한 설명');

    const locationInput = screen.getByLabelText('위치');
    await user.clear(locationInput);
    await user.type(locationInput, '수정된 일정의 장소');

    const categorySelect = screen.getByLabelText('카테고리');
    await user.selectOptions(categorySelect, '개인');

    const notificationTimeSelect = screen.getByLabelText('알림 설정');
    await user.selectOptions(notificationTimeSelect, '1분 전');

    const addButton = screen.getByRole('button', { name: '일정 수정' });
    await user.click(addButton);

    expect(within(targetEvent).getByText('수정된 일정')).toBeInTheDocument();
    expect(within(targetEvent).getByText('2024-10-02')).toBeInTheDocument();
    expect(within(targetEvent).getByText(/11:00/)).toBeInTheDocument();
    expect(within(targetEvent).getByText(/12:00/)).toBeInTheDocument();
    expect(within(targetEvent).getByText('수정된 일정에 대한 설명')).toBeInTheDocument();
    expect(within(targetEvent).getByText('수정된 일정의 장소')).toBeInTheDocument();
    expect(within(targetEvent).getByText(/개인/)).toBeInTheDocument();
    expect(within(targetEvent).getByText(/1분 전/)).toBeInTheDocument();
  });

  it('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {
    const eventList = await screen.findByTestId('event-list');
    const eventItems = await within(eventList).findAllByRole('listitem');
    const targetEvent = eventItems[0];

    const deleteButton = within(targetEvent).getByLabelText('Delete event');
    await user.click(deleteButton);

    expect(targetEvent).not.toBeInTheDocument();
  });
});

const renderByDate = (date: Date, component: ReactElement) => {
  vi.setSystemTime(date);
  render(component);
};

describe('일정 뷰', () => {
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it('주별 뷰를 선택 후 해당 주에 일정이 없으면, 일정이 표시되지 않는다.', async () => {
    renderByDate(
      new Date('2024-10-01'),
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    const viewSelect = screen.getByLabelText('view');
    await user.selectOptions(viewSelect, 'Week'); // select 값들은 보통 상수화 시켜서 관리하나요?

    const eventList = await screen.findByTestId('event-list');

    expect(within(eventList).getByText('검색 결과가 없습니다.')).toBeInTheDocument();
  });

  it('주별 뷰 선택 후 해당 일자에 일정이 존재한다면 해당 일정이 정확히 표시된다', async () => {
    addMockEvent({
      id: '999',
      title: '테스트 일정',
      date: '2024-10-01',
      startTime: '10:00',
      endTime: '11:00',
      description: '테스트 일정에 대한 설명',
      location: '테스트 일정의 장소',
      category: '업무',
      repeat: {
        type: 'none',
        interval: 0,
      },
      notificationTime: 10,
    });

    renderByDate(
      new Date('2024-10-01'),
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    const viewSelect = screen.getByLabelText('view');
    await user.selectOptions(viewSelect, 'Week');

    const eventItem = await screen.findByTestId('event-item-999');

    expect(within(eventItem).getByText('테스트 일정')).toBeInTheDocument();
    expect(within(eventItem).getByText(/10:00/)).toBeInTheDocument();
    expect(within(eventItem).getByText(/11:00/)).toBeInTheDocument();
    expect(within(eventItem).getByText('테스트 일정에 대한 설명')).toBeInTheDocument();
    expect(within(eventItem).getByText('테스트 일정의 장소')).toBeInTheDocument();
    expect(within(eventItem).getByText(/업무/)).toBeInTheDocument();
  });

  it('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
    renderByDate(
      new Date('2024-11-01'),
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    const viewSelect = screen.getByLabelText('view');
    await user.selectOptions(viewSelect, 'Month');

    const eventList = await screen.findByTestId('event-list');

    expect(within(eventList).getByText('검색 결과가 없습니다.')).toBeInTheDocument();
  });

  it('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
    addMockEvent({
      id: '999',
      title: '테스트 일정',
      date: '2024-10-01',
      startTime: '10:00',
      endTime: '11:00',
      description: '테스트 일정에 대한 설명',
      location: '테스트 일정의 장소',
      category: '업무',
      repeat: {
        type: 'none',
        interval: 0,
      },
      notificationTime: 10,
    });

    renderByDate(
      new Date('2024-10-01'),
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    const viewSelect = screen.getByLabelText('view');
    await user.selectOptions(viewSelect, 'Month');

    const eventItem = await screen.findByTestId('event-item-999');

    expect(eventItem).toBeInTheDocument();
  });

  it('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {
    renderByDate(
      new Date('2024-01-01'),
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    const calendar = await screen.findByTestId('month-view');
    const firstDayCell = within(calendar).getByText('1').closest('td');

    expect(firstDayCell).not.toBeNull();
    expect(within(firstDayCell as HTMLElement).getByLabelText('holiday')).toBeInTheDocument();
  });
});

describe('검색 기능', () => {
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it('검색 결과가 없으면, "검색 결과가 없습니다."가 표시되어야 한다.', async () => {
    renderByDate(
      new Date('2024-10-01'),
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    const searchInput = screen.getByPlaceholderText('검색어를 입력하세요');
    await user.type(searchInput, '없는 일정');

    const eventList = await screen.findByTestId('event-list');

    expect(within(eventList).getByText('검색 결과가 없습니다.')).toBeInTheDocument();
  });

  it("'팀 회의'를 검색하면 해당 제목을 가진 일정이 리스트에 노출된다", async () => {
    addMockEvent({
      id: '999',
      title: '팀 회의',
      date: '2024-10-01',
      startTime: '10:00',
      endTime: '11:00',
      description: '팀 회의에 대한 설명',
      location: '팀 회의의 장소',
      category: '업무',
      repeat: {
        type: 'none',
        interval: 0,
      },
      notificationTime: 10,
    });

    renderByDate(
      new Date('2024-10-01'),
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    const searchInput = screen.getByPlaceholderText('검색어를 입력하세요');
    await user.type(searchInput, '팀 회의');

    const eventList = await screen.findByTestId('event-list');

    expect(within(eventList).getByText('팀 회의')).toBeInTheDocument();
  });

  it('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {
    renderByDate(
      new Date('2024-10-01'),
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    const eventList = await screen.findByTestId('event-list');
    const initialEvents = await within(eventList).findAllByRole('listitem');
    expect(initialEvents.length).toBe(1);

    const searchInput = screen.getByPlaceholderText('검색어를 입력하세요');
    await user.type(searchInput, '없는 일정');

    await screen.findByText('검색 결과가 없습니다.');

    await user.clear(searchInput);

    const restoredEvents = await within(eventList).findAllByRole('listitem');
    expect(restoredEvents.length).toBe(1);
  });
});

describe('일정 충돌', () => {
  let user: UserEvent;

  beforeEach(() => {
    addMockEvent({
      id: '999',
      title: '팀 회의',
      date: '2024-10-01',
      startTime: '10:00',
      endTime: '11:00',
      description: '팀 회의에 대한 설명',
      location: '팀 회의의 장소',
      category: '업무',
      repeat: {
        type: 'none',
        interval: 0,
      },
      notificationTime: 10,
    });

    user = userEvent.setup();
  });

  it('겹치는 시간에 새 일정을 추가할 때 경고가 표시된다', async () => {
    renderByDate(
      new Date('2024-10-01'),
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    const titleInput = screen.getByLabelText('제목');
    await user.type(titleInput, '새로운 일정');

    const dateInput = screen.getByLabelText('날짜');
    await user.type(dateInput, '2024-10-01');

    const startTimeInput = screen.getByLabelText('시작 시간');
    await user.type(startTimeInput, '10:00');

    const endTimeInput = screen.getByLabelText('종료 시간');
    await user.type(endTimeInput, '11:00');

    const addButton = screen.getByRole('button', { name: '일정 추가' });
    await user.click(addButton);

    expect(screen.getByText('일정 겹침 경고')).toBeInTheDocument();
  });

  it('기존 일정의 시간을 수정하여 충돌이 발생하면 경고가 노출된다', async () => {
    renderByDate(
      new Date('2024-10-01'),
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    const eventItem = await screen.findByTestId('event-item-1');

    const editButton = within(eventItem).getByLabelText('Edit event');
    await user.click(editButton);

    const dateInput = screen.getByLabelText('날짜');
    await user.clear(dateInput);
    await user.type(dateInput, '2024-10-01');

    const startTimeInput = screen.getByLabelText('시작 시간');
    await user.clear(startTimeInput);
    await user.type(startTimeInput, '10:00');

    const endTimeInput = screen.getByLabelText('종료 시간');
    await user.clear(endTimeInput);
    await user.type(endTimeInput, '11:00');

    const addButton = screen.getByRole('button', { name: '일정 수정' });
    await user.click(addButton);

    expect(screen.getByText('일정 겹침 경고')).toBeInTheDocument();
  });
});

describe('알림 기능', () => {
  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it('notificationTime을 10으로 하면 지정 시간 10분 전 알람 텍스트가 노출된다', async () => {
    addMockEvent({
      id: '999',
      title: '팀 회의',
      date: '2024-10-01',
      startTime: '10:00',
      endTime: '11:00',
      description: '팀 회의에 대한 설명',
      location: '팀 회의의 장소',
      category: '업무',
      repeat: {
        type: 'none',
        interval: 0,
      },
      notificationTime: 10,
    });

    renderByDate(
      new Date('2024-10-01T09:49:00'),
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    expect(await screen.queryByText('10분 후 팀 회의 일정이 시작됩니다.')).toBeNull();

    vi.setSystemTime('2024-10-01T09:50:00');

    expect(await screen.findByText('10분 후 팀 회의 일정이 시작됩니다.')).toBeInTheDocument();
  });
});
