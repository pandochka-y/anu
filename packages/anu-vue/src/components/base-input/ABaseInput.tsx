import { defineComponent, PropType } from 'vue';

export const ABaseInput = defineComponent({
    name: 'ABaseInput',
    props: {
        inputContainerClasses: [Array, String, Object] as PropType<string | string[] | object>,
        inputWrapperClasses: [Array, String, Object] as PropType<string | string[] | object>,
        hint: String,
        error: String,
        label: String,
        prependIcon: String,
        appendIcon: String,
        prependInnerIcon: String,
        appendInnerIcon: String,
    },
    setup(props, { slots, attrs }) {
        const iconTransition = "transition duration-150 ease -in"
        const elementId = attrs.id || props.label ? `a-input-${attrs.id || props.label}` : undefined

        return () => <div class={["i:children:focus-within:text-primary flex flex-col gap-y-1", props.inputContainerClasses]}>
            {/* 👉 Label */}
            {
                slots.label
                    ? slots.label?.()
                    : props.label
                        ? <label for={elementId} class={['a-base-input-label', props.error ? 'text-danger' : null]}>{props.label}</label>
                        : null
            }

            <div class="flex i:flex-shrink-0 i:w-6 i:h-6 gap-x-3 items-center">
                {/* 👉 Slot: Prepend */}
                {
                    slots.prepend
                        ? slots.prepend?.()
                        : props.prependIcon
                            ? <i class={[iconTransition, props.prependIcon]} />
                            : null
                }

                {/* SECTION Input wrapper */}
                <div class={[
                    `${props.error ? 'border-danger' : 'focus-within:border-primary'}`,
                    'relative i:focus-within:text-primary transition duration-250 ease-out flex i:flex-shrink-0 i:w-5 i:h-5 gap-x-2 items-center h-12 border border-solid border-[hsl(var(--border-color))] w-full rounded-lg',
                    props.inputWrapperClasses
                ]}>

                    {/* 👉 Slot: Prepend Inner */}
                    {
                        slots['prepend-inner']
                            ? slots['prepend-inner']?.()
                            : props.prependInnerIcon
                                ? <i class={['inline-block ml-3 z-1', iconTransition, props.prependInnerIcon]} />
                                : null
                    }

                    {/* 👉 Slot: Default */}
                    {slots.default?.({
                        class: ["absolute inset-0 rounded-inherit placeholder:transition placeholder:duration-250 placeholder:ease  focus:placeholder:translate-x-1", slots['prepend-inner'] || props.prependInnerIcon ? 'pl-10' : 'pl-4', slots['append-inner'] || props.appendInnerIcon ? 'pr-10' : 'pr-4', `${attrs.hasOwnProperty('disabled') ? 'bg-gray-200 opacity-50' : ''}`],
                        ...attrs,
                        id: elementId,
                    })}

                    {/* 👉 Slot: Append Inner */}
                    {
                        slots['append-inner']
                            ? slots['append-inner']?.()
                            : props.appendInnerIcon
                                ? <i class={['inline-block mr-3 ml-auto', iconTransition, props.appendInnerIcon]} />
                                : null
                    }
                </div>
                {/* !SECTION */}

                {/* 👉 Slot: Append */}
                {
                    slots.append
                        ? slots.append?.()
                        : props.appendIcon
                            ? <i class={[iconTransition, props.appendIcon]} />
                            : null
                }
            </div>
            {/* 👉 Slot: Bottom */}
            {
                slots.bottom
                    ? slots.bottom?.()
                    : <div class="h-8">
                        {
                            props.error || props.hint
                                ? <small class={`inline-block ${props.error ? 'text-danger' : 'text-gray-400'}`}>{props.error || props.hint}</small>
                                : null
                        }
                    </div>
            }
        </div>
    },
})

export type ABaseInput = InstanceType<typeof ABaseInput>