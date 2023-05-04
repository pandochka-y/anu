import { flip, offset, shift } from '@floating-ui/vue'
import type { ExtractPropTypes, PropType } from 'vue'
import type { MiddlewareFunc } from '@/components/floating'
import { floatingProps } from '@/components/floating'
import { useProps as useLayerProps } from '@/composables/useLayer'
import { defuProps } from '@/composables/useProps'

const { referenceEl: _, middleware: __, ...floatingRestProps } = floatingProps
export const middlewareFunc: MiddlewareFunc = () => [
  offset(10),
  flip(),
  shift({ padding: 10 }),

  // arrow({
  //   element: arrowEl,
  // }),
]

// TODO: Fix types (add types so we get autocomplete)
const dataPickerDefaultProps = {
  trigger: {
    default: 'hover',
  },
  placement: {
    default: 'bottom',
  },
  showTime: {
    default: true,
  },

  ...useLayerProps({
    color: {
      default: 'primary',
    },
    variant: {
      default: 'fill',
    },
    states: {
      default: true,
    },
  }),
}

export const datePickerProps = {
  ...defuProps(dataPickerDefaultProps, floatingRestProps),

  // https://floating-ui.com/docs/tutorial#middleware
  /**
   * Middleware option from Floating UI
   */

  modelValue: {
    type: Date,
  },

  format: {
    type: String,
    default: 'DD MMMM YYYY HH:mm',
  },
  middleware: {
    type: Function as PropType<MiddlewareFunc>,
    default: middlewareFunc,
  },

  /**
    * Text to render in tooltip
    */
  text: {
    type: String,
    default: '',
  },
}

export type DataPickerProps = ExtractPropTypes<typeof datePickerProps>
