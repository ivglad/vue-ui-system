import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import {
  apiLoginUser,
  apiLogoutUser,
} from './api'

/**
 * Mutation hook for logging in a user.
 *
 * @example
 * const { mutate: loginUserMutation } = useLoginUser()
 * loginUserMutation({ email: 'user@example.com', password: 'password' })
 *
 * @param {Object} data - Login data.
 * @param {string} data.email - User email.
 * @param {string} data.password - User password.
 * @returns {Promise} Promise of the mutation result.
 */
export const useLoginUser = () => {
  return useMutation({
    mutationFn: (data) => {
      return apiLoginUser(data)
    },
  })
}

/**
 * Mutation hook for logging out a user.
 *
 * @example
 * const { mutate: logoutUserMutation } = useLogoutUser()
 * logoutUserMutation()
 *
 * @returns {Promise} Promise of the mutation result.
 */
export const useLogoutUser = () => {
  return useMutation({
    mutationFn: () => {
      return apiLogoutUser()
    },
  })
}
