# `useGroupModel`

<!-- 👉 Basic -->
::::card Basic

`useGroupModel` allows you to create `v-model` like binding for a group.

You can use `multi` property to enable selecting multiple values from options.

:::code DemoUseGroupModelBasic
<<< @/components/demos/composables/useGroupModel/DemoUseGroupModelBasic.vue{6-9}
:::

::::

<!-- 👉 Indexed -->
::::card Indexed

You can also create options without predefined value. Pass any positive number to `options` property and it will create index based options.

:::code DemoUseGroupModelIndexed
<<< @/components/demos/composables/useGroupModel/DemoUseGroupModelIndexed.vue{4}
:::

::::

<!-- 👉 Object -->
::::card Object

description

:::code DemoUseGroupModelObject
<<< @/components/demos/composables/useGroupModel/DemoUseGroupModelObject.vue{4-11}
:::

::::
