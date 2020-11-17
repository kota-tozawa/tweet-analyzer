import { array, object, string } from 'yup'

export const validationSchema = object({
  period: string().required('必須項目です'),
  userName: string().required('必須項目です'),
})
