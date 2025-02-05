import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, within, act, cleanup } from '@testing-library/react';
import { UserEvent, userEvent } from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { ReactElement } from 'react';

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

  it.only('제목, 날짜, 시작 시간, 종료 시간, 설명, 위치, 카테고리를 입력 후 이벤트를 추가하면 이벤트 리스트에서 확인 할 수 있다.', async () => {
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

  it('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영된다', async () => {});

  it('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {});
});

describe('일정 뷰', () => {
  it('주별 뷰를 선택 후 해당 주에 일정이 없으면, 일정이 표시되지 않는다.', async () => {});

  it('주별 뷰 선택 후 해당 일자에 일정이 존재한다면 해당 일정이 정확히 표시된다', async () => {});

  it('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {});

  it('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {});

  it('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {});
});

describe('검색 기능', () => {
  it('검색 결과가 없으면, "검색 결과가 없습니다."가 표시되어야 한다.', async () => {});

  it("'팀 회의'를 검색하면 해당 제목을 가진 일정이 리스트에 노출된다", async () => {});

  it('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {});
});

describe('일정 충돌', () => {
  it('겹치는 시간에 새 일정을 추가할 때 경고가 표시된다', async () => {});

  it('기존 일정의 시간을 수정하여 충돌이 발생하면 경고가 노출된다', async () => {});
});

it('notificationTime을 10으로 하면 지정 시간 10분 전 알람 텍스트가 노출된다', async () => {});
