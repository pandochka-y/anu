<script lang="ts" setup>
import dayjs from 'dayjs'
import ru from 'dayjs/locale/ru'
import localeData from 'dayjs/plugin/localeData'
import toObject from 'dayjs/plugin/toObject'
import updateLocale from 'dayjs/plugin/updateLocale'
import utc from 'dayjs/plugin/utc'

import { datePickerProps } from './props'

import { useLayer } from '@/composables'

const props = defineProps(datePickerProps)

defineOptions({
  name: 'ADatePicker',
  inheritAttrs: false,
})

dayjs.extend(localeData)
dayjs.extend(updateLocale)
dayjs.locale(ru)
dayjs.extend(utc)
dayjs.extend(toObject)

const date = ref(dayjs().locale('ru'))

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

function range(start: number, end: number) {
  return Array.from({ length: (end - start + 1) }, (v, k) => k + start)
}

function setMonth(v: number) {
  date.value = date.value.add(v, 'month')
}

function handleClick(index: number, val: number) {
  if (index < calendar.value.start)
    date.value = date.value.subtract(1, 'month')

  else if (index >= calendar.value.end)
    date.value = date.value.add(1, 'month')

  date.value = date.value.date(val)
}

const displayTime = ref<{ hours: string; minutes: string }>({
  hours: date.value.hour().toString(),
  minutes: '00',
})

const parentEl = ref<HTMLElement | null>(null)

const calendarFloatingRef = ref<HTMLElement | null>(null)

const weekDays = dayjs.weekdaysMin(true)

const { getLayerClasses } = useLayer()

const { styles, classes } = getLayerClasses(
  toRef(props, 'color'),
  toRef(props, 'variant'),
  toRef(props, 'states'),
)

function changeTime(time: number, max: number) {
  if (time < 0 || time >= max)
    time = (time + max) % max

  return time < 10 ? `0${time}` : `${time}`
}

function setHours(v: number) {
  const time = parseInt(displayTime.value.hours) + v
  const display = changeTime(time, 24)

  displayTime.value = {
    ...displayTime.value,
    hours: display,
  }
}

function setMinutes(v: number) {
  const time = parseInt(displayTime.value.minutes) + v
  const display = changeTime(time, 60)

  displayTime.value = {
    ...displayTime.value,
    minutes: display,
  }
}

function isSelectDate(item: number, index: number) {
  return (item === calendar.value.date.date)
            && (index >= calendar.value.start) && (index < calendar.value.end)
}

function isCurrentDate(item: number, index: number) {
  if (index < calendar.value.start || index >= calendar.value.end)
    return false

  return currentDate.value.month() === date.value.month() && currentDate.value.date() === item
}

function isWeekend(index: number) {
  return index % 7 > 4
}

function isInactiveDate(index: number) {
  return index >= calendar.value.end || index < calendar.value.start
}

defineSlots()
</script>

<template>
  <div
    ref="parentEl"
    class="calendar"
  >
    <slot
      v-bind="{ input: date.format('DD.MM.YYYY HH:mm') }"
      :slot-props="date.format('DD.MM.YYYY HH:mm')"
    />

    <AFloating
      v-bind="{ ...props }"
      :reference-el="parentEl"
    >
      <div
        ref="calendarFloatingRef"
        class="calendar"
        :style="styles"
        :class="[classes]"
      >
        <ACard
          class="px-4 py-4 w-80 "
          variant="outline"
          color="primary"
        >
          <div class="flex flex-row justify-between mb-4 ">
            <ABtn
              icon-only
              icon="i-carbon:chevron-left"
              class="text-3"
              variant="text"
              @click="setMonth(-1)"
            />
            <div class="dark:color-gray-100 color-gray-600 capitalize flex items-center">
              {{ date.format('MMMM') }} {{ date.format('YYYY') }}
            </div>
            <ABtn
              icon-only
              icon="i-carbon:chevron-right"
              class="text-3"
              variant="text"
              @click="setMonth(1)"
            />
          </div>
          <div class="grid grid-cols-7 mb-4 border-b dark:border-gray-700 border-gray-300 pb-2">
            <div
              v-for="day in weekDays"
              :key="day"
              class="dark:color-gray-100  color-gray-500 capitalize flex items-center justify-center"
            >
              <div>
                {{ day }}
              </div>
            </div>
          </div>
          <div
            :key="date.month()"
            class="grid grid-cols-7"
          >
            <div
              v-for="item, index in calendar.range"
              :key="`${item}-${date.month()}-${index}`"
              class="flex items-center justify-center dark:color-gray-100 color-gray-600 "
              :class="[
                (isInactiveDate(index) || isWeekend(index)) && 'disable-day']"
            >
              <div
                class="rd-50 flex items-center cursor-pointer justify-center h-8 w-8 "
                :class="[
                  isSelectDate(item, index) && 'select-date',
                  isCurrentDate(item, index) && 'current-date',
                ]"
                @click="() => handleClick(index, item)"
              >
                {{ item }}
              </div>
            </div>
          </div>
          <div class="time-container flex justify-center mt-4 items-center">
            <div class="flex flex-col">
              <ABtn
                icon-only
                icon="i-carbon:chevron-up"
                class="text-3"
                variant="text"
                @click="setHours(+1)"
              />
              <ABtn
                icon-only
                icon="i-carbon:chevron-down"
                class="text-3"
                variant="text"
                @click="setHours(-1)"
              />
            </div>
            <div class="mx-4 text-7 dark:color-gray-100 color-gray-600">
              {{ displayTime.hours }}:{{ displayTime.minutes }}
            </div>
            <div class="flex flex-col">
              <ABtn
                icon-only
                icon="i-carbon:chevron-up"
                class="text-3"
                variant="text"
                @click="setMinutes(+5)"
              />
              <ABtn
                icon-only
                icon="i-carbon:chevron-down"
                class="text-3"
                variant="text"
                @click="setMinutes(-5)"
              />
            </div>
          </div>
        </ACard>
      </div>
    </AFloating>
  </div>
</template>

<style lang="postcss">
/* .calendar {
  /* @apply h-100vh */
/* } */
.calendar .select-date {
    @apply dark:bg-gray-600 bg-gray-100
}
.calendar .current-date {
  @apply !color-orange-500
}
.calendar .current-date.select-date {
  @apply color-gray-500
}
.calendar .disable-day {
  @apply !color-gray-400
}
</style>
