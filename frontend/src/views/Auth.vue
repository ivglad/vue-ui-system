<script setup>
const userStore = useUserStore()
const router = useRouter()
const toast = useToast()

// Композабл для обработки ошибок
const { handleAuthError, clearError } = useAuthErrorHandler()

const initialValues = ref({
  email: '',
  password: '',
})

const loginSchema = z.object({
  email: z.string().trim().email({ message: 'Введите корректный Email' }),
  password: z
    .string()
    .trim()
    .min(3, { message: 'Минимум 3 символа' })
    .refine((value) => /[a-z]/.test(value), {
      message: 'Должен содержать строчные латинские буквы',
    }),
})

const loginResolver = zodResolver(loginSchema)

const { mutate: loginUserMutation, isPending: loginUserIsPending } =
  useLoginUser()

/**
 * Обработать отправку формы авторизации
 * @param {Object} e - событие формы
 */
const loginSubmit = async (e) => {
  if (!e.valid) return

  clearError()

  const { email, password } = e.states

  loginUserMutation(
    {
      email: email.value,
      password: password.value,
    },
    {
      onError: (error) => {
        // Обрабатываем ошибку через композабл
        handleAuthError(error, {
          action: 'login',
          context: { email: email.value },
        })

        // Помечаем поля как невалидные
        e.states.email.valid = false
        e.states.email.invalid = true
        e.states.password.valid = false
        e.states.password.invalid = true

        toast.add({
          severity: 'error',
          summary: 'Ошибка авторизации',
          detail: error?.response?.data?.message || 'Неверные учетные данные',
          life: 5000,
        })
      },
      onSuccess: (data) => {
        const { user, token } = data.data.data
        // Объединяем данные пользователя с токеном
        const userData = {
          ...user,
          accessToken: token,
        }
        userStore.initUser(userData)
        router.push('/chat')
      },
    },
  )
}

defineOptions({
  name: 'AuthPage',
})
</script>

<template>
  <div
    class="flex h-screen w-full flex-1 flex-col items-center justify-center gap-5 self-center">
    <AnimatedContainer
      tag="h1"
      :index="0"
      preset="fadeIn"
      class="mb-6 text-2xl font-semibold"
      >Авторизация</AnimatedContainer
    >

    <AnimatedContainer
      tag="div"
      :index="1"
      preset="fadeIn"
      class="flex w-full max-w-[350px] justify-center">
      <Form
        class="flex w-full max-w-md flex-col items-center"
        :initialValues
        :resolver="loginResolver"
        @submit="loginSubmit">
        <AnimatedContainer
          tag="div"
          :index="2"
          preset="fadeIn"
          class="mb-8 w-full">
          <FormField
            v-slot="$field"
            :validateOnValueUpdate="false"
            validateOnBlur
            name="email">
            <FloatLabel class="app-input text-base">
              <InputText
                id="auth-form-email"
                v-tooltip.top="{
                  value: $field.error?.message,
                  showDelay: 500,
                }"
                :invalid="$field?.invalid"
                fluid
                class="rounded-xl text-base" />
              <Message
                v-if="$field?.invalid && $field.error?.message"
                class="app-input-message"
                :severity="$field?.invalid ? 'error' : 'contrast'"
                variant="simple">
                {{ $field.error?.message }}
              </Message>
              <label for="auth-form-email">Email</label>
            </FloatLabel>
          </FormField>
        </AnimatedContainer>

        <AnimatedContainer
          tag="div"
          :index="3"
          preset="fadeIn"
          class="mb-6 w-full">
          <FormField v-slot="$field" validateOnValueUpdate name="password">
            <FloatLabel class="app-input">
              <Password
                id="auth-form-password"
                v-tooltip.top="{
                  value: $field.error?.message,
                  showDelay: 500,
                }"
                type="text"
                :feedback="false"
                toggleMask
                fluid
                class="rounded-xl text-base" />
              <Message
                v-if="$field?.invalid && $field.error?.message"
                class="app-input-message"
                :severity="$field?.invalid ? 'error' : 'contrast'"
                variant="simple">
                {{ $field.error?.message }}
              </Message>
              <label for="auth-form-password">Пароль</label>
            </FloatLabel>
          </FormField>
        </AnimatedContainer>

        <AnimatedContainer tag="div" :index="4" preset="fadeIn">
          <Button
            class="h-[3.25rem] w-fit rounded-xl p-4 text-base"
            type="submit"
            label="Войти в систему"
            :disabled="loginUserIsPending">
          </Button>
        </AnimatedContainer>
      </Form>
    </AnimatedContainer>
  </div>
</template>
