import { fetchHolidays } from '../../apis/fetchHolidays';

describe('fetchHolidays', () => {
  it('주어진 월의 공휴일만 반환한다', () => {
    expect(fetchHolidays(new Date('2024-01-01'))).toEqual({
      '2024-01-01': '신정',
    });

    expect(fetchHolidays(new Date('2024-02-01'))).toEqual({
      '2024-02-09': '설날',
      '2024-02-10': '설날',
      '2024-02-11': '설날',
    });

    expect(fetchHolidays(new Date('2024-03-01'))).toEqual({
      '2024-03-01': '삼일절',
    });

    expect(fetchHolidays(new Date('2024-05-01'))).toEqual({
      '2024-05-05': '어린이날',
    });

    expect(fetchHolidays(new Date('2024-06-01'))).toEqual({
      '2024-06-06': '현충일',
    });

    expect(fetchHolidays(new Date('2024-08-01'))).toEqual({
      '2024-08-15': '광복절',
    });

    expect(fetchHolidays(new Date('2024-09-01'))).toEqual({
      '2024-09-16': '추석',
      '2024-09-17': '추석',
      '2024-09-18': '추석',
    });

    expect(fetchHolidays(new Date('2024-10-01'))).toEqual({
      '2024-10-03': '개천절',
      '2024-10-09': '한글날',
    });

    expect(fetchHolidays(new Date('2024-12-01'))).toEqual({
      '2024-12-25': '크리스마스',
    });
  });

  it('공휴일이 없는 월에 대해 빈 객체를 반환한다', () => {
    expect(fetchHolidays(new Date('2024-04-01'))).toEqual({});
  });

  it('여러 공휴일이 있는 월에 대해 모든 공휴일을 반환한다', () => {
    expect(fetchHolidays(new Date('2024-02-01'))).toEqual({
      '2024-02-09': '설날',
      '2024-02-10': '설날',
      '2024-02-11': '설날',
    });
  });
});
