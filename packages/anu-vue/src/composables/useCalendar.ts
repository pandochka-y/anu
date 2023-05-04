import dayjs from 'dayjs'
import ru from 'dayjs/locale/ru'
import localeData from 'dayjs/plugin/localeData'
import toObject from 'dayjs/plugin/toObject'
import updateLocale from 'dayjs/plugin/updateLocale'
import utc from 'dayjs/plugin/utc'

import type { Dayjs } from 'dayjs'

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

export type TKeyDisplayTime = 'hours' | 'minutes'
type TDisplayTime = Record<TKeyDisplayTime, { value: string; max: number }>

// interface DisplayTime {

//   // [key: string]: { value: string; max: number }
//   hours: { value: string; max: number }
//   minutes: { value: string; max: number }
// }

export function useCalendar(dateProps?: Date) {
  const date = ref(dayjs(dateProps).locale('ru'))

  if (!dateProps)
    date.value = date.value.startOf('hour')

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

  const displayTime = ref<TDisplayTime>({
    hours: { value: date.value.hour().toString(), max: 24 },
    minutes: { value: changeTime(date.value.minute(), 60), max: 60 },
  })

  const weekDays = dayjs.weekdaysMin(true)

  return {
    date,
    calendar,
    displayTime,
    weekDays,

    setMonth: setMonth(date),
    handleClick: handleClick(date, calendar),
    setDisplayTime: setDisplayTime(displayTime, date),
    isSelectDate: isSelectDate(calendar),
    isCurrentDate: isCurrentDate(calendar, date, currentDate),
    isInactiveDate: isInactiveDate(calendar),
    isWeekend,
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

function updateDate(displayTime: Ref<TDisplayTime>, date: Ref<Dayjs>) {
  date.value = date.value.set('minute', parseInt(displayTime.value.minutes?.value || '0')).set('hours', parseInt(displayTime.value.hours?.value || '0'))
}

function setDisplayTime(displayTime: Ref<TDisplayTime>, date: Ref<Dayjs>) {
  return function (v: number, id: TKeyDisplayTime, isButton = true) {
    const obj = displayTime.value[id]

    const time = isButton ? parseInt(obj.value) + v : v
    const display = changeTime(time, obj.max)

    obj.value = display

    displayTime.value = {
      ...displayTime.value,
      [id]: { ...obj },
    }

    updateDate(displayTime, date)
  }
}

// function setHours(displayTime: Ref<DisplayTime>, date: Ref<Dayjs>) {
//   return function (v: number, isButton = true) {
//     const time = isButton ? parseInt(displayTime.value.hours || '0') + v : v
//     const display = changeTime(time, 24)

//     displayTime.value = {
//       ...displayTime.value,
//       hours: display,
//     }
//     date.value = date.value.set('minute', parseInt(displayTime.value.minutes)).set('hours', parseInt(displayTime.value.hours))
//   }
// }

// function setMinutes(displayTime: Ref<DisplayTime>, date: Ref<Dayjs>) {
//   return function (v: number, isButton = true) {
//     const time = isButton ? parseInt(displayTime.value.hours || '0') + v : v
//     const display = changeTime(time, 60)

//     displayTime.value = {
//       ...displayTime.value,
//       minutes: display,
//     }

//     date.value = date.value.set('minute', parseInt(displayTime.value.minutes)).set('hours', parseInt(displayTime.value.hours))
//   }
// }

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
