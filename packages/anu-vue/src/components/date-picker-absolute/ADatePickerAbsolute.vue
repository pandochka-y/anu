<script lang="ts" setup>
import type { Dayjs } from 'dayjs'
import { datePickerProps } from './props'

import type { dateOwnSlots } from './slots'
import type { TKeyDisplayTime } from '@/composables'

import { useDate, useLayer } from '@/composables'

const props = defineProps(datePickerProps)

const emits = defineEmits(['update:modelValue'])

defineOptions({
  name: 'ADatePicker',
  inheritAttrs: false,
})

const dateCompose = useDate(props.modelValue)

const parentEl = ref<HTMLElement | null>(null)

const { getLayerClasses } = useLayer()

const { styles, classes } = getLayerClasses(
  toRef(props, 'color'),
  toRef(props, 'variant'),
  toRef(props, 'states'),
)

defineSlots<typeof dateOwnSlots>()

const [showCalendar, toggleShowCalendar] = useToggle(true)

function resetInput(input: HTMLInputElement, id: TKeyDisplayTime) {
  const resetValue = dateCompose.displayTime.value[id].value
  input.value = resetValue || '00'
}

function validateInput(event: Event) {
  const target = event.target as HTMLInputElement
  const id = target.id as TKeyDisplayTime
  const newValue = parseInt(target.value)

  if (isNaN(newValue) || newValue > dateCompose.displayTime.value[id].max)
    resetInput(target, id)
  else
    dateCompose.setDisplayTime(newValue, id, false)
}

watch(() => dateCompose.date.value, (d: Dayjs) => {
  emits('update:modelValue', d.toDate())
}, { immediate: true },
)
</script>

<template>
  <div ref="parentEl">
    <div @click="toggleShowCalendar()">
      <slot v-bind="{ formattedDate: dateCompose.date.value.format(props.format) }" />
    </div>

    <AFloating
      v-bind="{ ...props }"
      v-model="showCalendar"
      :reference-el="parentEl"
    >
      <div
        class="calendar"
        :class="[classes]"
      >
        <ACard
          class="em:px-4 em:py-4 em:w-80 "
          variant="outline"
          color="primary"
        >
          <div class="flex flex-row justify-between em:mb-4 ">
            <ABtn
              icon-only
              icon="i-carbon:chevron-left"
              class="em:text-3"
              variant="text"
              @click="dateCompose.setMonth(-1)"
            />
            <div class="dark:color-gray-100 color-gray-600 capitalize flex items-center">
              {{ dateCompose.date.value.format('MMMM') }} {{ dateCompose.date.value.format('YYYY') }}
            </div>
            <ABtn
              icon-only
              icon="i-carbon:chevron-right"
              class="em:text-3"
              variant="text"
              @click="dateCompose.setMonth(1)"
            />
          </div>
          <div class="grid grid-cols-7 em:mb-4 border-b dark:border-gray-700 border-gray-300 em:pb-2">
            <div
              v-for="day in dateCompose.weekDays"
              :key="day"
              class="dark:color-gray-100  color-gray-500 capitalize flex items-center justify-center"
            >
              <div>
                {{ day }}
              </div>
            </div>
          </div>
          <div
            :key="dateCompose.date.value.month()"
            class="grid grid-cols-7"
          >
            <div
              v-for="item, index in dateCompose.calendar.value.range"
              :key="`${item}-${dateCompose.date.value.month()}-${index}`"
              class="flex items-center justify-center dark:color-gray-100 color-gray-600 "
              :class="[
                (dateCompose.isInactiveDate(index) || dateCompose.isWeekend(index)) && 'disable-day']"
            >
              <div
                class="rd-50 flex items-center cursor-pointer justify-center em:h-8 em:w-8 "
                :class="[
                  dateCompose.isSelectDate(item, index) && 'select-date',
                  dateCompose.isCurrentDate(item, index) && 'current-date',
                ]"
                @click="() => dateCompose.handleClick(index, item)"
              >
                {{ item }}
              </div>
            </div>
          </div>
          <div
            v-if="props.showTime"
            class="time-container flex justify-center em:mt-4 items-center"
          >
            <div class="flex flex-col">
              <ABtn
                icon-only
                icon="i-carbon:chevron-up"
                class="em:text-3"
                variant="text"
                @click="dateCompose.setDisplayTime(+1, 'hours')"
              />
              <ABtn
                icon-only
                icon="i-carbon:chevron-down"
                class="em:text-3"
                variant="text"
                @click="dateCompose.setDisplayTime(-1, 'hours')"
              />
            </div>

            <div class="em:mx-4 em:text-7 dark:color-gray-100 color-gray-600 items-center flex ">
              <input
                id="hours"
                class="em:w-10 text-center"
                type="number"
                :value="dateCompose.displayTime.value.hours.value"
                @change="(e) => validateInput(e)"
              >
              :
              <input
                id="minutes"
                class="em:w-10 text-center"
                type="number"
                :value="dateCompose.displayTime.value.minutes.value"
                @change="(e) => validateInput(e)"
              >
            </div>
            <div class="flex flex-col">
              <ABtn
                icon-only
                icon="i-carbon:chevron-up"
                class="em:text-3"
                variant="text"
                @click="dateCompose.setDisplayTime(+5, 'minutes')"
              />
              <ABtn
                icon-only
                icon="i-carbon:chevron-down"
                class="em:text-3"
                variant="text"
                @click="dateCompose.setDisplayTime(-5, 'minutes')"
              />
            </div>
          </div>

          {{ dateCompose.displayTime.value.hours }}:{{ dateCompose.displayTime.value.minutes }}
        </ACard>
      </div>
    </AFloating>
  </div>
</template>

<style lang="postcss">
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
