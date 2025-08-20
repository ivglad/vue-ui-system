<script setup>
import { LayoutGroup } from 'motion-v'

defineOptions({
  // Явно управляем пробросом атрибутов на внутренний элемент
  inheritAttrs: false,
})

const props = defineProps({
  // Контейнер
  tag: { type: String, default: 'div' },
  layout: { type: Boolean, default: true },
  preset: { type: String, default: undefined },
  overrides: { type: Object, default: undefined },

  // Контекст для потомков: Presence + LayoutGroup
  presence: { type: Boolean, default: true },
  // Режим AnimatePresence (например, 'sync', 'wait', 'popLayout')
  presenceMode: { type: String, default: 'sync' },
  layoutGroup: { type: Boolean, default: true },

  // Стаггер
  baseDelay: { type: Number, default: undefined },
  stepDelay: { type: Number, default: undefined },
  // Альтернатива: объектная форма стаггера
  stagger: { type: Object, default: undefined },
})

const attrs = useAttrs()

const {
  effectiveBase,
  effectiveStep,
  delayOf,
  shouldUseMotionContainer,
  containerMotionProps,
} = useMotionGroupProps(props, attrs)

const presenceModeValue = computed(() =>
  props.presence ? props.presenceMode : undefined,
)
</script>

<template>
  <template v-if="shouldUseMotionContainer">
    <MotionElement
      :tag="tag"
      :layout="layout"
      :motionProps="containerMotionProps"
      v-bind="$attrs">
      <template v-if="layoutGroup">
        <LayoutGroup>
          <PresenceWrapper :mode="presenceModeValue">
            <slot
              :delayOf="delayOf"
              :baseDelay="effectiveBase"
              :stepDelay="effectiveStep" />
          </PresenceWrapper>
        </LayoutGroup>
      </template>
      <template v-else>
        <PresenceWrapper :mode="presenceModeValue">
          <slot
            :delayOf="delayOf"
            :baseDelay="effectiveBase"
            :stepDelay="effectiveStep" />
        </PresenceWrapper>
      </template>
    </MotionElement>
  </template>
  <template v-else>
    <component :is="tag" v-bind="$attrs">
      <template v-if="layoutGroup">
        <LayoutGroup>
          <PresenceWrapper :mode="presenceModeValue">
            <slot
              :delayOf="delayOf"
              :baseDelay="effectiveBase"
              :stepDelay="effectiveStep" />
          </PresenceWrapper>
        </LayoutGroup>
      </template>
      <template v-else>
        <PresenceWrapper :mode="presenceModeValue">
          <slot
            :delayOf="delayOf"
            :baseDelay="effectiveBase"
            :stepDelay="effectiveStep" />
        </PresenceWrapper>
      </template>
    </component>
  </template>
</template>
