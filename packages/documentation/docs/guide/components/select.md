# Select

<!-- 👉 Basic -->
<Demo>

## Basic

You can use `ASelect` component to render basic select.

<div class="grid grid-cols-2">
    <div>
        <DemoSelectBasic />
    </div>
</div>

<template #code>

<<< @/demos/select/DemoSelectBasic.vue

</template>

</Demo>

<!-- 👉 Placeholder -->
<Demo>

## Placeholder

You can use `placeholder` attribute to add placeholder to the select.

<div class="grid grid-cols-2">
    <div>
        <DemoSelectPlaceholder />
    </div>
</div>

<template #code>

<<< @/demos/select/DemoSelectPlaceholder.vue

</template>

</Demo>

<!-- 👉 Label -->
<Demo>

## Label

You can use `label` prop to add label to the select.

<div class="grid grid-cols-2">
    <div>
        <DemoSelectLabel />
    </div>
</div>

<template #code>

<<< @/demos/select/DemoSelectLabel.vue

</template>

</Demo>

<!-- 👉 Hint -->
<Demo>

## Hint

You can use `hint` prop to add hint to the select.

<div class="grid grid-cols-2">
    <div>
        <DemoSelectHint />
    </div>
</div>

<template #code>

<<< @/demos/select/DemoSelectHint.vue

</template>

</Demo>

<!-- 👉 Icons -->
<Demo>

## Icons

You can use `append-inner-icon` prop to change icon of the select component.

To prepend the icon use `prepend-inner-icon` prop.

Moreover, you can also use `append-icon` & `prepend-icon` prop to add icon outside of the select component.

<DemoSelectIcons />

<template #code>

<<< @/demos/select/DemoSelectIcons.vue

</template>

</Demo>

<!-- 👉 States -->
<Demo>

## States

You can use `readonly` attribute to make select read only.

Use `disabled` attribute to make select disabled.

<DemoSelectStates />

<template #code>

<<< @/demos/select/DemoSelectStates.vue

</template>

</Demo>