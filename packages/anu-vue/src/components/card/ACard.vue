<script lang="ts" setup>
import { ATypography } from '../typography'
import { cardProps } from './props'
import type { cardSlots } from './slots'
import { cardTypographySlots } from './slots'
import { ALoader } from '@/components/loader'
import { isTypographyUsed } from '@/components/typography/utils'
import { ConfigurableValue, useConfigurable } from '@/composables/useConfigurable'
import { useLayer } from '@/composables/useLayer'

const props = defineProps(cardProps)

defineOptions({
  name: 'ACard',
})

defineSlots<typeof cardSlots>()

const slots = useSlots()

const { getLayerClasses } = useLayer()
const { styles, classes } = getLayerClasses(
  toRef(props, 'color'),
  toRef(props, 'variant'),
  toRef(props, 'states'),
)

const _isTypographyUsed = isTypographyUsed(toRefs(props), slots)

// Modify text prop to have `text-sm`
const _textProp = useConfigurable(toRef(props, 'text'))
if (_textProp.value.classes === undefined)
  _textProp.value.classes = 'text-sm'
else if (Array.isArray(_textProp.value.classes))
  _textProp.value.classes = [..._textProp.value.classes, 'text-sm']
else
  _textProp.value.classes = ' text-sm'

const cardRef = ref<HTMLElement | null>(null)

defineExpose({
  cardRef,
})
</script>

<template>
  <div
    ref="cardRef"
    class="a-card relative overflow-hidden bg-[hsla(var(--a-surface-c),var(--un-bg-opacity,1))]"
    :class="classes"
    :style="styles"
  >
    <!-- 👉 Loader  -->
    <!--
        ℹ️ We have intentionally placed loader on top.
        Because we have card content style based on last child pseudo selector.
    -->
    <ALoader
      v-if="typeof props.loading !== 'undefined'"
      v-bind="typeof props.loading === 'boolean' ? { loading: props.loading } : props.loading"
    />

    <!-- 👉 Image -->
    <img
      v-if="props.img"
      :src="props.img"
      :alt="props.imgAlt"
    >

    <!-- 👉 Typography -->
    <div
      v-if="_isTypographyUsed"
      class="a-card-typography-wrapper"
    >
      <ATypography
        :title="props.title"
        :subtitle="props.subtitle"
        :text="Object.values(_textProp) as ConfigurableValue"
      >
        <!-- ℹ️ Recursively pass down slots to child -->
        <template
          v-for="name in Object.keys(cardTypographySlots)"
          #[name]="slotProps"
        >
          <slot
            :name="name"
            v-bind="slotProps || {}"
          />
        </template>
      </ATypography>
    </div>

    <!-- 👉 Slot: Default -->
    <slot />
  </div>
</template>
