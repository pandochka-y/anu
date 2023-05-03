import dayjs from 'dayjs'
import ru from 'dayjs/locale/ru'
import localeData from 'dayjs/plugin/localeData'
import toObject from 'dayjs/plugin/toObject'
import updateLocale from 'dayjs/plugin/updateLocale'
import utc from 'dayjs/plugin/utc'

import type { Dayjs } from 'dayjs'

// import type { Dayjs } from 'dayjs/plugin/toObject'

dayjs.extend(localeData)
dayjs.extend(updateLocale)
dayjs.locale(ru)
dayjs.extend(utc)
dayjs.extend(toObject)

interface Calendar {
  date: ReturnType<Dayjs['toObject']>
  start: number
  end: number
  range: number[]
}

interface DisplayTime { hours: string; minutes: string }

export function useDate(dateProps: Date | undefined) {
  const date = ref(dayjs(dateProps).locale('ru'))

  const currentDate = ref(dayjs())

  const calendar = computed(() => {
    const startOfMonth = date.value.startOf('month')
    const lastMonth = date.value.add(-1, 'month')
    const startOfWeek = startOfMonth.subtract((startOfMonth.day() + 6) % 7, 'day')

    const r = startOfWeek.date() === 1
      ? range(startOfWeek.date(), startOfMonth.daysInMonth())
      : range(startOfWeek.date(), lastMonth.daysInMonth()).concat(range(1, startOfMonth.daysInMonth()))

    return {
      date: date.value.toObject(),
      start: (startOfMonth.day() + 6) % 7,
      end: r.length,
      range: r.concat(range(1, 42 - r.length)),
    }
  })

  const displayTime = ref<DisplayTime>({
    hours: date.value.hour().toString(),
    minutes: '00',
  })

  return {
    date,
    calendar,
    displayTime,

    setMonth: setMonth(date),
    handleClick: handleClick(date, calendar),
  }
}

function setMonth(date: Ref<Dayjs>) {
  return (v: number) =>
    date.value = date.value.add(v, 'month')
}

function handleClick(date: Ref<Dayjs>, calendar: ComputedRef<Calendar>) {
  return function (index: number, val: number) {
    if (index < calendar.value.start)
      date.value = date.value.subtract(1, 'month')

    else if (index >= calendar.value.end)
      date.value = date.value.add(1, 'month')

    date.value = date.value.date(val)
  }
}

function changeTime(time: number, max: number) {
  if (time < 0 || time >= max)
    time = (time + max) % max

  return time < 10 ? `0${time}` : `${time}`
}

function setHours(displayTime: Ref<DisplayTime>) {
  return function (v: number) {
    const time = parseInt(displayTime.value.hours) + v
    const display = changeTime(time, 24)

    displayTime.value = {
      ...displayTime.value,
      hours: display,
    }
  }
}

function setMinutes(displayTime: Ref<DisplayTime>) {
  return function (v: number) {
    const time = parseInt(displayTime.value.minutes) + v
    const display = changeTime(time, 60)

    displayTime.value = {
      ...displayTime.value,
      minutes: display,
    }
  }
}

function isSelectDate(calendar: ComputedRef<Calendar>) {
  return function (item: number, index: number) {
    return (item === calendar.value.date.date)
    && (index >= calendar.value.start) && (index < calendar.value.end)
  }
}

function isCurrentDate(calendar: ComputedRef<Calendar>, date: Ref<Dayjs>, currentDate: Ref<Dayjs>) {
  return function (item: number, index: number) {
    if (index < calendar.value.start || index >= calendar.value.end)
      return false

    return currentDate.value.month() === date.value.month() && currentDate.value.date() === item
  }
}

function isWeekend(index: number) {
  return index % 7 > 4
}

function isInactiveDate(calendar: ComputedRef<Calendar>) {
  return function (index: number) {
    return index >= calendar.value.end || index < calendar.value.start
  }
}

function range(start: number, end: number) {
  return Array.from({ length: (end - start + 1) }, (v, k) => k + start)
}
