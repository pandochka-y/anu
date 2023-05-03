<script lang="ts" setup>
import { useToggle } from '@vueuse/core'
import { ref } from 'vue'

const colors = [
  'primary',
  'success',
  'info',
  'warning',
  'danger',
]

const inputRef = ref<string>('')

const [showCalendar, toggleShowCalendar] = useToggle(true)
</script>

<template>
  <div class="container mx-auto min-h-screen">
    <ACard
      title="Playground"
      class="m-8"
    >
      <div class="a-card-body flex items-center gap-4">
        <!-- <ABtn
          v-for="color in colors"
          :key="color"
          class="focus:ring-4 transition-shadow transition-ease-both ring-offset-0 ring-[hsla(var(--a-layer-c),.35)]"
          :color="color"
        >
          {{ color }}
        </ABtn> -->
        <AIcon icon="i-bx-home" />
        <AInput />

        <div>
          qe
          <ATooltip text="123" />
        </div>
        {{ inputRef }}
        <div @click="toggleShowCalendar()">
          container
          <ADatePicker
            v-model="showCalendar"
            class="testest"
          >
            <template #default="{ input }">
              {{ input }}
              <AInput :model-value="input" />
            </template>
          </ADatePicker>
        </div>
      </div>
    </ACard>
  </div>
</template>
